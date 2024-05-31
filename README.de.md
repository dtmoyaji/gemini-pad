# Gemini Pad

 Diese Anwendung verwendet eine Google-API, die KI-Modelle bereitstellt.

Standardmäßig ist das Modell auf gemini-1.0-pro eingestellt, das ab April 2024 kostenlos verfügbar ist.

## Einrichtung
1. Rufen Sie den Gemini-API-Schlüssel ab.
   Sie erhalten den Gemini-API-Schlüssel [hier](https://aistudio.google.com/app/prompts/new_freeform).
   Sie benötigen ein Google-Konto. Erstellen Sie es, falls Sie noch keins haben.

2. Starten Sie die Anwendung. Wenn der Gemini-API-Schlüssel nicht in der Anwendung registriert ist, wird der Einstellungsbildschirm geöffnet. Registrieren Sie sich unter GEMINI_API_KEY.
   Starten Sie die Anwendung nach der Registrierung neu, indem Sie im Menü Datei die Option Neustart auswählen.

3. Die Registrierung der Benutzerzugehörigkeit und des Benutzernamens ist nicht zwingend erforderlich. Es ist jedoch praktisch, wenn Sie beispielsweise E-Mail-Texte erstellen lassen.

4. Wenn Sie in LANG eine Sprache angeben, ändert sich die Anzeigesprache der Benutzeroberfläche. Derzeit werden Japanisch und Englisch unterstützt.

## Verwendung
Wenn Sie Ihre Frage in das Textfeld unten auf dem Bildschirm eingeben, wird die Antwort oben angezeigt.

Im Kommunikationsverlauf rechts auf dem Bildschirm werden die Titel früherer Konversationen angezeigt. Wenn Sie auf einen Titel klicken, werden Frage und Antwort auf dem Bildschirm angezeigt.

Wenn Sie das Kontrollkästchen "Für die Verwendung oben" aktivieren, können Sie die Antwort von Gemini in Ihre Frage einbeziehen.

Wenn Sie auf das Symbol für die Zwischenablage klicken, wird der HTML-Inhalt in die Zwischenablage kopiert.

Wenn Sie auf das Websymbol klicken, können Sie die Websuche ein- oder ausschalten.

### Zur Websuche
Die Websuche ist standardmäßig so eingestellt, dass DackDackGo durchsucht wird.

Wenn Sie GOOGLE_API_KEY und GOOGLE_CSE_ID von Google abrufen und registrieren, wird die Google-Suche verwendet. Sie müssen jedoch die von Google festgelegten Kosten bezahlen.

### Tastenbedienung
Bei der Texteingabe können Sie mit Umschalt + Eingabetaste einen Zeilenumbruch einfügen, mit Eingabetaste die Frage senden und mit Umschalt + Entf den Frageninhalt löschen.
Mit Alt können Sie die vorherige Antwort wiederverwenden (ein-/ausschalten).

## Zum Antwortformat
Die Antworten von Gemini erfolgen, sofern nicht anders angegeben, im Markdown-Format.

## Zu Modellparametern
Ausführliche Informationen zu den Modellparametern von Gemini finden Sie in den Google AI for Developers unter [Über generative Modelle](https://ai.google.dev/gemini-api/docs/models/generative-models?hl=ja&_gl=1*1fu959e*_up*MQ..*_ga*MTgyNTQxNDY0NC4xNzE0MDIxNDY3*_ga_P1DBVKWT6V*MTcxNDAyMTQ2Ny4xLjAuMTcxNDAyMTg1NC4wLjAuMA..).

## Zur Persönlichkeit
Im Einstellungsbildschirm können Sie unter PERSONALITY aus den folgenden drei Persönlichkeiten wählen. Wenn Sie die Einstellung ändern, ändern sich die Tendenz der Antworten und der Tonfall der Konversation.

* **default:** Standard-Chatbot-Persönlichkeit.
* **kansai:** Persönlichkeit eines Mannes aus Kansai.
* **rin:** Persönlichkeit einer jungen Dame.

Nach der Änderung ist ein Neustart erforderlich.
