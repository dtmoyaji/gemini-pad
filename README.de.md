# Gemini Pad

Diese Anwendung verwendet KI-Modelle, die von Google über APIs bereitgestellt werden.

Standardmäßig ist das Dialogmodell auf gemini-1.5-pro eingestellt, das ab Juni 2024 kostenlos verfügbar ist (änderbar).
Das Titel- und Schlüsselwortgenerierungsmodell ist auf gemini-1.0-pro (fest) eingestellt.

## Einrichtung

1. Holen Sie sich einen Gemini-API-Schlüssel.
   Sie können einen Gemini-API-Schlüssel von [hier](https://aistudio.google.com/app/prompts/new_freeform) erhalten.
   Sie benötigen ein Google-Konto. Erstellen Sie daher bitte im Voraus eines, falls Sie noch keines haben.

2. Starten Sie die App. Wenn der Gemini-API-Schlüssel nicht in der App registriert ist, wird der Einstellungsbildschirm geöffnet. Registrieren Sie ihn im Feld GEMINI_API_KEY.
   Wählen Sie nach der Registrierung im Menü Datei die Option Neu starten und starten Sie die App neu.

3. Die Registrierung Ihrer Benutzerzugehörigkeit und Ihres Benutzernamens ist nicht erforderlich, aber praktisch beim Erstellen von E-Mails usw.

4. Wenn Sie eine Sprache in LANG angeben, ändert sich die Anzeigesprache der Benutzeroberfläche. Derzeit werden Japanisch und Englisch unterstützt.

## Verwendung

Wenn Sie eine Frage in das Textfeld am unteren Bildschirmrand eingeben, wird die Antwort oben angezeigt.

Der Kommunikationsverlauf auf der rechten Seite des Bildschirms zeigt die Titel vergangener Unterhaltungen an. Wenn Sie auf einen Titel klicken, werden Frage und Antwort auf dem Bildschirm angezeigt.

Wenn Sie Oberen Text verwenden aktivieren, können Sie Geminis Antwort in Ihre Frage einbeziehen.

Wenn Sie auf das Symbol für die Zwischenablage klicken, wird der HTML-Inhalt in die Zwischenablage kopiert.

Wenn Sie auf das Websymbol klicken, wird die Websuche ein- oder ausgeschaltet.

### Über die Websuche

Anfangs wird DackDackGo für die Websuche verwendet.

Wenn Sie GOOGLE_API_KEY und GOOGLE_CSE_ID von Google erhalten und in den Einstellungen registrieren, wird die Google-Suche verwendet. Sie müssen jedoch die von Google festgelegten Gebühren bezahlen.

### Tastenbedienung

Drücken Sie beim Eingeben von Text Umschalt + Eingabetaste, um eine neue Zeile zu erstellen, Eingabetaste, um eine Frage zu senden, und Umschalt + Entf, um den Frageninhalt zu löschen.
Drücken Sie Alt, um die Wiederverwendung der vorherigen Antwort ein- oder auszuschalten.

## Über das Antwortformat

Antworten von Gemini sind standardmäßig im Markdown-Format.

## Über Modellparameter

Einzelheiten zu Geminis Modellparametern finden Sie in den Google AI for Developers' [Über generative Modelle](https://ai.google.dev/gemini-api/docs/models/generative-models?hl=ja&_gl=1*1fu959e*_up*MQ..*_ga*MTgyNTQxNDY0NC4xNzE0MDIxNDY3*_ga_P1DBVKWT6V*MTcxNDAyMTQ2Ny4xLjAuMTcxNDAyMTg1NC4wLjAuMA..) .

## Über Persönlichkeit

Sie können aus den folgenden drei Persönlichkeiten im Feld PERSÖNLICHKEIT des Einstellungsbildschirms wählen. Durch Ändern der Einstellung ändern sich die Tendenz der Antwort und der Tonfall der Unterhaltung.

* **Standard:** Standard-Chatbot-Persönlichkeit.
* **Kansai:** Persönlichkeit eines Mannes aus Kansai.
* **Rin:** Persönlichkeit einer jungen Dame.
