# Gemini Pad

Cette application utilise des modèles d'IA fournis par Google via API.

Par défaut, le modèle de dialogue est défini sur gemini-1.5-pro, qui est actuellement disponible gratuitement à partir de juin 2024 (sous réserve de modifications). Le modèle de génération de titre et de mot-clé est défini sur gemini-1.0-pro (fixe).

## Configuration

1. Obtenir une clé API Gemini.
Vous pouvez obtenir une clé API Gemini à partir de [ici](https://aistudio.google.com/app/prompts/new_freeform).
Vous aurez besoin d'un compte Google, veuillez donc en créer un si vous n'en avez pas.

2. Lancez l'application. Si une clé API Gemini n'est pas enregistrée dans l'application, l'écran des paramètres s'ouvrira, veuillez donc enregistrer la clé obtenue.
Une fois enregistré, sélectionnez Redémarrer dans le menu Fichier et redémarrez l'application.

3. L'affiliation utilisateur et l'enregistrement du nom d'utilisateur ne sont pas obligatoires, mais il est pratique de s'inscrire lors de la création d'un texte d'e-mail, etc.

4. Si vous spécifiez la langue d'affichage, la langue d'affichage de l'interface changera. Actuellement, le japonais, l'anglais, le français et l'allemand sont pris en charge.

## Utilisation

Si vous entrez une question dans la zone de texte en bas de l'écran, la réponse s'affichera en haut.

L'historique des communications sur le côté droit de l'écran affiche les titres des conversations passées. Cliquer sur un titre affichera la question et la réponse à l'écran.

Si vous cochez Utiliser le texte ci-dessus, vous pouvez inclure la réponse de Gemini dans votre question.

Cliquer sur l'icône du presse-papiers copiera le contenu HTML dans le presse-papiers.

Cliquer sur l'icône Web activera/désactivera la recherche Web.

### À propos de la recherche sur le Web

Initialement, DackDackGo est utilisé pour la recherche sur le Web.

Si vous obtenez une clé API Google et un identifiant Google CSE auprès de Google et que vous les enregistrez dans les paramètres, la recherche Google sera utilisée. Cependant, vous devrez payer les frais fixés par Google.

### Opération clé

Lorsque vous entrez du texte, appuyez sur Maj + Entrée pour créer une nouvelle ligne, Entrée pour envoyer une question et Maj + Suppr pour supprimer le contenu de la question.
Appuyez sur Alt pour activer/désactiver la réutilisation de la réponse précédente.

## À propos du format de réponse

Les réponses de Gemini sont au format Markdown, sauf indication contraire.

## À propos des paramètres du modèle

Pour plus de détails sur les paramètres du modèle de Gemini, veuillez vous référer à Google AI for Developers' [À propos des modèles génératifs](https://ai.google.dev/gemini-api/docs/models/generative-models?hl=ja&_gl=1*1fu959e*_up*MQ..*_ga*MTgyNTQxNDY0NC4xNzE0MDIxNDY3*_ga_P1DBVKWT6V*MTcxNDAyMTQ2Ny4xLjAuMTcxNDAyMTg1NC4wLjAuMA..).

## À propos de la personnalité

Vous pouvez choisir parmi les trois personnalités suivantes dans l'élément **Personnalité** dans l'écran des paramètres. La modification du paramètre modifiera la tendance de la réponse et le ton de la conversation.

* **par défaut:** Personnalité de chatbot par défaut.
* **kansai:** Personnalité d'un homme du Kansai.
* **rin:** Personnalité d'une jeune femme.
