# Gemini Pad

## Version
1.2.3

Diese Anwendung nutzt die von Google bereitgestellten KI-Modelle über eine API.
Außerdem unterstützt sie Ollama für den Betrieb lokaler LLMs.

Standardmäßig ist das Dialogmodell "gemini-flash-latest" (änderbar).

Im Einstellungsmenü können Sie das Modell, das im Feld GEMINI_API_KEY angegeben ist, ändern, um zwischen den verschiedenen Modellen von Gemini und Ollama zu wechseln.

## Einrichtung

1. Holen Sie sich einen Gemini API-Schlüssel.
   Den Gemini API-Schlüssel können Sie [hier](https://aistudio.google.com/app/prompts/new_freeform) erhalten.
   Sie benötigen ein Google-Konto. Falls Sie noch keines haben, erstellen Sie bitte eines im Voraus.
2. Starten Sie die Anwendung. Wenn der Gemini API-Schlüssel nicht in der Anwendung registriert ist, wird das Einstellungsmenü geöffnet. Registrieren Sie dort den erhaltenen Schlüssel.
   Nach der Registrierung wählen Sie im Menü "Datei" die Option "Neustart", um die Anwendung neu zu starten.
3. Die Registrierung von Benutzerzugehörigkeit und Benutzername ist nicht zwingend erforderlich, aber hilfreich, wenn Sie beispielsweise E-Mail-Texte erstellen lassen möchten.
4. Wenn Sie die Anzeigesprache festlegen, wird die Sprache der Benutzeroberfläche geändert. Derzeit werden Englisch, Japanisch, Französisch, Deutsch und Spanisch unterstützt.

Beim ersten Start nach der Installation wird das Einstellungsmenü automatisch angezeigt.
Wenn Sie die Einstellungen erneut ändern möchten, wählen Sie im Menü "Bearbeiten" die Option "Einstellungen", um das Einstellungsmenü zu öffnen.

## Verwendung

Wenn Sie eine Frage in das Textfeld unten auf dem Bildschirm eingeben, wird die Antwort oben angezeigt.

Im Kommunikationsverlauf auf der rechten Seite des Bildschirms werden die Titel der bisherigen Gespräche angezeigt. Wenn Sie auf einen Titel klicken, werden die Frage und die Antwort auf dem Bildschirm angezeigt.

Wenn Sie das Kontrollkästchen "Obigen Text verwenden" aktivieren, wird die Antwort von Gemini in die Frage einbezogen.

Wenn Sie auf das Clipboard-Symbol klicken, wird der HTML-Inhalt in die Zwischenablage kopiert.

Mit einem Klick auf das Web-Symbol können Sie die Websuche aktivieren oder deaktivieren.

### Über die Websuche

Standardmäßig wird DuckDuckGo für die Websuche verwendet, aber die Unterstützung für DuckDuckGo ist veraltet und wird in einer zukünftigen Version entfernt. Wir empfehlen die Verwendung von Brave Search (registrieren Sie Ihren Schlüssel im Einstellungsbildschirm unter "Brave Search API Key") oder Google Search, falls verfügbar.

Wenn Sie einen Google API-Schlüssel und eine Google CSE-ID erhalten und in den Einstellungen registrieren, wird die Google-Suche verwendet; beachten Sie jedoch, dass hierfür Kosten gemäß den Google-Richtlinien anfallen können.

### Interne Dokumentensuche

Die Anwendung unterstützt die Volltextsuche mit Elasticsearch.
Da die Verwendung von Nextcloud als Dateiserver vorgesehen ist, können Sie das Nextcloud-Plugin "fulltextsearch" verwenden und Nextcloud mit Elasticsearch verbinden, um eine optimale Benutzererfahrung zu erzielen.

Die Links zu internen Dokumenten öffnen die entsprechende Seite in Nextcloud. Um die richtige Seite zu öffnen, passen Sie den Wert des URL-Präfixes entsprechend an.

Ein Beispiel für die Konfiguration der Elasticsearch-Integration finden Sie [hier](https://github.com/dtmoyaji/gemini-pad/wiki/Setting-for-Nextcloud---Elasticsearch-\(gemini%E2%80%90pad%E2%80%90filesrv\)).

#### Über gemini-pad-filesrv

Um einen lokalen Dokumentenserver für die Suche einfach bereitzustellen, wurde das System "gemini-pad-filesrv" [hier](https://github.com/dtmoyaji/gemini-pad-filesrv) bereitgestellt.
Es handelt sich um eine Container-Build-Sequenz für Nextcloud + fulltextsearch-Plugin + Elasticsearch.
Bitte verwenden Sie es zusammen mit dieser Anwendung.

### Tastenkombinationen

Beim Texteingeben können Sie mit Shift + Enter einen Zeilenumbruch einfügen, mit Enter die Frage senden und mit Shift + Delete den Inhalt der Frage löschen.
Mit Alt können Sie die Wiederverwendung der letzten Antwort ein- oder ausschalten.

## Antwortformat

Die Antworten von Gemini werden standardmäßig im Markdown-Format bereitgestellt.

## Modellparameter

Details zu den Modellparametern von Gemini finden Sie in der Dokumentation zu generativen Modellen auf der Seite [Google AI for Developers](https://ai.google.dev/gemini-api/docs/models/generative-models?hl=de&_gl=1*1fu959e*_up*MQ..*_ga*MTgyNTQxNDY0NC4xNzE0MDIxNDY3*_ga_P1DBVKWT6V*MTcxNDAyMTQ2Ny4xLjAuMTcxNDAyMTg1NC4wLjAuMA..).

## Persönlichkeit

Im Einstellungsmenü unter **Persönlichkeit** können Sie eine der folgenden drei Persönlichkeiten auswählen. Die Einstellung beeinflusst den Ton und die Tendenz der Antworten.

* **default:** Standard-Chatbot-Persönlichkeit.
* **kansai:** Persönlichkeit eines Mannes aus der Kansai-Region.
* **rin:** Persönlichkeit einer jungen Dame.
