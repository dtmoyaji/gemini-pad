<!-- 2024-06-13 -->
# Gemini Pad

This application uses AI models provided by Google via APIs.
It also supports Ollama, considering the operation of local LLMs.

The default dialog model is gemini-1.5-flash, which is available for free as of June 2024 (subject to change).

You can switch between gemini and Ollama models by overwriting the model specified in the GEMINI_API_KEY field on the settings screen.

## Setup

1. Obtain a Gemini API key.
   You can get a Gemini API key from [here](https://aistudio.google.com/app/prompts/new_freeform).
   You will need a Google account, so please create one if you do not have one.

2. Launch the app. If the Gemini API key is not registered in the app, the settings screen will open, so register the key you obtained.
   Once registered, select Restart from the File menu and restart the app.

3. Registering your affiliation and user name is not mandatory, but it is convenient when creating emails, etc.

4. If you specify the display language, the display language of the interface will change. Currently, English, Japanese, French, German, and Spanish are supported.

## Usage

Enter your question in the text box at the bottom of the screen, and the answer will be displayed at the top.

The communication history on the right side of the screen displays the titles of past conversations. Click on a title to display the question and answer on the screen.

If you check Use above text, you can include Gemini's answer in your question.

Click the clipboard icon to copy the HTML content to the clipboard.

Click the web icon to toggle web search on/off.

### About web search

Initially, DackDackGo is used for web search.

If you obtain a Google API Key and Google CSE ID from Google and register them in the settings, Google search will be used. However, you will need to pay the fees set by Google.

### About Internal Data Search

We support full-text search using Elasticsearch.
In addition, we assume the use of Nextcloud as a file server, so it would be very convenient to integrate Nextcloud with Elasticsearch using the fulltextsearch plugin.

The link display for internal documents opens the corresponding page on Nextcloud, so please adjust the value of the URL prefix to open the desired page.

### Key operation

When entering text, press Shift + Enter to create a new line, Enter to send a question, and Shift + Delete to delete the question content.
Press Alt to toggle reuse of the previous answer on/off.

## About the answer format

Answers from Gemini are in Markdown format unless otherwise specified.

## About model parameters

For details on Gemini's model parameters, see Google AI for Developers' [Generative Models](https://ai.google.dev/gemini-api/docs/models/generative-models?hl=ja&_gl=1*1fu959e*_up*MQ..*_ga*MTgyNTQxNDY0NC4xNzE0MDIxNDY3*_ga_P1DBVKWT6V*MTcxNDAyMTQ2Ny4xLjAuMTcxNDAyMTg1NC4wLjAuMA..) .

## About personality

You can choose from the following three personalities in the **Personality** field on the settings screen. Changing the setting will change the tendency of the answer and the tone of the conversation.

* **default:** Default chatbot personality.
* **kansai:** Personality of a male from Kansai.
* **rin:** Personality of a young lady.
<!-- gemini-1.0-pro -->