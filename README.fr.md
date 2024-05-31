# Gemini Pad

 Cette application utilise un modèle d'IA fourni par Google en tant qu'API.

 Par défaut, le modèle est défini sur gemini-1.0-pro, qui est disponible gratuitement à partir d'avril 2024.

## Configuration

 1. Obtenez une clé API Gemini.

 Vous pouvez obtenir une clé API Gemini à partir de [ici](https://aistudio.google.com/app/prompts/new_freeform).

 Vous aurez besoin d'un compte Google, veuillez donc en créer un à l'avance si vous n'en avez pas.

 2. Démarrez l'application. Si la clé API Gemini n'est pas enregistrée dans l'application, l'écran de configuration s'ouvrira, alors enregistrez-la dans l'élément GEMINI_API_KEY.

 Une fois enregistré, sélectionnez Redémarrer dans le menu Fichier et redémarrez l'application.

 3. L'enregistrement de votre affiliation utilisateur et de votre nom d'utilisateur n'est pas obligatoire, mais il est pratique lorsque vous souhaitez créer un e-mail ou quelque chose comme ça.

 4. Si vous spécifiez une langue dans LANG, la langue d'affichage de l'interface changera. Actuellement, le japonais et l'anglais sont pris en charge.

## Comment utiliser

 Si vous entrez une question dans la zone de texte en bas de l'écran, la réponse s'affichera en haut.

 L'historique des communications à droite de l'écran affiche les titres des conversations passées. En cliquant sur un titre, la question et la réponse s'afficheront à l'écran.

 Si vous cochez Utiliser le texte ci-dessus, vous pouvez inclure la réponse de Gemini dans votre question.

 En cliquant sur l'icône du presse-papiers, le contenu HTML sera copié dans le presse-papiers.

 En cliquant sur l'icône Web, vous pouvez activer ou désactiver la recherche sur le Web.

 ### À propos de la recherche sur le Web

 La recherche sur le Web est configurée pour rechercher DackDackGo par défaut.

 Si vous obtenez GOOGLE_API_KEY et GOOGLE_CSE_ID de Google et les enregistrez dans les paramètres, la recherche Google sera utilisée. Cependant, vous devrez payer les frais fixés par Google.

 ### Opération clé

 Lors de la saisie de texte, appuyez sur Maj + Entrée pour faire un saut de ligne, sur Entrée pour envoyer une question et sur Maj + Suppr pour effacer la question.

 Appuyez sur Alt pour activer/désactiver la réutilisation de la réponse précédente.

 ## À propos du format de réponse

 Les réponses de Gemini sont au format Markdown, sauf indication contraire.

 ## À propos des paramètres du modèle

 Pour plus de détails sur les paramètres du modèle de Gemini, consultez [À propos des modèles génératifs](https://ai.google.dev/gemini-api/docs/models/generative-models?hl=ja&_gl=1*1fu959e*_up*MQ..*_ga*MTgyNTQxNDY0NC4xNzE0MDIxNDY3*_ga_P1DBVKWT6V*MTcxNDAyMTQ2Ny4xLjAuMTcxNDAyMTg1NC4wLjAuMA..) de Google AI pour les développeurs.

 ## À propos de la personnalité

 Vous pouvez choisir parmi les trois personnalités suivantes dans l'élément PERSONNALITÉ de l'écran des paramètres. La modification du paramètre modifiera la tendance de la réponse et le ton de la conversation.

 * **par défaut :** Personnalité de chatbot par défaut.
 * **kansai :** Personnalité d'un homme du Kansai.
 * **rin :** Personnalité d'une jeune femme.

 Un redémarrage est requis après le changement.