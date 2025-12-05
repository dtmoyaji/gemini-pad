# Gemini Pad

## Version
1.2.3

This application utilizes AI models provided by Google via an API.  
It also supports Ollama for operating local LLMs.

By default, the dialogue model is set to "gemini-2.0-flash," which is available for free as of June 2024 (modifiable).

In the settings screen, you can change the model specified in the GEMINI_API_KEY field to switch between various models of Gemini and Ollama.

## Setup

1. Obtain a Gemini API key.  
   You can get the Gemini API key [here](https://aistudio.google.com/app/prompts/new_freeform).  
   A Google account is required. If you don't have one, please create one in advance.
2. Launch the application. If the Gemini API key is not registered in the application, the settings screen will open. Register the obtained key there.  
   Once registered, select "Restart" from the "File" menu to restart the application.
3. Registering user affiliation and username is not mandatory, but it can be useful, for example, when generating email content.
4. By specifying the display language, the interface language will change. Currently, English, Japanese, French, German, and Spanish are supported.

When the application is launched for the first time after installation, the settings screen will automatically be displayed.  
If you want to change the settings again, select "Settings" from the "Edit" menu to open the settings screen.

## How to Use

Enter a question in the text box at the bottom of the screen, and the answer will be displayed at the top.

In the communication history on the right side of the screen, the titles of past conversations are displayed. Clicking on a title will display the question and answer on the screen.

If you check the "Use the above text" box, Gemini's response will be included in the question.

Clicking the clipboard icon will copy the HTML content to the clipboard.

Clicking the web icon toggles web search on or off.

### About Web Search

By default, DuckDuckGo is used for web searches.

If you obtain a Google API Key and Google CSE ID and register them in the settings, Google Search will be used. However, please note that this may incur costs as per Google's policies.

### About Internal Document Search

The application supports full-text search using Elasticsearch.  
It is also designed to use Nextcloud as a file server. By using the Nextcloud "fulltextsearch" plugin and connecting it with Elasticsearch, the user experience will be significantly improved.

Links to internal documents open the corresponding page in Nextcloud. To open the correct page, adjust the value of the URL prefix as needed.

You can find an example configuration for Elasticsearch integration [here](https://github.com/dtmoyaji/gemini-pad/wiki/Setting-for-Nextcloud---Elasticsearch-\(gemini%E2%80%90pad%E2%80%90filesrv\)).

#### About gemini-pad-filesrv

To easily provide a local document server for search, the "gemini-pad-filesrv" system has been prepared [here](https://github.com/dtmoyaji/gemini-pad-filesrv).  
It is a container build sequence for Nextcloud + fulltextsearch plugin + Elasticsearch.  
Please use it together with this application.

### Keyboard Operations

When entering text, use Shift + Enter to insert a line break, Enter to send the question, and Shift + Delete to clear the question content.  
Use Alt to toggle the reuse of the previous response on or off.

## About Response Format

Responses from Gemini are provided in Markdown format by default unless otherwise specified.

## About Model Parameters

For details on Gemini's model parameters, refer to the [Generative Models Documentation](https://ai.google.dev/gemini-api/docs/models/generative-models?hl=en&_gl=1*1fu959e*_up*MQ..*_ga*MTgyNTQxNDY0NC4xNzE0MDIxNDY3*_ga_P1DBVKWT6V*MTcxNDAyMTQ2Ny4xLjAuMTcxNDAyMTg1NC4wLjAuMA..) on Google AI for Developers.

## About Personalities

In the **Personality** section of the settings screen, you can choose from the following three personalities. Changing this setting will affect the tone and tendencies of the responses.

* **default:** Default chatbot personality.
* **kansai:** Personality of a man from the Kansai region.
* **rin:** Personality of a young lady.