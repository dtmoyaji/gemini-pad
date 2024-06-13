<!-- 2024-06-13 -->
**Gemini Pad**

Esta aplicación utiliza modelos de IA proporcionados por Google a través de API.
También es compatible con Ollama, teniendo en cuenta el funcionamiento de LLM local.

El modelo de diálogo predeterminado es gemini-1.5-flash, que está disponible de forma gratuita a partir de junio de 2024 (se puede cambiar).

Puede cambiar entre los distintos modelos de gemini y Ollama sobrescribiendo el modelo especificado en el elemento GEMINI_API_KEY en la pantalla de configuración.

## Configuración

1. Obtenga una clave de API de Gemini.
Puede obtener la clave de API de Gemini [aquí](https://aistudio.google.com/app/prompts/new_freeform).
Necesitará una cuenta de Google, así que créela de antemano si no la tiene.

2. Inicie la aplicación. Si la clave de API de Gemini no está registrada en la aplicación, se abrirá la pantalla de configuración, así que registre la clave obtenida.
Una vez registrado, seleccione Reiniciar en el menú Archivo y reinicie la aplicación.

3. El registro de la afiliación y el nombre de usuario no es obligatorio, pero es conveniente registrarse cuando se redacta el texto del correo electrónico, etc.

4. Si especifica el idioma de visualización, cambiará el idioma de visualización de la interfaz. Actualmente es compatible con inglés, japonés, francés, alemán y español.

## Cómo utilizar

Si escribe una pregunta en el cuadro de texto en la parte inferior de la pantalla, la respuesta aparecerá en la parte superior.

El historial de comunicaciones en el lado derecho de la pantalla muestra los títulos de las conversaciones anteriores. Al hacer clic en el título, la pregunta y la respuesta se muestran en la pantalla.

Si marca Utilizar texto anterior, puede incluir la respuesta de Gemini en la pregunta.

Al hacer clic en el icono del portapapeles, se copia el contenido HTML en el portapapeles.

Al hacer clic en el icono web, puede activar/desactivar la búsqueda web.

### Acerca de la búsqueda web

Inicialmente, DuckDuckGo se utiliza para la búsqueda web.

Si obtiene la clave de API de Google y la ID de Google CSE y las registra en la configuración, utilizará la búsqueda de Google. Sin embargo, deberá pagar los costos establecidos por Google.

### Operación de teclas

Cuando ingresa texto, presione Shift + Enter para un salto de línea, Enter para enviar una pregunta y Shift + Delete para borrar el contenido de la pregunta.
Alt activa/desactiva la reutilización de la respuesta anterior.

## Acerca del formato de respuesta

A menos que se especifique lo contrario, las respuestas de Gemini se proporcionan en formato Markdown.

## Acerca de los parámetros del modelo

Para obtener más información sobre los parámetros del modelo de Gemini, consulte [Acerca de los modelos generativos](https://ai.google.dev/gemini-api/docs/models/generative-models?hl=ja&_gl=1*1fu959e*_up*MQ..*_ga*MTgyNTQxNDY0NC4xNzE0MDIxNDY3*_ga_P1DBVKWT6V*MTcxNDAyMTQ2Ny4xLjAuMTcxNDAyMTg1NC4wLjAuMA..) en Google AI for Developers.

## Acerca de la personalidad

En el elemento **Personalidad** de la pantalla de configuración, puede seleccionar entre las siguientes 3 personalidades. Al cambiar la configuración, cambiará la tendencia de respuesta y el tono de la conversación.

* **default:** Personalidad de chatbot predeterminada.
* **kansai:** Personalidad de un hombre de Kansai.
* **rin:** Personalidad de una señorita.
<!-- gemini-1.0-pro -->