import fs from 'fs/promises'; // Use promise-based fs module
import fetch from 'node-fetch';

export class WordPressAPI {
    constructor(apiUrl, username, password) {
        // コンストラクタ: APIのURLと認証情報を初期化します。
        this.apiUrl = apiUrl;
        this.authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    }

    async fetchWithAuth(endpoint, options = {}) {
        // 認証付きでAPIリクエストを送信する汎用メソッド。
        const response = await fetch(`${this.apiUrl}${endpoint}`, {
            ...options,
            headers: {
                Authorization: this.authHeader,
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, details: ${response.message}`);
        }

        return response.json(); // レスポンスをJSON形式で返す。
    }

    async getCategoryIdByName(categoryName) {
        // カテゴリ名からカテゴリIDを取得します。
        try {
            const categories = await this.fetchWithAuth(`/categories?search=${encodeURIComponent(categoryName)}`);
            if (categories.length === 0) return null; // カテゴリが存在しない場合はnullを返す。
            return categories[0].id; // 最初のカテゴリIDを返す。
        } catch (error) {
            console.error('Error fetching category ID:', error.message);
            throw error;
        }
    }

    async createCategory(categoryName) {
        // 新しいカテゴリを作成します。
        try {
            const category = await this.fetchWithAuth('/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: categoryName }),
            });
            return category.id; // 作成したカテゴリのIDを返す。
        } catch (error) {
            console.error('Error creating category:', error.message);
            throw error;
        }
    }

    async getTagIdByName(tagName) {
        // タグ名からタグIDを取得します。
        try {
            const tags = await this.fetchWithAuth(`/tags?search=${encodeURIComponent(tagName)}`);
            return tags.length > 0 ? tags[0].id : null; // タグが存在しない場合はnullを返す。
        } catch (error) {
            console.error('Error fetching tag ID:', error.message);
            throw error;
        }
    }

    async createTag(tagName) {
        // 新しいタグを作成します。
        try {
            const tag = await this.fetchWithAuth('/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: tagName }),
            });
            return tag.id; // 作成したタグのIDを返す。
        } catch (error) {
            console.error('Error creating tag:', error.message);
            throw error;
        }
    }

    async uploadMedia(filePath, fileName) {
        // メディアファイルをアップロードします。
        try {
            const fileData = await fs.readFile(filePath); // ファイルを読み込む。
            const media = await this.fetchWithAuth('/media', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': `attachment; filename="${fileName}"`,
                },
                body: fileData,
            });
            return media.id; // アップロードしたメディアのIDを返す。
        } catch (error) {
            console.error(`Error uploading media (${filePath}):`, error.message);
            return null; // エラー時はnullを返す。
        }
    }

    async createPost(title, content, status = 'draft', categoryName = null, tagNames = [], featuredImagePath = null) {
        // 新しい投稿を作成します。
        if (!['draft', 'publish', 'private'].includes(status)) {
            throw new Error(`Invalid post status: ${status}. Allowed values are: 'draft', 'publish', 'private'.`);
        }

        try {
            // カテゴリIDを取得（指定されている場合）。
            let thisCategoryId = null;
            if (categoryName) {
                thisCategoryId = await this.getCategoryIdByName(categoryName);
                if (!thisCategoryId) {
                    thisCategoryId = await this.createCategory(categoryName);
                }
            }

            // タグIDを取得または作成。
            const tagIds = await Promise.all(
                tagNames.map(async (tagName) => {
                    const tagId = await this.getTagIdByName(tagName);
                    return tagId || (await this.createTag(tagName));
                })
            );

            // メディアをアップロード（指定されている場合）。
            const featuredMediaId = featuredImagePath
                ? await this.uploadMedia(featuredImagePath, 'featured-image.jpg')
                : null;

            title = `${title}`;
            // 投稿データを構築。
            const postData = {
                title,
                content,
                status,
                categories: thisCategoryId,
                tags: tagIds.filter(Boolean),
                featured_media: featuredMediaId || undefined,
            };

            // 投稿を作成。
            const post = await this.fetchWithAuth('/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
            });

            return post; // 作成した投稿を返す。
        } catch (error) {
            console.error('Error creating post:', error.message);
            throw error;
        }
    }
}

// Example usage
/*
(async () => {
    const wpApi = new WordPressAPI(WP_API_URL, WP_USERNAME, WP_PASSWORD);

    try {
        // 投稿を作成する例。
        const post = await wpApi.createPost(
            'Sample Post Title',
            'This is the first line.<br>This is the second line.<br>This is the third line.',
            'private',
            'New Category',
            ['Tag1', 'Tag2'],
            'newダテカード.jpg'
        );
        console.log('Post created:', post);
    } catch (error) {
        console.error('Failed to create post:', error.message);
    }
})();
*/