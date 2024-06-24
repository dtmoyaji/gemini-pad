import * as fileUtils from '../fileUtils.mjs';

export class ElasticDriver {

    constructor() {
        fileUtils.config();
        this.elasticConfig = {
            host: process.env.ELASTICSEARCH_HOST,
            port: process.env.ELASTICSEARCH_PORT,
            index: process.env.ELASTICSEARCH_INDEX,
            protocol: process.env.ELASTICSEARCH_PROTOCOL,
            url: ''
        };
        let url;
        if (this.elasticConfig.port !== '') {
            this.elasticConfig.url = `${this.elasticConfig.protocol}://${this.elasticConfig.host}:${this.elasticConfig.port}/${this.elasticConfig.index}/_search`;
        } else {
            this.elasticConfig.url = `${this.elasticConfig.protocol}://${this.elasticConfig.host}/${this.elasticConfig.index}/_search`;
        }
        console.log("Elasticsearch URL:", this.elasticConfig.url);
    }

    async searchDocument(prompt) {
        // 所有者に該当するドキュメントのみ検索する
        let ownerLimit = [{ "match_all": {} }];
        let owners = process.env.ELASTICSEARCH_OWNERS_LIMIT;
        if (owners !== '') {
            let ownerList = owners.split(',');
            let ownerQuery = [];
            for (let owner of ownerList) {
                ownerQuery.push({ "match": { "owner": owner.trim() } });
            }
            ownerLimit = ownerQuery;
        }
        let query = {
            "size": parseInt(process.env.ELASTICSEARCH_USE_DOCUMENT_LIMIT),
            "query": {
                "bool": {
                    "should": ownerLimit,
                    "minimum_should_match": 1,
                    "must": [
                        { "match": { "content": prompt } },
                        { "match": { "title": prompt } }
                    ],
                    "must_not": [{ "exists": { "field": "_score" } }]
                }
            }
        };
        try {
            let headers = {
                'Content-Type': 'application/json'
            };
            if (process.env.ELASTICSEARCH_APIKEY !== '') {
                headers['apikey'] = process.env.ELASTICSEARCH_APIKEY;
            }
            const response = await fetch(this.elasticConfig.url, {
                method: 'POST', // Elasticsearchの検索にはPOSTを使用
                headers: headers,
                body: JSON.stringify(query) // 検索クエリ
            });

            if (!response.ok) {
                console.log(JSON.stringify(query,null,2));
                throw new Error(`Elasticsearchからの応答がありません: ${response.statusText}`);
            }

            let responseJson = await response.json();
            let topScore = responseJson.hits.max_score;
            let lowend = process.env.ELASTICSEARCH_CUT_OFF_SCORE;
            let cutoff = 0.75 * topScore;
            let docList = [];
            let docs = responseJson.hits.hits;
            for (let doc of docs) {
                if (doc._score >= cutoff && doc._score >= lowend) {
                    let link = '';
                    if (process.env.ELASTICSEARCH_URL_PREFIX !== '') {
                        // doc._source.titleを最後に出現する/で分割する
                        let fileName = doc._source.title.split('/').pop();
                        let paerntDir = doc._source.title.substring(0, doc._source.title.lastIndexOf('/'));
                        link = `${process.env.ELASTICSEARCH_URL_PREFIX}?dir=/${paerntDir}/&scrollto=${fileName}`;
                    } else {
                        link = `${doc._source.owner}/${doc._source.title}`;
                    }
                    docList.push({
                        title: doc._source.title,
                        link: encodeURI(link),
                        content: doc._source.content,
                        score: doc._score
                    });
                }
            }

            return docList;
        } catch (error) {
            console.error("Elasticsearch search error:", error);
            throw error; // エラーを再スローするか、適切な値を返して処理を続行します
        }
    }

    async isActive() {
        try {
            // 末尾の/_searchをカットする
            let url = this.elasticConfig.url.replace(/\/_search$/, '');
            const response = await fetch(url, {
                method: 'GET', // Elasticsearchの検索にはPOSTを使用
                headers: {
                    'apikey': process.env.ELASTICSEARCH_APIKEY // APIキーをヘッダに含める
                }
            });
            // 応答があれば、URLはアクティブとみなす
            let result = response.ok;
            return result; // response.okは、ステータスコードが200-299の場合にtrueを返します
        } catch (error) {
            console.error("URL check error:", error);
            return false; // エラーが発生した場合は、URLがアクティブでないとみなす
        }
    }
}
