import * as fileUtils from '../fileUtils.mjs';
import { ElasticDriver } from './elasticDriver.mjs';
import * as ModelController from './modelController.mjs';
import { SolrDriver } from './solrDriver.mjs';

export async function search(query) {
    let referencesInfo = '';
    let references = [];
    if (query.length > 280) {
        query = await getDigestedDocument(query);
    }
    // Solr/elasticSearchの情報を取得する。
    if (process.env.USE_SOLR === 'true' || process.env.USE_ELASTICSEARCH === 'true') {
        let documentFinder = getSearchDriver();
        if (await documentFinder.isActive()) {
            let searchResult = await documentFinder.searchDocument(query);
            if (searchResult !== undefined && searchResult.length > 0) {
                for (let item of searchResult) {
                    references.push([`${item.title}:\n${item.content}\n`]);
                    referencesInfo += `\n\n(内部資料) [${item.title}](${item.link}) - ${item.score} `; 
                }
            }
        }
    }
    return {
        referencesInfo: referencesInfo,
        references: references
    };
}

export function getSearchDriver(){
    let driver;
    if(process.env.USE_ELASTICSEARCH === 'true'){
        driver = new ElasticDriver();
    }else if(process.env.USE_SOLR === 'true'){
        driver = new SolrDriver();
    }
    return driver;
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