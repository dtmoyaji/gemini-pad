# Gemini Pad

Diese Anwendung verwendet KI-Modelle, die von Google über die API bereitgestellt werden.

Das Dialogmodell ist standardmäßig auf gemini-1.5-pro eingestellt, das ab Juni 2024 kostenlos verfügbar ist (Änderungen vorbehalten). Das Modell zur Generierung von Titeln und Schlüsselwörtern ist auf gemini-1.0-pro (fest) eingestellt.

## Konfiguration

1. Rufen Sie einen Gemini-API-Schlüssel ab.
Sie können einen Gemini-API-Schlüssel von [hier](https://aistudio.google.com/app/prompts/new_freeform) abrufen.
Sie benötigen ein Google-Konto. Erstellen Sie daher eines, falls Sie noch keines haben.

2. Starten Sie die Anwendung. Wenn in der Anwendung kein Gemini-API-Schlüssel registriert ist, wird der Einstellungsbildschirm geöffnet. Registrieren Sie daher den erhaltenen Schlüssel.
Wählen Sie nach der Registrierung im Menü Datei die Option Neu starten und starten Sie die Anwendung neu.

3. Die Benutzerzugehörigkeit und die Registrierung des Benutzernamens sind nicht obligatorisch, es ist jedoch praktisch, sich bei der Erstellung eines E-Mail-Textes usw. zu registrieren.

4. Wenn Sie die Anzeigesprache angeben, ändert sich die Anzeigesprache der Benutzeroberfläche. Derzeit werden Japanisch, Englisch, Französisch und Deutsch unterstützt.

## Verwendung

Wenn Sie eine Frage in das Textfeld unten auf dem Bildschirm eingeben, wird die Antwort oben angezeigt.

Im Kommunikationsverlauf auf der rechten Seite des Bildschirms werden die Titel vergangener Unterhaltungen angezeigt. Wenn Sie auf einen Titel klicken, werden die Frage und die Antwort auf dem Bildschirm angezeigt.

Wenn Sie die Option **Obigen Text verwenden** aktivieren, können Sie die Antwort von Gemini in Ihre Frage einbeziehen.

Wenn Sie auf das Symbol des Papierkorbs klicken, wird der HTML-Inhalt in die Zwischenablage kopiert.

Wenn Sie auf das Websymbol klicken, wird die Websuche aktiviert/deaktiviert.

### Über die Websuche

Ursprünglich wird DackDackGo für die Websuche verwendet.

Wenn Sie einen Google-API-Schlüssel und eine Google-CSE-ID von Google erhalten und in den Einstellungen registrieren, wird die Google-Suche verwendet. Sie müssen jedoch die von Google festgelegten Gebühren bezahlen.

### Tastenbedienung

Wenn Sie Text eingeben, drücken Sie Umschalt+Eingabe, um eine neue Zeile zu erstellen, Eingabe, um eine Frage zu senden, und Umschalt+Entf, um den Inhalt der Frage zu löschen.
Drücken Sie Alt, um die Wiederverwendung der vorherigen Antwort zu aktivieren/deaktivieren.

## Über das Antwortformat

Die Antworten von Gemini sind im Markdown-Format, sofern nicht anders angegeben.

## Über die Modelleinstellungen

Weitere Informationen zu den Modelleinstellungen von Gemini finden Sie in Google AI for Developers' [Über generative Modelle](https://ai.google.dev/gemini-api/docs/models/generative-models?hl=ja&_gl=1*1fu959e*_up*MQ..*_ga*MTgyNTQxNDY0NC4xNzE0MDIxNDY3*_ga_P1DBVKWT6V*MTcxNDAyMTQ2Ny4xLjAuMTcxNDAyMTg1NC4wLjAuMA..).

## Über die Persönlichkeit

Sie können aus den folgenden drei Persönlichkeiten im Element **Persönlichkeit** im Einstellungsbildschirm wählen. Durch Ändern des Parameters werden die Tendenz der Antwort und der Ton der Unterhaltung geändert.

* **Standard:** Standardmäßige Chatbot-Persönlichkeit.
* **Kansai:** Persönlichkeit eines Mannes aus Kansai.
* **Rin:** Persönlichkeit einer jungen Frau.
