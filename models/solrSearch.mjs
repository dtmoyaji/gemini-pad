import * as fileUtils from '../fileUtils.mjs';
import * as ModelController from './modelController.mjs';
import { SolrDriver } from './solrDriver.mjs';

export async function searchSolr(query) {
    let referencesInfo = '';
    let references = [];
    if (query.length > 280) {
        query = await getDigestedDocument(query);
    }
    // Solrの情報を取得する。
    if (process.env.USE_SOLR === 'true') {
        let solrDriver = new SolrDriver();
        if (await solrDriver.isSolrActive()) {
            let searchResult = await solrDriver.searchDocument(query);
            if (searchResult !== undefined && searchResult.length > 0) {
                for (let item of searchResult) {
                    references.push([`${item.title}:\n${item.content}\n`]);
                    referencesInfo += `\n\n[${item.title}](file://${item.link}) - ${item.score} `;
                }
            }
        }
    }
    return {
        referencesInfo: referencesInfo,
        references: references
    };
}

export async function getDigestedDocument(query) {
    console.log('getDigestedDocument');
    fileUtils.config();
    let digester = await ModelController.createAiModel(process.env.GEMINI_MODEL);
    ModelController.injectPersonality('solrDigester', digester);
    digester.pushLine(digester.ROLE_ASSISTANT, query);
    const retsult = await digester.invoke(
        `この文を要約してください。`
    );
    console.log(retsult.content);
    return retsult.content;
}