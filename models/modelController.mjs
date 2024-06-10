import fs from 'fs';
import path from 'path';
import * as fileUtils from '../fileUtils.mjs';
import ModelGemini from './model-gemini.mjs';
import ModelOllama from './model-ollama.mjs';

export async function createAiModel(modelName) {
    let AIModel;
    if (modelName.startsWith('gemini')) {
        AIModel = new ModelGemini(modelName);
    } else {
        AIModel = new ModelOllama(modelName);
    }
    return AIModel;
}

export async function injectPersonality(personalityName, AIModel) {
    const personalityDir = path.join(fileUtils.getAppDir(), 'personality');
    const filePath = path.join(personalityDir, `${personalityName}.json`);
    if (!fs.existsSync(filePath)) {
        throw new Error(`Personality file not found: ${filePath}`);
    } else {
        let personality = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        // personaility.contentを結合する
        let content = personality.content.join("\\n");
        AIModel.pushLine(AIModel.ROLE_SYSTEM, content);
    }
    return AIModel;
}