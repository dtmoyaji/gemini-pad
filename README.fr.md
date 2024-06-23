<!-- 2024-06-13 -->
# Gemini Pad

Cette application utilise les modèles d'IA de Google via une API.
Elle est également compatible avec Ollama pour une utilisation locale des LLM.

Par défaut, le modèle de dialogue est gemini-1.5-flash, disponible gratuitement en juin 2024 (modifiable).

Vous pouvez basculer entre les différents modèles de Gemini et d'Ollama en remplaçant le modèle indiqué dans le champ GEMINI_API_KEY dans les paramètres.

## Configuration

1. Obtenez une clé API Gemini.
   Vous pouvez obtenir une clé API Gemini [ici](https://aistudio.google.com/app/prompts/new_freeform).
   Vous aurez besoin d'un compte Google. Créez-en un si vous n'en avez pas.

2. Lancez l'application. Si aucune clé API Gemini n'est enregistrée dans l'application, l'écran des paramètres s'ouvrira. Saisissez la clé que vous avez obtenue.
   Une fois la clé enregistrée, sélectionnez Redémarrer dans le menu Fichier pour redémarrer l'application.

3. L'enregistrement de l'appartenance et du nom d'utilisateur n'est pas obligatoire, mais il est utile pour générer des e-mails et d'autres documents.

4. La langue d'affichage modifie la langue de l'interface. Les langues actuellement prises en charge sont l'anglais, le japonais, le français, l'allemand et l'espagnol.

## Utilisation

Saisissez votre question dans la zone de texte en bas de l'écran. La réponse s'affichera dans la partie supérieure.

L'historique des communications à droite de l'écran affiche les titres des conversations précédentes. Cliquez sur un titre pour afficher la question et la réponse correspondantes.

Cochez la case Utiliser le texte ci-dessus pour inclure la réponse de Gemini dans votre question.

Cliquez sur l'icône Presse-papiers pour copier le contenu HTML dans le presse-papiers.

Cliquez sur l'icône Web pour activer ou désactiver la recherche Web.

### À propos de la recherche Web

Par défaut, l'application utilise DuckDuckGo pour la recherche Web.

Si vous obtenez une clé API Google et un ID Google CSE, vous pouvez les enregistrer dans les paramètres pour utiliser la recherche Google. Toutefois, vous devrez payer les frais définis par Google.

### À propos de la recherche de documents internes

Il prend en charge la recherche en texte intégral utilisant Elasticsearch.
De plus, il est prévu d'utiliser Nextcloud en tant que serveur de fichiers, donc en utilisant le plugin fulltextsearch de Nextcloud et en le connectant à Elasticsearch, l'expérience utilisateur sera considérablement améliorée.

L'affichage des liens vers les documents internes ouvrira la page correspondante sur Nextcloud, donc veuillez ajuster la valeur du préfixe d'URL pour ouvrir la page appropriée.

Veuillez vous référer à [ici](https://github.com/dtmoyaji/gemini-pad/wiki/Setting-for-Nextcloud---Elasticsearch-(gemini%E2%80%90pad%E2%80%90filesrv)) pour un exemple de paramètres d'intégration Elasticsearch.

#### À propos de gemini-pad-filesrv

Afin de faciliter la préparation d'un serveur de documents local pour la recherche, j'ai créé un mécanisme appelé gemini-pad-filesrv, disponible [ici](https://github.com/dtmoyaji/gemini-pad-filesrv).
Il s'agit d'une séquence de construction de conteneurs pour nextcloud + le plugin fulltextsearch + elasticsearch.
Veuillez l'utiliser conjointement.

### Raccourcis clavier

Lorsque vous saisissez du texte, utilisez Maj + Entrée pour créer un saut de ligne, Entrée pour envoyer la question et Maj + Suppr pour effacer le contenu de la question.
Utilisez Alt pour activer ou désactiver la réutilisation de la réponse précédente.

## Format de réponse

Les réponses de Gemini sont au format Markdown, sauf indication contraire.

## Paramètres du modèle

Pour plus d'informations sur les paramètres du modèle Gemini, consultez la page [Modèles génératifs](https://ai.google.dev/gemini-api/docs/models/generative-models?hl=ja&_gl=1*1fu959e*_up*MQ..*_ga*MTgyNTQxNDY0NC4xNzE0MDIxNDY3*_ga_P1DBVKWT6V*MTcxNDAyMTQ2Ny4xLjAuMTcxNDAyMTg1NC4wLjAuMA..) de Google AI for Developers.

## Personnalité

Dans les paramètres, sous **Personnalité**, vous pouvez choisir parmi les 3 personnalités suivantes. La modification de ce paramètre modifie le ton et le style des réponses.

* **default :** Personnalité de chatbot par défaut.
* **kansai :** Personnalité d'un homme de la région du Kansai.
* **rin :** Personnalité d'une jeune fille de bonne famille.
<!-- gemini-1.0-pro -->