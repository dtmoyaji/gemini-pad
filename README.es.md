# Gemini Pad

## Versión
1.2.3


Esta aplicación utiliza modelos de IA proporcionados por Google a través de una API.  
Además, es compatible con Ollama para operar LLMs locales.

Por defecto, el modelo de diálogo configurado es "gemini-2.0-flash", que está disponible de forma gratuita a partir de junio de 2024 (puede ser modificado).

En la pantalla de configuración, puede cambiar el modelo especificado en el campo GEMINI_API_KEY para alternar entre los diferentes modelos de Gemini y Ollama.

## Configuración

1. Obtenga una clave API de Gemini.  
   Puede obtener la clave API de Gemini [aquí](https://aistudio.google.com/app/prompts/new_freeform).  
   Necesitará una cuenta de Google. Si no tiene una, cree una con anticipación.
2. Inicie la aplicación. Si la clave API de Gemini no está registrada en la aplicación, se abrirá la pantalla de configuración. Registre la clave obtenida allí.  
   Una vez registrada, seleccione "Reiniciar" en el menú "Archivo" para reiniciar la aplicación.
3. El registro de la afiliación del usuario y el nombre del usuario no es obligatorio, pero es útil, por ejemplo, para generar textos de correo electrónico.
4. Al especificar el idioma de visualización, se cambiará el idioma de la interfaz. Actualmente, se admiten inglés, japonés, francés, alemán y español.

Al iniciar la aplicación por primera vez después de la instalación, se mostrará automáticamente la pantalla de configuración.  
Si desea cambiar la configuración nuevamente, seleccione "Configuración" en el menú "Editar" para abrir la pantalla de configuración.

## Cómo usar

Ingrese una pregunta en el cuadro de texto en la parte inferior de la pantalla, y la respuesta se mostrará en la parte superior.

En el historial de comunicación en el lado derecho de la pantalla, se muestran los títulos de las conversaciones anteriores. Al hacer clic en un título, se mostrarán la pregunta y la respuesta en la pantalla.

Si marca la casilla "Usar texto anterior", la respuesta de Gemini se incluirá en la pregunta.

Al hacer clic en el icono del portapapeles, el contenido HTML se copiará al portapapeles.

Al hacer clic en el icono de la web, puede alternar entre habilitar o deshabilitar la búsqueda web.

### Sobre la búsqueda web

De forma predeterminada, se utiliza DuckDuckGo para la búsqueda web.

Si obtiene una clave API de Google y una ID de CSE de Google y las registra en la configuración, se utilizará la búsqueda de Google. Sin embargo, tenga en cuenta que esto puede incurrir en costos según las políticas de Google.

### Sobre la búsqueda de documentos internos

La aplicación admite la búsqueda de texto completo utilizando Elasticsearch.  
Además, se supone que se utiliza Nextcloud como servidor de archivos, por lo que al usar el complemento "fulltextsearch" de Nextcloud y conectarlo con Elasticsearch, se mejora significativamente la experiencia del usuario.

Los enlaces a documentos internos abren la página correspondiente en Nextcloud. Para abrir la página correcta, ajuste el valor del prefijo de URL según sea necesario.

Puede encontrar un ejemplo de configuración para la integración con Elasticsearch [aquí](https://github.com/dtmoyaji/gemini-pad/wiki/Setting-for-Nextcloud---Elasticsearch-\(gemini%E2%80%90pad%E2%80%90filesrv\)).

#### Sobre gemini-pad-filesrv

Para proporcionar fácilmente un servidor de documentos local para la búsqueda, se ha preparado el sistema "gemini-pad-filesrv" [aquí](https://github.com/dtmoyaji/gemini-pad-filesrv).  
Es una secuencia de construcción de contenedores para Nextcloud + complemento fulltextsearch + Elasticsearch.  
Úselo junto con esta aplicación.

### Operaciones de teclado

Al ingresar texto, puede usar Shift + Enter para insertar un salto de línea, Enter para enviar la pregunta y Shift + Delete para borrar el contenido de la pregunta.  
Con Alt, puede activar o desactivar la reutilización de la respuesta anterior.

## Sobre el formato de las respuestas

Las respuestas de Gemini se proporcionan en formato Markdown de manera predeterminada, a menos que se especifique lo contrario.

## Sobre los parámetros del modelo

Para obtener más detalles sobre los parámetros del modelo de Gemini, consulte la documentación sobre modelos generativos en [Google AI for Developers](https://ai.google.dev/gemini-api/docs/models/generative-models?hl=es&_gl=1*1fu959e*_up*MQ..*_ga*MTgyNTQxNDY0NC4xNzE0MDIxNDY3*_ga_P1DBVKWT6V*MTcxNDAyMTQ2Ny4xLjAuMTcxNDAyMTg1NC4wLjAuMA..).

## Sobre las personalidades

En la pantalla de configuración, en el apartado **Personalidad**, puede elegir entre las siguientes tres personalidades. Cambiar esta configuración afectará el tono y la tendencia de las respuestas.

* **default:** Personalidad predeterminada del chatbot.
* **kansai:** Personalidad de un hombre de la región de Kansai.
* **rin:** Personalidad de una joven dama.