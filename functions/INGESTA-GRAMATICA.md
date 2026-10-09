# Ingesta de PDF para el tutor de gramática

La página `outputs/instituciones/villa-ingles-ingesta.html` permite que un docente seleccione un PDF. PDF.js extrae su texto en el navegador; la Function de Pages separa el contenido en fragmentos con página de origen y los guarda en un bucket R2 privado. Al responder, `/api/grammar-tutor` busca fragmentos relevantes y los envía junto con la pregunta a Groq. El PDF original no se guarda.

## Configuración en Cloudflare Pages

1. En **Workers & Pages**, abre el proyecto Pages conectado al repositorio.
2. Ve a **Settings → Bindings → Add → R2 bucket**. Crea un bucket privado si todavía no tienes uno.
3. Asigna a la variable de binding el nombre exacto `GRAMMAR_KB` y selecciona el bucket. Guarda los cambios.
4. En **Settings → Variables and secrets**, crea el secreto `GRAMMAR_INGEST_KEY` para **Production**. Genera una clave aleatoria y compártela solo con los docentes que administren los PDF.
5. Conserva el secreto `GROQ_API_KEY` que ya usa el tutor.
6. Vuelve a desplegar el proyecto para que Pages aplique el binding y los secretos.
7. Abre `/instituciones/villa-ingles-ingesta.html`, escribe la clave de gestión, asigna un nombre y selecciona el PDF.

La misma clave de gestión permite listar y eliminar fuentes. El tutor muestra el nombre del documento y la página de los fragmentos usados. El acceso a la carga depende de la clave; la página no guarda esa clave en el navegador.

## Límites y funcionamiento

- Hasta 20 MB por archivo, 500 páginas, 750 KB de texto extraído y 500 fragmentos por PDF.
- Hasta 10 PDF en la biblioteca.
- Se aceptan PDF con texto seleccionable. Los documentos escaneados requieren OCR previo.
- La recuperación actual ordena fragmentos mediante coincidencia de términos. Groq genera la explicación con esos fragmentos como contexto.
- La carga y las respuestas requieren internet. Los ejercicios estáticos de gramática siguen funcionando sin conexión.
