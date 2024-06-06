# Gemini Pad

Cette application utilise l'API des modèles d'IA fournis par Google.

Par défaut, le modèle de dialogue est gemini-1.5-pro, disponible gratuitement en juin 2024 (modifiable).
Le modèle de génération de titres et de mots-clés est gemini-1.0-pro (fixe).

## Configuration

1. Obtenez une clé API Gemini.
   La clé API Gemini est disponible [ici](https://aistudio.google.com/app/prompts/new_freeform).
   Vous aurez besoin d'un compte Google, alors créez-en un au préalable si vous n'en avez pas.

2. Lancez l'application. Si aucune clé API Gemini n'est enregistrée dans l'application, l'écran de configuration s'ouvrira, alors enregistrez-la dans le champ GEMINI_API_KEY.
   Une fois l'enregistrement terminé, sélectionnez Redémarrer dans le menu Fichier pour redémarrer l'application.

3. L'enregistrement de l'affiliation et du nom d'utilisateur n'est pas obligatoire, mais il est pratique de le faire lorsque vous souhaitez créer des textes tels que des courriels.

4. Si vous spécifiez une langue dans LANG, la langue d'affichage de l'interface changera. Actuellement, le japonais et l'anglais sont pris en charge.

## Utilisation

Lorsque vous saisissez une question dans la zone de texte en bas de l'écran, la réponse s'affiche en haut.

L'historique des communications sur la droite de l'écran affiche les titres des conversations passées. Cliquez sur un titre pour afficher la question et la réponse à l'écran.

Cochez Utiliser le texte ci-dessus pour inclure la réponse de Gemini dans la question.

Cliquez sur l'icône du presse-papiers pour copier le contenu HTML dans le presse-papiers.

Cliquez sur l'icône Web pour activer/désactiver la recherche Web.

### À propos de la recherche Web

Par défaut, DackDackGo est utilisé pour la recherche Web.

Si vous obtenez GOOGLE_API_KEY et GOOGLE_CSE_ID auprès de Google et que vous les enregistrez dans les paramètres, la recherche Google sera utilisée. Toutefois, vous devrez payer les frais définis par Google.

### Raccourcis clavier

Lorsque vous saisissez du texte, utilisez Maj + Entrée pour passer à la ligne, Entrée pour envoyer la question et Maj + Suppr pour effacer le contenu de la question.
Utilisez Alt pour activer/désactiver la réutilisation de la réponse précédente.

## À propos du format de réponse

Les réponses de Gemini sont au format Markdown, sauf indication contraire.

## À propos des paramètres du modèle

Pour plus d'informations sur les paramètres du modèle de Gemini, consultez [À propos des modèles génératifs](https://ai.google.dev/gemini-api/docs/models/generative-models?hl=ja&_gl=1*1fu959e*_up*MQ..*_ga*MTgyNTQxNDY0NC4xNzE0MDIxNDY3*_ga_P1DBVKWT6V*MTcxNDAyMTQ2Ny4xLjAuMTcxNDAyMTg1NC4wLjAuMA..) dans Google AI for Developers.

## À propos de la personnalité

Dans les paramètres de l'écran, vous pouvez choisir parmi les 3 personnalités suivantes dans le champ PERSONALITY. La tendance des réponses et le ton de la conversation changeront en fonction des paramètres.

* **default:** Personnalité de chatbot par défaut.
* **kansai:** Personnalité d'un homme du Kansai.
* **rin:** Personnalité d'une jeune fille.
