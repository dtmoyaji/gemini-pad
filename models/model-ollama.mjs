import ollama from 'ollama';

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

    pushLine(role, content){
        this.prompt.messages.push({role: role, content: content});
    }

    setLines(lines){
        this.prompt.messages = lines;
    }

    getLines(){
        let response = [...this.prompt.messages];
        return response;
    }

    async invoke(content) {
        this.pushLine('user',content);
        // messagesを結合する
        const response = await ollama.chat(this.prompt);
        return response.message;
    }
}

