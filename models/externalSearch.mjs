import axios from 'axios';
import cheerio from 'cheerio';
import * as fileUtils from '../fileUtils.mjs';

fileUtils.config();

async function searchDuckDuckGo(query, maxResults = 3, maxContentLength = 2048) {
    const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    console.log(url);
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const results = [];
        const promises = [];
        $('.result__title').each((index, element) => {
            if (index < maxResults) {
                promises.push((async () => {
                    let pageTitle = $(element).text();
                    // 改行で分割して再結合する。
                    pageTitle = pageTitle.split('\n').join('');
                    // トリムする。
                    pageTitle = pageTitle.trim();

                    let url = $(element).find('a').attr('href');
                    url = decodeURIComponent(url.replace('//duckduckgo.com/l/?uddg=', ''));
                    url = url.split('&rut=')[0];
                    results.push({
                        "role": "note",
                        "title": pageTitle,
                        "link": url,
                        "content": await getPageContent(url, maxContentLength)
                    });
                })());
            }
        });
        await Promise.all(promises);
        // resultを逆順にする。
        results.reverse();
        delay(3000);
        return results;
    } catch (error) {
        console.error(error);
    }
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Google CSE を使って、外部情報を取得する。検索結果のURLから情報を取得し、JSON形式で返す。
async function searchGoogleCSE(query, maxResults = 3, maxContentLength = 2048) {
    // 改行でsplitして、trimして再結合する。
    query = query.split('\n').map((line) => line.trim()).join(' ');
    // \\nをスペースに置換する。
    query = query.replace(/\\n/g, ' ');
    // 連続する空白を削除する。
    query = query.replace(/\s+/g, ' ');

    try {
        let keyworkds = query;
        let returnData = [];
        const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                key: process.env.GOOGLE_API_KEY,
                cx: process.env.GOOGLE_CSE_ID,
                q: keyworkds,
                num: maxResults,
            }
        });

        if (response.data.searchInformation.totalResults !== '0') {
            for (let item of response.data.items) {
                if (item.mime === undefined || item.mime !== 'application/pdf') {
                    let itemLink = item.link;
                    console.log(`get ${itemLink}`);
                    // itemLinkから情報を取得する。
                    try {
                        returnData.push({
                            "role": "note",
                            "title": item.title,
                            "link": itemLink,
                            "content": await getPageContent(itemLink, maxContentLengthF)
                        });
                    } catch (error) {
                        console.error(error); // エラーメッセージをログに出力
                    }
                }
            }
        }
        // returnDataを逆順にする。
        returnData.reverse();
        return returnData;
    } catch (error) {
        console.error(error.response.data); // エラーメッセージをログに出力
    }
}

async function getPageContent(url, textLimit = 1536) {
    try {
        let itemResponse = await axios.get(url);
        let itemData = itemResponse.data;
        const $ = cheerio.load(itemData);
        $('head').remove();
        $('script').remove();
        $('style').remove();
        $('noscript').remove();
        $('aside').remove();
        $('footer').remove();
        itemData = $('body').text();
        // 改行でsplitして、trimして再結合する。
        itemData = itemData.split('\n').map((line) => line.trim()).join('\n');
        // 連続する空白を削除する。
        itemData = itemData.replace(/\s+/g, ' ');
        // 先頭から2k文字までで切り取る。
        itemData = itemData.substring(0, textLimit);
        return itemData;
    } catch (error) {
        console.error(error); // エラーメッセージをログに出力
    }
}

// 外部検索を設定を元に判別し実行する。
async function getExternalInfo(query, maxResults = 3, maxContentLength = 2048) {
    // 環境変数が設定されていない場合、DuckDuckGoを使用する。
    if (process.env.GOOGLE_API_KEY === '' || process.env.GOOGLE_CSE_ID === '') {
        return await searchDuckDuckGo(query, maxResults, maxContentLength);
    } else {
        return await searchGoogleCSE(query, maxResults, maxContentLength);
    }
}

export {
    getExternalInfo,
    searchDuckDuckGo,
    searchGoogleCSE
};
