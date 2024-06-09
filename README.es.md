# Gemini Pad

Esta aplicación utiliza modelos de IA proporcionados por Google a través de la API.
De forma predeterminada, el modelo de diálogo está configurado en gemini-1.5-pro, que actualmente está disponible de forma gratuita a partir de junio de 2024 (sujeto a cambios). El modelo de generación de títulos y palabras clave está configurado en gemini-1.0-pro (fijo).

## Configuración

1. Obtén una clave de API de Gemini.
Puedes obtener una clave de API de Gemini desde [aquí](https://aistudio.google.com/app/prompts/new_freeform).
Necesitarás una cuenta de Google, así que crea una si no tienes una.
2. Inicia la aplicación. Si no se ha registrado una clave de API de Gemini en la aplicación, se abrirá la pantalla de configuración, así que registra la clave obtenida.
Una vez registrada, selecciona Reiniciar en el menú Archivo y reinicia la aplicación.
3. El registro de afiliación de usuario y nombre de usuario no es obligatorio, pero es conveniente registrarlo al crear texto de correo electrónico, etc.
4. Si especificas el idioma de visualización, el idioma de visualización de la interfaz cambiará. Actualmente se admiten japonés, inglés, francés y alemán.

## Uso

Si ingresas una pregunta en el cuadro de texto en la parte inferior de la pantalla, la respuesta se mostrará en la parte superior.
El historial de comunicación en el lado derecho de la pantalla muestra los títulos de las conversaciones anteriores. Al hacer clic en un título, se mostrará la pregunta y la respuesta en la pantalla.
Si marcas la opción Usar texto anterior, puedes incluir la respuesta de Gemini en tu pregunta.
Al hacer clic en el icono del portapapeles, se copiará el contenido HTML al portapapeles.
Al hacer clic en el icono web, se activará/desactivará la búsqueda web.

### Acerca de la búsqueda web

Inicialmente, se utiliza DackDackGo para la búsqueda web.
Si obtienes una clave de API de Google y un ID de CSE de Google y los registras en la configuración, se utilizará la búsqueda de Google. Sin embargo, deberás pagar las tarifas establecidas por Google.

### Operación de teclas

Al ingresar texto, presiona Shift + Enter para crear una nueva línea, Enter para enviar una pregunta y Shift + Delete para eliminar el contenido de la pregunta.
Presiona Alt para activar/desactivar la reutilización de la respuesta anterior.

## Acerca del formato de respuesta

Las respuestas de Gemini están en formato Markdown a menos que se especifique lo contrario.

## Acerca de los parámetros del modelo

Para obtener más detalles sobre los parámetros del modelo de Gemini, consulta la documentación de Google AI for Developers [Acerca de los modelos generativos](https://ai.google.dev/gemini-api/docs/models/generative-models?hl=es&_gl=1*1fu959e*_up*MQ..*_ga*MTgyNTQxNDY0NC4xNzE0MDIxNDY3*_ga_P1DBVKWT6V*MTcxNDAyMTQ2Ny4xLjAuMTcxNDAyMTg1NC4wLjAuMA..).

## Acerca de la personalidad

Puedes elegir entre las siguientes tres personalidades en el elemento **Personalidad** de la pantalla de configuración. Cambiar la configuración cambiará la tendencia de la respuesta y el tono de la conversación.
* **default:** Personalidad predeterminada del chatbot.
* **kansai:** Personalidad de un hombre de Kansai.
* **rin:** Personalidad de una joven dama.

