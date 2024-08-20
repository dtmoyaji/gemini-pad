import fs from 'fs';
import fetch from 'node-fetch';
import crypto from 'node:crypto';
import path from 'path';
import SolrNode from 'solr-node';
import * as fileUtils from '../fileUtils.mjs';

export class SolrDriver {
    constructor() {
        fileUtils.config();
        this.solrConfig = {
            host: process.env.SOLR_HOST,
            port: process.env.SOLR_PORT,
            core: process.env.SOLR_CORE,
            protocol: process.env.SOLR_PROTOCOL
        };
        this.client = new SolrNode(this.solrConfig);
    }

    async isActive() {
        let url = `${this.solrConfig.protocol}://${this.solrConfig.host}:${this.solrConfig.port}/solr/${this.solrConfig.core}/admin/ping`;
        try {
            let response = await fetch(url);
            let json = await response.json();
            return json.status === 'OK';
        } catch (error) {
            console.log('error: solr is not active. skip getting solr data.');
            return false;
        }
    }

    async syncDocuments(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(async (file) => {
            const filePath = path.join(dir, file);
            await this.updateDocument(filePath);
        });
    }

    async updateDocument(filePath) {
        const uuid = crypto.createHash('sha256').update(filePath).digest('hex');
        let documentData = fs.readFileSync(filePath, 'utf-8');

        const data = {
            id: uuid,
            file_path: filePath,
            content: documentData,
            exists: true
        };

        await this.client.update(data, async function (err, result) {
            if (err) {
                console.log(err);
            }
        });
    }

    async searchDocument(prompt) {
        let docList = [];
        const strQuery = this.client.query().q(`exists:true AND content:${prompt} AND file_path:${prompt}`).fl('*,score').rows(2);
        let queryResult = await new Promise((resolve, reject) => {
            this.client.search(strQuery, function (err, result) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
        let docsCount = queryResult.response.docs.length;
        // document filtering cut off down below from half of score amounts.
        // docs.scrore から平均値を計算する。
        let sum = 0;
        queryResult.response.docs.forEach(doc => {
            sum += doc.score;
        });
        let average = sum / docsCount;
        queryResult.response.docs.forEach(doc => {
            if (
                (average >= 5.0 && doc.score >= average)
            ) {
                let filePath = Array.isArray(doc.filePath) ? doc[0].file_path : doc.file_path;
                let title = path.basename(filePath[0]);
                title = title.replace(/\.[^/.]+$/, "");
                let document = fs.readFileSync(filePath[0], 'utf-8');
                docList.push({
                    title: title,
                    link: encodeURI(doc.file_path[0]),
                    content: document,
                    score: doc.score
                });
            }
        });
        return docList;
    }
}
