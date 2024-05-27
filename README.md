# Gemini Pad

このアプリケーションは、Google から提供されている AI モデルを API で利用しています。

規定値ではモデルは2024年4月現在、無料で利用可能な gemini-1.0-pro が設定されています。

## セットアップ
1. Gemini API キーを取得します。
   Gemini API キーは [ここ](https://aistudio.google.com/app/prompts/new_freeform) から入手します。
   Google のアカウントが必要なので、所持していない場合は事前に作成してください。

2. アプリを起動します。Gemini API キーがアプリに登録されていない場合は、設定画面が開きますので、GEMINI_API_KEY の項目に登録します。
   登録ができたら、メニューのファイルから再起動を選んで、アプリを再起動します。

3. ユーザー所属とユーザー名の登録は必須ではありませんが、メールの文面などを作らせるときに登録しておくと便利です。

## 使い方

画面の下部のテキスト枠に質問を記入すると、上部に回答が表示されます。

画面右の通信履歴には、過去の会話のタイトルが表示されます。タイトルをクリックすると、質問と回答が画面に表示されます。

上のテキストを利用するにチェックをつけると、Geminiの回答を質問に含めることができます。

### キー操作

テキスト入力時に、Shift + Enter で改行、Enter で質問の送信、Shift + Delete で質問内容の消去を行います。
Alt で前回の回答の再利用を on/off します。

## 回答形式について

Gemini からの回答は、特に指定をしない場合 Markdown 形式で行われます。

## モデルパラメータについて

Gemini のモデルパラメータの詳細については、Google AI for Developers の [生成モデルについて](https://ai.google.dev/gemini-api/docs/models/generative-models?hl=ja&_gl=1*1fu959e*_up*MQ..*_ga*MTgyNTQxNDY0NC4xNzE0MDIxNDY3*_ga_P1DBVKWT6V*MTcxNDAyMTQ2Ny4xLjAuMTcxNDAyMTg1NC4wLjAuMA..) を参照してください。

## パーソナリティについて

設定画面のPERSONALITYの項目で以下の3つのパーソナリティを選ぶことができます。設定を変更すると、回答の傾向や会話の口調が変化します。

* **default:** 既定のチャットボットパーソナリティ。
* **kansai:** 関西の男性のパーソナリティ。
* **rin:** お嬢様のパーソナリティ。

変更した後に再起動が必要です。
