//chat.ts
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";

// 環境変数設定
dotenv.config();

export default class ModelGemini {

    ROLE_USER = "human";
    ROLE_BOT = "bot";
    ROLE_ASSISTANT = "assistant";
    ROLE_SYSTEM = "system";

    lines = [];

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

    pushLine(role, text){
        this.lines.push([role, text]);
    }

    setLines(lines){
        this.lines = lines;
    }

    getLines(){
        let response = [...this.lines];
        return response;
    }

    async invoke(text) {
        this.pushLine("human", text);
        return await this.model.invoke(this.lines);
    }
}

