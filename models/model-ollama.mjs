import fs from 'fs';
import i18n from 'i18n';
import ollama from 'ollama';
import * as fileUtils from "../fileUtils.mjs";
import { getExternalInfo } from "./externalSearch.mjs";
import * as LocalSearch from "./localSearch.mjs";
import { injectPersonality } from './modelController.mjs';

// 環境変数設定
fileUtils.config();

export default class ModelOllama {

    ROLE_SYSTEM = 'system';
    ROLE_BOT = "bot";
    ROLE_USER = 'human';
    ROLE_ASSISTANT = 'assistant';

    prompt = {
        model: '',
        messages: []
    };

    constructor(modelName = "llama2") {
        this.prompt.model = modelName;
    }

    pushLine(role, content) {
        // contentを改行で分割してトリムした後、\\nで結合する.
        content = content.split("\n").map((line) => line.trim()).join("\\n");
        this.prompt.messages.push({ role: role, content: content });
    }

    setLines(lines) {
        this.prompt.messages = lines;
    }

    getLines() {
        let response = [...this.prompt.messages];
        return response;
    }

    async invoke(content) {
        this.pushLine('user', content);
        // messagesを結合する
        const response = await ollama.chat(this.prompt);
        return response.message;
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

        if (process.env.DEEP_RAG_MODE === 'true') {
            return this.invokeDeepRAG(arg);
        }

        // promptに事前情報を追加する。
        await this.pushPreModifcateInfo();

        // webの情報を取得する。
        let referencesInfo = "";
        if (process.env.USE_SEARCH_RESULT === 'true') {
            let externalInfo = await getExternalInfo(arg, process.env.SEARCH_DOC_LIMIT, 2048);
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

        console.log("回答を取得");
        let argModified = `${arg}\n${i18n.__("Answer in")}`;
        let replyMessage = (await this.invoke(argModified)).content;
        if (referencesInfo !== '') {
            replyMessage += `\n\n**${i18n.__("Reference:")}**\n${referencesInfo}`;
        }

        // replyMessageの先頭に YYYY-MM-DDを追加する。日付は0詰めする。
        let date = new Date();
        let dateString = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
        replyMessage = `<!-- ${dateString} -->\n${replyMessage}\n<!-- ${process.env.GEMINI_MODEL} - Gemini Pad -->`;
        return replyMessage;
    }

    async invokeDeepRAG(arg) {
        // promptに事前情報を追加する。
        this.pushPreModifcateInfo();

        // 命題の分割処理
        this.depth = 0;
        this.promptTemplate = fs.readFileSync(fileUtils.getAppDir() + '/splitPrompt.txt', 'utf8');

        this.promptStack = {};

        this.promptStack = await this.splitPrompt(arg);

        // deepMessagesを逆順にする。
        this.deepMessages = this.deepMessages.reverse();

        for(let message of this.deepMessages){
            this.pushLine(message.role, message.content);
        }

        this.pushLine(this.ROLE_ASSISTANT, `今日の日付は${new Date().toLocaleDateString()}です。`);

        let reply = (await this.invoke(arg)).content;

        let refs = "";

        /// deepReferencesの重複を削除する。
        let deefReferences = this.deepReferences.filter((x, i, self) => self.findIndex((t) => t.title === x.title) === i);
        this.deepReferences = deefReferences;

        // deefReferencesを追加する。
        for (let reference of this.deepReferences) {
            refs += `\n\n[${reference.title}](${reference.link}) `;
        }
        reply += `\n\n**${i18n.__("Reference:")}**\n${refs}`;

        console.log(reply);
        return reply;
    }

    deepReferences = [];
    deepMessages = [];
    depth = 0;
    depthlimit = 3;
    async splitPrompt(arg) {
        if(this.depth > this.depthlimit){
            return "";
        }
        let prompt = this.promptTemplate.replace(/{{arg}}/g, arg);
        console.log(this.depth);
        console.log(arg);
        console.log("命題を分割");
        let argModified = `${prompt}\n${i18n.__("Answer in")}`;
        let response = (await this.invoke(argModified)).content;
        // ```jsonを削除する。
        response = response.replace(/```json/g, '');
        // ```を削除する。
        response = response.replace(/```/g, '');
        try {
            if (response !== undefined && response !== '') {
                response = JSON.parse(response);
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
                let subqueryResponse = await this.splitPrompt(subqueryArg);
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
                                this.deepReferences.push(
                                    {
                                        "title": item.title,
                                        "link": item.link
                                    });
                            }
                        }
                    }
                    console.log("回答を取得");
                    console.log(this.depth);
                    console.log(subqueryArg);
                    let argModified = `${subqueryArg}\n${i18n.__("Answer in")}`;
                    let replyMessage = (await this.invoke(argModified)).content;
                    console.log(`reply: ${replyMessage}`);
                    // 改行で分割して、￥nで結合する。
                    this.deepMessages.push({role: "user", content: subqueryArg});
                    this.deepMessages.push({role: "assistant", content: replyMessage});
                    replyMessage = replyMessage.split("\n").map((line) => line.trim()).join("￥n");
                    //subquery.content=replyMessage;
                    //subquery.references=referencesInfo;
                    this.depth --;
                }
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

