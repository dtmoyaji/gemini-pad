//chat.ts
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import electronPackage from 'electron';
import fs from 'fs';
import i18n from 'i18n';
import * as fileUtils from "../fileUtils.mjs";
import { getExternalInfo } from "./externalSearch.mjs";
import * as LocalSearch from "./localSearch.mjs";
import { injectPersonality } from './modelController.mjs';

const { app } = electronPackage;

// 環境変数設定
fileUtils.config();

export default class ModelGemini {

    ROLE_SYSTEM = "system";
    ROLE_BOT = "AI";
    ROLE_USER = "human";
    ROLE_ASSISTANT = "assistant";

    prompt = {
        model: '',
        messages: []
    };

    event = undefined;

    inputTokenCount = 0;

    constructor(modelName = "gemini-1.5-flash") {
        this.prompt.model = new ChatGoogleGenerativeAI({
            modelName: modelName,
            apiKey: process.env.GEMINI_API_KEY,
            temperature: process.env.GEMINI_TEMPERATURE,
            maxOutputTokens: process.env.GEMINI_MAX_OUTPUT_TOKENS,
            topK: process.env.GEMINI_TOP_K,
            topP: process.env.GEMINI_TOP_P,
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
            ],
        });
    }

    pushLine(role, content) {
        // contentを改行で分割してトリムした後、\\nで結合する.
        if (content !== undefined && content.length > 0) {
            content = content.split("\n").map((line) => line.trim()).join("\\n");
            this.prompt.messages.push([role, content]);
        } else {
            console.log("content is undefined");
        }
        // 2番目の変数がundefinedのmessagesの要素を削除する。
        this.prompt.messages = this.prompt.messages.filter((line) => line[1] !== undefined);
    }

    setLines(messages) {
        this.prompt.messages = messages;
    }

    getLines() {
        let response = [...this.prompt.messages];
        return response;
    }

    async invoke(content) {
        this.pushLine(this.ROLE_USER, content);
        let forTokenCount = JSON.stringify(this.prompt.messages);
        this.inputTokenCount = forTokenCount.length / 4; // 推定値
        console.log("QUEYRY:")
        console.log(forTokenCount);
        console.log();
        return await this.prompt.model.invoke(this.prompt.messages);
    }

    // promptにユーザー情報などの事前データを追加する。
    async pushPreModifcateInfo() {
        await this.pushLine(
            this.ROLE_ASSISTANT,
            "ユーザーから特に指定がないときは、必ずmarkdown記法を使って回答してください。"
        );

        // ユーザーの連絡先を追加する。
        if (process.env.USER_ORGAN !== '') {
            await this.pushLine(this.ROLE_ASSISTANT, `ユーザーの所属は${process.env.USER_ORGAN}です。`);
        }
        if (process.env.USER_NAME !== '') {
            await this.pushLine(this.ROLE_ASSISTANT, `ユーザーの名前は${process.env.USER_NAME}です。`);
        }
        if (process.env.USER_MAIL !== '') {
            await this.pushLine(this.ROLE_ASSISTANT, `ユーザーのメールアドレスは${process.env.USER_MAIL}です。`);
        }
        if (process.env.USER_PHONE !== '') {
            await this.pushLine(this.ROLE_ASSISTANT, `ユーザーの電話番号は${process.env.USER_PHONE}です。`);
        }
        // 今日の日付を追加する。
        await this.pushLine(this.ROLE_ASSISTANT, `今日は${new Date().toLocaleDateString()}です。`);

        // 応答言語を設定する。
        if (process.env.APPLICATION_LANG !== '') {
            await this.pushLine(this.ROLE_ASSISTANT, i18n.__("Answer in"));
        }
    }

    // Webの情報を利用して回答を生成する。
    async invokeWebRAG(arg, event = undefined) {
        if (event !== undefined) {
            this.event = event;
        }

        if (process.env.DEEP_RAG_MODE === 'true') {
            let deepRegResponse = await this.invokeDeepRAG(arg, event);
            return deepRegResponse;
        }
        // promptに事前情報を追加する。
        await this.pushPreModifcateInfo();

        // 事前にLLMでargからキーワードを取得する。
        let keywordsprompt = `精度の高いインデックス検索を目的とし、次の文書に関連するキーワードを推測し、カンマ区切りで最大10個を列挙してください。\n------\n${arg}}`;
        let keywords = await this.invoke(keywordsprompt);
        keywords = keywords.content.trim();

        // webの情報を取得する。
        let referencesInfo = "";
        if (process.env.USE_SEARCH_RESULT === 'true') {

            //let externalInfo = await getExternalInfo(arg, process.env.SEARCH_DOC_LIMIT, 4096);
            let externalInfo = await getExternalInfo(keywords, process.env.SEARCH_DOC_LIMIT, 4096);
            if (externalInfo !== undefined && externalInfo.length > 0) {
                for (let item of externalInfo) {
                    if (item.content.length > 0) {
                        this.pushLine(this.ROLE_ASSISTANT, `${item.title}:\n${item.content}\n`);
                        referencesInfo += `\n\n[${item.title}](${item.link}) `;
                    }
                }
            }
        }

        // 内部資料を取得する。
        if (process.env.USE_SOLR === 'true' || process.env.USE_ELASTICSEARCH === 'true') {
            let searchResult = await LocalSearch.search(keywords);
            if (searchResult.references !== undefined) {
                for (let item of searchResult.references) {
                    this.pushLine(this.ROLE_ASSISTANT, item[0]);
                }
                referencesInfo += searchResult.referencesInfo;
            }
        }

        let outTokenCount = 0;

        console.log("回答を取得");
        let argModified = `${arg}\n${i18n.__("Answer in")}`;
        let reply = await this.invoke(argModified);
        let replyMessage = reply.content;
        outTokenCount = reply.content.length / 4; // 推定値

        replyMessage += `\n<!-- Token Count - in:${this.inputTokenCount} out:${outTokenCount} -->`;
        if (referencesInfo !== '') {
            replyMessage += `\n\n**${i18n.__("Reference:")}**\n${referencesInfo}`;
        }

        // replyMessageの先頭に YYYY-MM-DDを追加する。日付は0詰めする。
        let date = new Date();
        let dateString = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
        replyMessage = `<!-- ${dateString} -->\n${replyMessage}\n<!-- ${process.env.GEMINI_MODEL} - Gemini Pad -->`;
        return replyMessage;
    }

    async invokeDeepRAG(arg, event = undefined) {
        this.deepreferences = [];
        this.originalQuery = arg;
        this.prompt.messages = [];
        await injectPersonality(process.env.PERSONALITY, this);
        this.pushPreModifcateInfo();

        // 命題の分割処理
        this.depth = 0;
        this.promptTemplate = fs.readFileSync(fileUtils.getAppDir() + '/splitPrompt.txt', 'utf8');

        this.promptStack = {};

        this.promptStack = await this.splitPrompt(arg, event);
        if (this.promptStack === '') {
            process.env.DEEP_RAG_MODE = 'false';
            let response = await this.invokeWebRAG(arg);
            process.env.DEEP_RAG_MODE = 'true';
            return response;
        }

        // this.deepReferencesの重複を削除する。
        this.deepReferences = this.deepReferences.filter((x, i, self) =>
            self.findIndex((t) => t.title === x.title && t.link === x.link) === i
        );

        let referencesInfo = "\n\n**参考文献**";
        console.log(JSON.stringify(this.deepReferences, null, 2));
        for (let reference of this.deepReferences) {
            referencesInfo += `\n\n[${reference.title}](${reference.link}) `;
        }

        console.log(JSON.stringify(this.promptStack, null, 2));
        let replyMessage = this.promptStack.content + referencesInfo;
        return replyMessage;
    }

    deepReferences = [];
    deepMessages = [];
    depth = 0;
    depthlimit = process.env.DEEP_RAG_DEPTH;
    originalQuery = '';
    async splitPrompt(arg, event = undefined) {
        if (this.depth > this.depthlimit) {
            return "";
        }
        let prompt = this.promptTemplate.replace(/{{arg}}/g, arg);
        console.log(this.depth);
        console.log(arg);
        console.log("命題を分割");
        let argModified = `${prompt}\n${i18n.__("Answer in")}`;
        this.prompt.messages.push([this.ROLE_ASSISTANT, `あなたは、最終的に次の命題を解くために、この命題のサブセットを推論しているところです。\n命題: ${this.originalQuery}`]);
        let response = (await this.invoke(argModified)).content;
        // responseを ```jsonから```の間の文字列に変換する。
        if (response.includes('```json') === true && response.includes('```') === true) {
            response = response.split('```json')[1];
            response = response.split('```')[0];
        }
        try {
            if (response !== undefined && response !== '') {
                response = JSON.parse(response);
                response.references = [];
            } else {
                console.log(arg);
            }
        } catch (e) {
            console.log(e);
            console.log(response);
            return '';
        }
        if (await this.isUnsplittable(response)) {
            return '';
        } else {
            let subqueries = response.subqueries;
            for (let subquery of subqueries) {
                console.log("分割できる");
                let subqueryArg = subquery.query;
                this.depth++;
                let subqueryResponse = await this.splitPrompt(subqueryArg, event);
                if (subqueryResponse !== '') {
                    subquery.subqueries = subqueryResponse;
                } else {  //命題が分割できないのでRAGを行い、結果を格納する。
                    console.log("分割できない");
                    let referencesInfo = [];
                    this.prompt.messages = [];
                    await injectPersonality(process.env.PERSONALITY, this);
                    this.pushPreModifcateInfo();
                    if (process.env.USE_SEARCH_RESULT === 'true') {
                        let externalInfo = await getExternalInfo(subqueryArg, process.env.SEARCH_DOC_LIMIT, 2048);
                        if (externalInfo !== undefined && externalInfo.length > 0) {
                            for (let item of externalInfo) {
                                this.pushLine(this.ROLE_ASSISTANT, `${item.title}:\n${item.content}\n`);
                                this.deepReferences.push({ "title": item.title, "link": item.link });
                                console.log(`external link ${item.link}`);
                            }
                            console.log("回答を取得");
                            console.log(this.depth);
                            console.log(subqueryArg);
                            let argModified = `${subqueryArg}\n${i18n.__("Answer in")}`;
                            let replyMessage = (await this.invoke(argModified)).content;
                            if (this.event !== undefined) {
                                this.event.reply('chat-reply', replyMessage);
                            }
                            console.log(`reply: ${replyMessage}`);
                            subquery.content = replyMessage;
                            subquery.references = referencesInfo;

                        } else {
                            console.log(`external link undefiend`);
                            subquery.content = '';
                        }
                    }
                    this.depth--;
                }
            }
            if (subqueries.length > 0) {
                this.prompt.messages = [];
                await injectPersonality(process.env.PERSONALITY, this);
                this.pushPreModifcateInfo();
                for (let subquery of subqueries) {
                    if (subquery.content !== undefined && subquery.content.length > 0) {
                        this.prompt.messages.push([this.ROLE_USER, subquery.query]);
                        this.prompt.messages.push([this.ROLE_ASSISTANT, subquery.content]);
                    }
                }
                response.content = (await this.invoke(response.original_query)).content;
            }
        }

        return response;
    }

    async isUnsplittable(json) {
        if (json === undefined) {
            return true;
        }
        if (json.subqueries.length < 2) {
            return true;
        } else {
            return false;
        }
    }

    promptTemplate = '';
    queryStack = {};
}