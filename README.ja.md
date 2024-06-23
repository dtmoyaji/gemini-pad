# Gemini Pad

このアプリケーションは、Google から提供されている AI モデルを API で利用しています。
また、ローカルのLLMの運用を考慮してOllamaにも対応しております。

規定値では対話モデルは2024年6月現在、無料で利用可能な gemini-1.5-flash が設定されています(変更可能)。

設定画面よりGEMINI_API_KEYの項目に記載のモデルを書き換えることで、geminiおよびOllamaの各モデルを切り替えることが可能です。
<!-- タイトルとキーワードの生成モデルには、gemini-1.0-proが設定されています(固定)。 -->

## セットアップ

1. Gemini API キーを取得します。
   Gemini API キーは [ここ](https://aistudio.google.com/app/prompts/new_freeform) から入手します。
   Google のアカウントが必要なので、所持していない場合は事前に作成してください。

2. アプリを起動します。Gemini API キーがアプリに登録されていない場合は、設定画面が開きますので、取得したキーを登録します。
   登録ができたら、メニューのファイルから再起動を選んで、アプリを再起動します。

3. ユーザー所属とユーザー名の登録は必須ではありませんが、メールの文面などを作らせるときに登録しておくと便利です。

4. 表示言語を指定すると、インターフェイスの表示言語が変更されます。現在、英語、日本語、フランス語、ドイツ語、スペイン語に対応しています。

## 使い方

画面の下部のテキスト枠に質問を記入すると、上部に回答が表示されます。

画面右の通信履歴には、過去の会話のタイトルが表示されます。タイトルをクリックすると、質問と回答が画面に表示されます。

上のテキストを利用するにチェックをつけると、Geminiの回答を質問に含めることができます。

クリップボードアイコンをクリックすると、クリップボードにHTMLの内容をコピーします。

ウェブアイコンをクリックすると、ウェブ検索する/しないを切り替えることができます。

### ウェブ検索について

初期状態では、ウェブ検索にDackDackGoを用いるようにしています。

Googleより Google API Key と Google CSE ID を入手し、設定登録すると、Google検索を使用するようになります。ただし、Googleの定める費用を支払う必要があります。

### 内部資料検索について

Elasticsearch を使用した全文検索に対応しています。
また、ファイルサーバとして Nextcloud を使用することを想定しておりますので、Nextcloud の fulltextsearch プラグインを使い、Nextcloud と Elasticsarchと連携させると、非常に使い心地が良くなります。

内部資料のリンク表示はNextcloude上の該当ページを開きますので、ちょうどよいページを開かせるために、URLのプレフィックスの値を調整して使用してください。

Elasticsearch連携の設定例は [こちら](https://github.com/dtmoyaji/gemini-pad/wiki/Setting-for-Nextcloud---Elasticsearch-(gemini%E2%80%90pad%E2%80%90filesrv)) を参照してください。

#### gemini-pad-filesrv について

ローカル検索用のドキュメントサーバを簡単に用意できるようにするため、gemini-pad-filesrvという仕組みを [ここ](https://github.com/dtmoyaji/gemini-pad-filesrv) に用意しました。
nextcloud + fulltextsearch Plugin + elasticsearch のコンテナビルドシーケンスです。
併せてご利用ください。

### キー操作

テキスト入力時に、Shift + Enter で改行、Enter で質問の送信、Shift + Delete で質問内容の消去を行います。
Alt で前回の回答の再利用を on/off します。

## 回答形式について

Gemini からの回答は、特に指定をしない場合 Markdown 形式で行われます。

## モデルパラメータについて

Gemini のモデルパラメータの詳細については、Google AI for Developers の [生成モデルについて](https://ai.google.dev/gemini-api/docs/models/generative-models?hl=ja&_gl=1*1fu959e*_up*MQ..*_ga*MTgyNTQxNDY0NC4xNzE0MDIxNDY3*_ga_P1DBVKWT6V*MTcxNDAyMTQ2Ny4xLjAuMTcxNDAyMTg1NC4wLjAuMA..) を参照してください。

## パーソナリティについて

設定画面の **パーソナリティ** の項目で以下の3つのパーソナリティを選ぶことができます。設定を変更すると、回答の傾向や会話の口調が変化します。

* **default:** 既定のチャットボットパーソナリティ。
* **kansai:** 関西の男性のパーソナリティ。
* **rin:** お嬢様のパーソナリティ。

