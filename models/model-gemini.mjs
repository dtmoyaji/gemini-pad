//chat.ts
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import i18n from 'i18n';
import * as fileUtils from "../fileUtils.mjs";
import { getExternalInfo } from "./externalSearch.mjs";
import * as LocalSearch from "./localSearch.mjs";


// 環境変数設定
fileUtils.config();
export default class ModelGemini {

    ROLE_USER = "human";
    ROLE_BOT = "AI";
    ROLE_ASSISTANT = "assistant";
    ROLE_SYSTEM = "system";

    lines = [];

    inputTokenCount = 0;

    constructor(modelName = "gemini-1.0-pro") {
        this.model = new ChatGoogleGenerativeAI({
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

    pushLine(role, text) {
        // textを改行で分割してトリムした後、\\nで結合する.
        text = text.split("\n").map((line) => line.trim()).join("\\n");
        this.lines.push([role, text]);
    }

    setLines(lines) {
        this.lines = lines;
    }

    getLines() {
        let response = [...this.lines];
        return response;
    }

    async invoke(text) {
        this.pushLine("human", text);
        this.inputTokenCount = await this.model.getNumTokens(JSON.stringify(this.lines));
        return await this.model.invoke(this.lines);
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
    async invokeWebRAG(arg) {
        // promptに事前情報を追加する。
        await this.pushPreModifcateInfo();

        // webの情報を取得する。
        let referencesInfo = "";
        if (process.env.USE_SEARCH_RESULT === 'true') {
            let externalInfo = await getExternalInfo(arg, process.env.SEARCH_DOC_LIMIT, 4096);
            if (externalInfo !== undefined && externalInfo.length > 0) {
                for (let item of externalInfo) {
                    this.pushLine(this.ROLE_ASSISTANT, `${item.title}:\n${item.content}\n`);
                    referencesInfo += `\n\n[${item.title}](${item.link}) `;
                }
            }
        }

        // 内部資料を取得する。
        if (process.env.USE_SOLR === 'true' || process.env.USE_ELASTICSEARCH === 'true') {
            let searchResult = await LocalSearch.search(arg);
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
        outTokenCount = await this.model.getNumTokens(reply.content);
        
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
}

