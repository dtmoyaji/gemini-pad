import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fileUtils from '../fileUtils.mjs';

fileUtils.config();

// Brave Search 用の検索モジュール
// 環境変数: BRAVE_SEARCH_API_KEY

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
        itemData = itemData.split('\n').map((line) => line.trim()).join('\n');
        itemData = itemData.replace(/\s+/g, ' ');
        itemData = itemData.substring(0, textLimit);
    } catch (error) {
        console.error(`GetPageContent Error: ${url}\n${error.message}`);
    }
    return itemData;
}

// Brave Search API へ問い合わせる
// 注: BRAVE_SEARCH_API_KEY は必須
async function searchBrave(query, maxResults = 3, maxContentLength = 2048) {
    if (!process.env.BRAVE_SEARCH_API_KEY) {
        console.error('BRAVE_SEARCH_API_KEY is not set');
        return [];
    }

    // 簡単な入力保護
    if (query.length > 400) {
        query = query.substring(0, 400);
    }

    try {
        const endpoint = 'https://api.search.brave.com/res/v1/web/search';
        const headers = {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip',
            // Brave requires X-Subscription-Token header with the API key
            'X-Subscription-Token': process.env.BRAVE_SEARCH_API_KEY
        };

        const params = {
            q: query,
            count: maxResults
        };

        const response = await axios.get(endpoint, { params, headers });

        if (!response.data) {
            return [];
        }

        // Brave API returns results under different keys depending on plan:
        // - web.results: array of web result objects (title, url, description)
        // - results: some endpoints may return a flat results array
        const data = response.data;
        let rawResults = [];
        if (data.web && Array.isArray(data.web.results) && data.web.results.length > 0) {
            rawResults = data.web.results;
        } else if (Array.isArray(data.results) && data.results.length > 0) {
            rawResults = data.results;
        } else if (data.mixed && data.web && Array.isArray(data.web.results) && data.web.results.length > 0) {
            rawResults = data.web.results;
        }

        const results = [];
        for (let item of rawResults.slice(0, maxResults)) {
            try {
                // Normalize fields across possible result formats
                const title = (item.title || item.name || item.snippet || item.description || '').toString().trim();
                let link = item.url || item.link || (item.meta_url && item.meta_url.scheme && item.meta_url.netloc ? `${item.meta_url.scheme}://${item.meta_url.netloc}${item.meta_url.path || ''}` : '');
                const contentSnippet = (item.description || item.snippet || item.summary || '').toString();

                const content = (contentSnippet.length > 0) ? contentSnippet : await getPageContent(link, maxContentLength);

                results.push({
                    role: 'note',
                    title: title,
                    link: link,
                    content: content
                });
            } catch (err) {
                console.error('Error processing Brave item', err && err.message ? err.message : err);
            }
        }

        // ブラウザ検索モジュールと同様に逆順で返す
        results.reverse();
        return results;
    } catch (error) {
        if (error.response) {
            console.error('Brave API error:', error.response.status, error.response.data);
        } else {
            console.error('Brave API request failed:', error.message);
        }
        return [];
    }
}

// 互換性のためのエントリポイント
async function getBraveSearchInfo(query, maxResults = 3, maxContentLength = 2048) {
    return await searchBrave(query, maxResults, maxContentLength);
}

export { getBraveSearchInfo, searchBrave };
