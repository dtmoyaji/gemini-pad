import i18n from 'i18n';
import ollama from 'ollama';
import * as fileUtils from "../fileUtils.mjs";
import { getExternalInfo } from "./externalSearch.mjs";

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
        // promptに事前情報を追加する。
        await this.pushPreModifcateInfo();

        // webの情報を取得する。
        let referencesInfo = "";
        if (process.env.USE_SEARCH_RESULT === 'true') {
            let externalInfo = await getExternalInfo(arg, 4, 2048);
            if (externalInfo !== undefined && externalInfo.length > 0) {
                for (let item of externalInfo) {
                    this.pushLine(this.ROLE_ASSISTANT, `${item.title}:\n${item.content}\n`);
                    referencesInfo += `\n\n[${item.title}](${item.link}) `;
                }
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
        replyMessage = `<!-- ${dateString} -->\n${replyMessage}\n<!-- ${process.env.GEMINI_MODEL} -->`;
        return replyMessage;
    }

}

