# Gemini Pad

This application utilizes AI models provided by Google via API.

By default, the dialogue model is set to gemini-1.5-pro, which is currently available for free as of June 2024 (subject to change). The title and keyword generation model is set to gemini-1.0-pro (fixed).

## Setup

1. Obtain a Gemini API key.
You can obtain a Gemini API key from [here](https://aistudio.google.com/app/prompts/new_freeform).
You will need a Google account, so please create one if you do not have one.

2. Launch the application. If a Gemini API key is not registered in the application, the settings screen will open, so please register the obtained key.
Once registered, select Restart from the File menu and restart the application.

3. User affiliation and user name registration are not required, but it is convenient to register when creating email text, etc.

4. If you specify the display language, the display language of the interface will change. Currently, Japanese, English, French, and German are supported.

## Usage

If you enter a question in the text box at the bottom of the screen, the answer will be displayed at the top.

The communication history on the right side of the screen displays the titles of past conversations. Clicking on a title will display the question and answer on the screen.

If you check Use above text, you can include Gemini's answer in your question.

Clicking the clipboard icon will copy the HTML content to the clipboard.

Clicking the web icon will toggle web search on/off.

### About web search

Initially, DackDackGo is used for web search.

If you obtain a Google API Key and Google CSE ID from Google and register them in the settings, Google search will be used. However, you will need to pay the fees set by Google.

### Key operation

When entering text, press Shift + Enter to create a new line, Enter to send a question, and Shift + Delete to delete the question content.
Press Alt to toggle reuse of the previous answer on/off.

## About the answer format

Answers from Gemini are in Markdown format unless otherwise specified.

## About model parameters

For details on Gemini's model parameters, please refer to Google AI for Developers' [About Generative Models](https://ai.google.dev/gemini-api/docs/models/generative-models?hl=ja&_gl=1*1fu959e*_up*MQ..*_ga*MTgyNTQxNDY0NC4xNzE0MDIxNDY3*_ga_P1DBVKWT6V*MTcxNDAyMTQ2Ny4xLjAuMTcxNDAyMTg1NC4wLjAuMA..).

## About personality

You can choose from the following three personalities in the **Personality** item in the settings screen. Changing the setting will change the tendency of the answer and the tone of the conversation.

* **default:** Default chatbot personality.
* **kansai:** Personality of a male from Kansai.
* **rin:** Personality of a young lady.
