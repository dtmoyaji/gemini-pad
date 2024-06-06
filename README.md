# Gemini Pad

This application uses AI models provided by Google through APIs.

By default, the dialog model is set to gemini-1.5-pro, which is available for free as of June 2024 (changeable).
The title and keyword generation model is set to gemini-1.0-pro (fixed).

## Setup

1. Get a Gemini API key.
   You can get a Gemini API key from [here](https://aistudio.google.com/app/prompts/new_freeform).
   You will need a Google account, so please create one in advance if you do not have one.

2. Launch the app. If the Gemini API key is not registered in the app, the settings screen will open, so register it in the GEMINI_API_KEY field.
   Once registered, select Restart from the File menu and restart the app.

3. Registering your user affiliation and user name is not required, but it is convenient when creating emails, etc.

4. If you specify a language in LANG, the display language of the interface will change. Currently, Japanese and English are supported.

## How to use

If you enter a question in the text box at the bottom of the screen, the answer will be displayed at the top.

The communication history on the right side of the screen displays the titles of past conversations. Clicking on a title will display the question and answer on the screen.

If you check Use above text, you can include Gemini's answer in your question.

Clicking the clipboard icon will copy the HTML content to the clipboard.

Clicking the web icon will toggle web search on/off.

### About web search

Initially, DackDackGo is used for web search.

If you obtain GOOGLE_API_KEY and GOOGLE_CSE_ID from Google and register them in the settings, Google search will be used. However, you will need to pay the fees set by Google.

### Key operation

When entering text, press Shift + Enter to create a new line, Enter to send a question, and Shift + Delete to delete the question content.
Press Alt to turn on/off the reuse of the previous answer.

## About the answer format

Answers from Gemini are in Markdown format unless otherwise specified.

## About model parameters

For details on Gemini's model parameters, please refer to Google AI for Developers' [About Generative Models](https://ai.google.dev/gemini-api/docs/models/generative-models?hl=ja&_gl=1*1fu959e*_up*MQ..*_ga*MTgyNTQxNDY0NC4xNzE0MDIxNDY3*_ga_P1DBVKWT6V*MTcxNDAyMTQ2Ny4xLjAuMTcxNDAyMTg1NC4wLjAuMA..) .

## About personality

You can choose from the following three personalities in the PERSONALITY field of the settings screen. Changing the setting will change the tendency of the answer and the tone of the conversation.

* **default:** Default chatbot personality.
* **kansai:** Personality of a male from Kansai.
* **rin:** Personality of a young lady.
