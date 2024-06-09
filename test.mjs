import dotenv from 'dotenv';
import { createAiModel, injectPersonality } from './models/modelController.mjs';

dotenv.config();

async function test(modelName = 'gemini-1.5-flash') {
    let AIModel = await createAiModel(modelName);
    await injectPersonality('default', AIModel);
    AIModel.pushLine(AIModel.ROLE_ASSISTANT, "日本語で会話してください。");
    let initLines = AIModel.getLines();
    const res = await AIModel.invoke("あなたの名前は何ですか？");
    let content = res.content;
    console.log(content);

    console.log('initLines:', initLines);
}

test('llama3');
