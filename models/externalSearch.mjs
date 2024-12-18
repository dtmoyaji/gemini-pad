import axios from 'axios';
import * as cheerio from 'cheerio';
import { BrowserWindow } from 'electron';
import * as fileUtils from '../fileUtils.mjs';

fileUtils.config();

let previousSearchTime = 0;
let searchDelay = 5000;

let subwindow = undefined;

async function searchDuckDuckGo(query, maxResults = 3, maxContentLength = 2048) {

    // queryが200文字以上の場合、検索しない。
    if (query.length > 200) {
        return [];
    }

    if(subwindow===undefined){
        subwindow = await new BrowserWindow({ show: false });
    }
    //else{
    //    subwindow.show();
    //}
    const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    await subwindow.loadURL(url);
    console.log(url);
    try {
        //let delayTime = searchDelay - (Date.now() - previousSearchTime);
        //if (delayTime > 0) {
        //    console.log(`waiting ${delayTime}ms`);
        //    await delay(delayTime);
        //}

        //let response = await axios.get(url);
        let response = await subwindow.webContents.executeJavaScript('document.documentElement.outerHTML');
        console.log(`response result: ${response.status}`);
        let retry = 0;
        previousSearchTime = Date.now();
        //const $ = cheerio.load(response.data);
        const $ = cheerio.load(response);
        const results = [];
        const promises = [];
        $('.result__title').each((index, element) => {
            let count = 0;
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
                    count++;
                    console.log(count);
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
        subwindow.hide();
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
    let itemData = '';
    try {
        let itemResponse = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        itemData = itemResponse.data;
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
    } catch (error) {
        console.error(`GetPageContent Error: ${url}\n${error.message}`);
    }
    return itemData;
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

