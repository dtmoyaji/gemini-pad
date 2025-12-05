# Gemini Pad

## Version
1.2.3

Cette application utilise des modèles d'IA fournis par Google via une API.  
Elle prend également en charge Ollama pour l'utilisation de LLM locaux.

Par défaut, le modèle de dialogue configuré est "gemini-flash-latest" (modifiable).

Dans l'écran de configuration, vous pouvez modifier le modèle spécifié dans le champ GEMINI_API_KEY pour basculer entre les différents modèles de Gemini et Ollama.

## Configuration

1. Obtenez une clé API Gemini.  
   Vous pouvez obtenir la clé API Gemini [ici](https://aistudio.google.com/app/prompts/new_freeform).  
   Un compte Google est nécessaire. Si vous n'en avez pas, veuillez en créer un à l'avance.
2. Lancez l'application. Si la clé API Gemini n'est pas enregistrée dans l'application, l'écran de configuration s'ouvrira. Enregistrez-y la clé obtenue.  
   Une fois enregistrée, sélectionnez "Redémarrer" dans le menu "Fichier" pour redémarrer l'application.
3. L'enregistrement de l'affiliation et du nom de l'utilisateur n'est pas obligatoire, mais il peut être utile, par exemple, pour générer des textes d'e-mails.
4. En spécifiant la langue d'affichage, l'interface utilisateur changera de langue. Actuellement, l'anglais, le japonais, le français, l'allemand et l'espagnol sont pris en charge.

Lors du premier lancement après l'installation, l'écran de configuration s'affichera automatiquement.  
Si vous souhaitez modifier à nouveau les paramètres, sélectionnez "Paramètres" dans le menu "Édition" pour ouvrir l'écran de configuration.

## Utilisation

Saisissez une question dans le champ de texte en bas de l'écran, et la réponse s'affichera en haut.

Dans l'historique des communications sur le côté droit de l'écran, les titres des conversations précédentes sont affichés. En cliquant sur un titre, la question et la réponse s'afficheront à l'écran.

Si vous cochez la case "Utiliser le texte ci-dessus", la réponse de Gemini sera incluse dans la question.

En cliquant sur l'icône du presse-papiers, le contenu HTML sera copié dans le presse-papiers.

En cliquant sur l'icône Web, vous pouvez activer ou désactiver la recherche Web.

### À propos de la recherche Web

Par défaut, DuckDuckGo est utilisé pour la recherche Web, mais le support de DuckDuckGo est obsolète et sera supprimé dans une future version. Nous recommandons d'utiliser Brave Search (enregistrez votre clé dans l'écran des paramètres sous "Brave Search API Key") ou Google Search si disponible.

Si vous obtenez une clé API Google et un ID CSE Google et que vous les enregistrez dans les paramètres, la recherche Google sera utilisée ; notez toutefois que cela peut entraîner des coûts conformément aux politiques de Google.

### À propos de la recherche de documents internes

L'application prend en charge la recherche en texte intégral à l'aide d'Elasticsearch.  
De plus, elle est conçue pour utiliser Nextcloud comme serveur de fichiers. En utilisant le plugin "fulltextsearch" de Nextcloud et en le connectant à Elasticsearch, l'expérience utilisateur sera considérablement améliorée.

Les liens vers les documents internes ouvrent la page correspondante dans Nextcloud. Pour ouvrir la bonne page, ajustez la valeur du préfixe d'URL si nécessaire.

Vous pouvez trouver un exemple de configuration pour l'intégration avec Elasticsearch [ici](https://github.com/dtmoyaji/gemini-pad/wiki/Setting-for-Nextcloud---Elasticsearch-\(gemini%E2%80%90pad%E2%80%90filesrv\)).

#### À propos de gemini-pad-filesrv

Pour fournir facilement un serveur de documents local pour la recherche, le système "gemini-pad-filesrv" a été préparé [ici](https://github.com/dtmoyaji/gemini-pad-filesrv).  
Il s'agit d'une séquence de construction de conteneurs pour Nextcloud + plugin fulltextsearch + Elasticsearch.  
Veuillez l'utiliser avec cette application.

### Opérations clavier

Lors de la saisie de texte, vous pouvez utiliser Shift + Entrée pour insérer un saut de ligne, Entrée pour envoyer la question et Shift + Suppr pour effacer le contenu de la question.  
Avec Alt, vous pouvez activer ou désactiver la réutilisation de la réponse précédente.

## À propos du format des réponses

Les réponses de Gemini sont fournies par défaut au format Markdown, sauf indication contraire.

## À propos des paramètres du modèle

Pour plus de détails sur les paramètres du modèle Gemini, consultez la documentation sur les modèles génératifs sur [Google AI for Developers](https://ai.google.dev/gemini-api/docs/models/generative-models?hl=fr&_gl=1*1fu959e*_up*MQ..*_ga*MTgyNTQxNDY0NC4xNzE0MDIxNDY3*_ga_P1DBVKWT6V*MTcxNDAyMTQ2Ny4xLjAuMTcxNDAyMTg1NC4wLjAuMA..).

## À propos des personnalités

Dans l'écran de configuration, dans la section **Personnalité**, vous pouvez choisir parmi les trois personnalités suivantes. Modifier ce paramètre affectera le ton et la tendance des réponses.

* **default :** Personnalité par défaut du chatbot.
* **kansai :** Personnalité d'un homme de la région de Kansai.
* **rin :** Personnalité d'une jeune femme.