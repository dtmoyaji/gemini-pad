# Gemini Pad

 Diese Anwendung verwendet ein KI-Modell von Google über eine API.
Darüber hinaus wird Ollama unter Berücksichtigung des lokalen Betriebs von LLM unterstützt.
Als Standard ist das Dialogmodell auf gemini-1.5-flash eingestellt, das ab Juni 2024 kostenlos verfügbar ist (kann geändert werden).
Durch Überschreiben des im Feld GEMINI_API_KEY auf dem Einstellungsbildschirm angegebenen Modells können Sie zwischen den einzelnen Modellen von Gemini und Ollama wechseln.

## Einrichtung

1. Rufen Sie den Gemini-API-Schlüssel ab.
Sie erhalten den Gemini-API-Schlüssel von [hier](https://aistudio.google.com/app/prompts/new_freeform).
Da Sie ein Google-Konto benötigen, erstellen Sie es bitte im Voraus, falls Sie noch keines besitzen.

2. Starten Sie die Anwendung. Wenn der Gemini-API-Schlüssel nicht in der Anwendung registriert ist, wird der Einstellungsbildschirm geöffnet. Registrieren Sie den erhaltenen Schlüssel und wählen Sie dann im Menü Datei die Option Neustart aus, um die Anwendung neu zu starten.

3. Die Registrierung der Benutzerzugehörigkeit und des Benutzernamens ist nicht zwingend erforderlich, kann aber praktisch sein, wenn Sie beispielsweise E-Mail-Texte erstellen lassen.

4. Wenn Sie die Anzeigesprache angeben, ändert sich die Anzeigesprache der Benutzeroberfläche. Derzeit werden Englisch, Japanisch, Französisch, Deutsch und Spanisch unterstützt.

## Verwendung

Wenn Sie eine Frage in das Textfeld unten auf dem Bildschirm eingeben, wird oben die Antwort angezeigt.
Im Kommunikationsverlauf rechts auf dem Bildschirm werden die Titel früherer Konversationen angezeigt. Wenn Sie auf einen Titel klicken, werden Frage und Antwort auf dem Bildschirm angezeigt.
Wenn Sie das Kontrollkästchen Oben verwenden aktivieren, können Sie die Antwort von Gemini in Ihre Frage einbeziehen.
Wenn Sie auf das Symbol Zwischenablage klicken, wird der HTML-Inhalt in die Zwischenablage kopiert.
Wenn Sie auf das Websymbol klicken, können Sie die Websuche ein- und ausschalten.

### Zur Websuche

In der Standardeinstellung wird DackDackGo für die Websuche verwendet.
Wenn Sie von Google einen Google API-Schlüssel und eine Google CSE-ID erhalten und diese registrieren, wird die Google-Suche verwendet. Sie müssen jedoch die von Google festgelegten Kosten bezahlen.

### Über die interne Dokumentensuche

Es wird eine Volltextsuche mit Elasticsearch unterstützt.
Darüber hinaus wird davon ausgegangen, dass Nextcloud als Dateiserver verwendet wird. Wenn Sie das fulltextsearch-Plugin von Nextcloud verwenden und Nextcloud mit Elasticsearch integrieren, wird die Benutzerfreundlichkeit erheblich verbessert.

Die Anzeige von internen Dokumentenlinks öffnet die entsprechende Seite in Nextcloud. Bitte passen Sie den Wert des URL-Präfixes an, um die gewünschte Seite zu öffnen.

### Tastenbedienung

Bei der Texteingabe können Sie mit Umschalt + Eingabetaste einen Zeilenumbruch einfügen, mit Eingabetaste die Frage senden und mit Umschalt + Entf den Frageninhalt löschen.
Mit Alt können Sie die Wiederverwendung der vorherigen Antwort ein- und ausschalten.

## Über das Antwortformat

Antworten von Gemini erfolgen, sofern nicht anders angegeben, im Markdown-Format.

## Zu Modellparametern

Einzelheiten zu den Modellparametern von Gemini finden Sie in den Google AI for Developers unter [Über generative Modelle](https://ai.google.dev/gemini-api/docs/models/generative-models?hl=ja&_gl=1*1fu959e*_up*MQ..*_ga*MTgyNTQxNDY0NC4xNzE0MDIxNDY3*_ga_P1DBVKWT6V*MTcxNDAyMTQ2Ny4xLjAuMTcxNDAyMTg1NC4wLjAuMA..).

## Zur Persönlichkeit

Im Feld **Persönlichkeit** auf dem Einstellungsbildschirm können Sie aus den folgenden drei Persönlichkeiten wählen. Wenn Sie die Einstellung ändern, ändern sich die Antworttendenz und der Gesprächston.

* **Standard:** Standard-Chatbot-Persönlichkeit.
* **Kansai:** Persönlichkeit eines Mannes aus Kansai.
* **Rin:** Persönlichkeit einer jungen Dame.
