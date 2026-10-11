# Guía para leer y mantener el código

Esta guía sirve como mapa del repositorio. El sitio se publica como archivos estáticos y no requiere un paso de compilación. Las funciones de servidor viven aparte y Cloudflare Pages las detecta desde `functions/`.

## Recorrido de una solicitud

1. El navegador abre una página HTML de `outputs/`.
2. La página usa sus estilos y scripts locales. Las páginas de Villa Esther se agrupan en una carpeta propia.
3. Si una función necesita una API o una clave privada, el navegador llama a una Pages Function en `functions/api/`.
4. El service worker guarda recursos estáticos seleccionados para abrirlos sin conexión. Las llamadas a API, autenticación y servicios externos requieren conexión.

## Páginas y contenido

| Ruta                                                  | Responsabilidad                                                 |
| ----------------------------------------------------- | --------------------------------------------------------------- |
| `outputs/index.html`                                  | Página central: campañas, juegos y accesos a las instituciones. |
| `outputs/instituciones/institucion-vicente-diaz.html` | Espacio de Vicente Díaz y material para docentes y estudiantes. |
| `outputs/instituciones/villa-esther/`                 | Página principal y módulos educativos de Villa Esther.          |
| `outputs/instituciones/oferta-educativa-cordoba.html` | Catálogo estático de programas e instituciones de Córdoba.      |
| `outputs/juegos/`                                     | Actividades interactivas de las campañas y del portal escolar.  |
| `outputs/recursos/`                                   | Material informativo sobre las campañas de prevención.          |

Las páginas HTML contienen la estructura y el contenido. Los estilos y scripts están separados en archivos externos para que puedan encontrarse y editarse por separado.

### Páginas de Villa Esther

- `institucion-villa-esther.html`: portal y navegación de la institución.
- `villa-simulacro.html`: práctica Saber 11.
- `villa-ingles.html`: vocabulario, gramática, frases y traducción.
- `villa-habilidades-digitales.html`: entrada a los retos de tecnología.
- `villa-habilidad-*.html`: una guía independiente para programación, IA, seguridad, productividad, verificación de información y creación de guías digitales.
- `villa-proyecto-vida.html`, `villa-mundo-laboral.html` y `villa-explora-futuro.html`: metas, emprendimiento, orientación y opciones educativas.

### Juegos y recursos

Cada HTML en `outputs/juegos/` es una actividad independiente. Sus nombres describen la experiencia: Campus secreto, Detectives de la confianza, Escape del festival, Jeroglíficos del futuro, Lotería de apoyos, Mapa Seguro, memoramas, Mi ruta mi decisión, Misión salida segura, Parejas de apoyo, Puentes de apoyo, Rompecabezas, Ruta al futuro, Rutas de luz y Una red de apoyo.

En `outputs/recursos/`, `portal-prevencion.html` organiza los materiales y cada archivo `prevencion-*.html` desarrolla una campaña específica. La oferta educativa de Córdoba es un catálogo estático compartido, independiente de las páginas institucionales.

## JavaScript del sitio

- `outputs/js/pages/` contiene la lógica específica extraída de cada HTML. La estructura de carpetas refleja la ubicación de las páginas: `juegos/`, `recursos/` e `instituciones/`.
- `outputs/js/register-service-worker.js` registra el service worker compartido para habilitar la caché offline.

| Ruta                                                      | Qué hace                                                                                |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `outputs/js/pwa-install.js`                               | Controla el botón de instalación de la plataforma o de una institución.                 |
| `outputs/js/villa-esther/firebase-config.js`              | Configuración pública del cliente Firebase. No debe contener secretos de servidor.      |
| `outputs/js/villa-esther/villa-firebase.js`               | Registro y acceso, clases, progreso, preguntas publicadas y chat vocacional.            |
| `outputs/js/villa-esther/villa-gemini.js`                 | Conecta la interfaz de orientación con la función del servidor.                         |
| `outputs/js/villa-esther/habilidades-digitales.js`        | Retos y actividades locales de habilidades digitales.                                   |
| `outputs/js/villa-esther/villa-ingles-dictionary.js`      | Búsqueda de vocabulario y consulta de traducción.                                       |
| `outputs/js/villa-esther/villa-ingles-dictionary-data.js` | Datos locales de términos bilingües; es un conjunto de datos, no la lógica de búsqueda. |
| `outputs/js/villa-esther/villa-ingles-grammar.js`         | Lecciones, preguntas y seguimiento local de gramática.                                  |
| `outputs/js/villa-esther/villa-ingles-phrases.js`         | Búsqueda y presentación de frases en inglés.                                            |
| `outputs/js/villa-esther/youtube-library.js`              | Interfaz de búsqueda y reproducción de videos por módulo.                               |

## Estilos

- `outputs/css/pages/` contiene los estilos específicos de cada página, organizados con la misma estructura de carpetas que los HTML. Los sufijos `-02`, `-03` conservan el orden de bloques CSS que antes estaban separados en el documento.
- `outputs/css/` contiene estilos compartidos, campañas, adaptación móvil e instalación PWA.
- `outputs/css/villa-esther/` contiene la identidad visual, los módulos digitales, inglés y la biblioteca de videos de Villa Esther.
- `outputs/css/vicente-diaz/` contiene el estilo institucional de Vicente Díaz.

Los estilos y scripts nuevos deben guardarse como archivos externos. Evita agregar bloques `<style>`, scripts inline o atributos `style`/`onclick` a los HTML; usa `outputs/css/pages/` y `outputs/js/pages/` para lógica o presentación exclusiva de una página, y las carpetas compartidas cuando se reutilice en varias.

## APIs y funciones de servidor

| Archivo                      | Ruta HTTP            | Uso                                                                      |
| ---------------------------- | -------------------- | ------------------------------------------------------------------------ |
| `functions/api/aula.js`      | `POST /api/aula`     | Solicitudes educativas a Gemini con límites y validación en el servidor. |
| `functions/api/youtube.js`   | `GET /api/youtube`   | Búsqueda de videos educativos permitidos por la aplicación.              |
| `functions/api/phrases.js`   | `GET /api/phrases`   | Consulta de frases a Tatoeba.                                            |
| `functions/api/translate.js` | `GET /api/translate` | Traducción con MyMemory.                                                 |

Las claves `GEMINI_API_KEY` y `YOUTUBE_API_KEY` son secretos de Cloudflare. No se escriben en HTML ni en JavaScript que descarga el navegador. `.dev.vars.example` muestra los nombres de variables para el desarrollo local; `.dev.vars` contiene valores locales y no se sube a Git.

## Firebase

- `firebase.json` y `.firebaserc` describen el proyecto y el despliegue de Firebase.
- `firestore.rules` define qué lecturas y escrituras permite Firestore.
- `firebase-functions/index.js` contiene funciones de servidor de Firebase.
- `firebase-functions/scripts/set-teacher-role.js` es una utilidad administrativa para asignar el rol docente.
- `outputs/js/villa-esther/firebase-config.js` inicializa el SDK del navegador. Las reglas y la autenticación siguen siendo la barrera de acceso; ocultar controles en la página no los reemplaza.

## Instalación y uso sin conexión

- `outputs/manifest.webmanifest` define la instalación de la plataforma general.
- `outputs/manifest-villa-esther.webmanifest` y `outputs/manifest-vicente-diaz.webmanifest` definen identidades independientes para cada institución.
- `outputs/service-worker.js` precarga las páginas y recursos locales indicados en `CORE`, guarda recursos opcionales y responde con caché cuando falla la conexión.
- Los iconos PWA están en `outputs/icon-*.png` y `outputs/assets/<institución>/`.

Cuando se añade un archivo local que debe funcionar sin conexión, hay que incluir su ruta en `CORE` y subir el número de versión de caché. El contenido de Gemini, YouTube, traducción, autenticación y Firestore sigue necesitando internet.

## Configuración y revisión

- `wrangler.jsonc` indica que Cloudflare Pages publica `outputs/`.
- `firebase.json` configura Firebase.
- `scripts/check-links.mjs` revisa enlaces y rutas locales del sitio.
- `.github/workflows/validate-site.yml` ejecuta esa revisión en GitHub Actions.
- `docs/arquitectura.md`, `docs/despliegue.md` y `docs/fuentes-y-uso-responsable.md` amplían el diseño, publicación y procedencia del contenido.

## Convenciones de edición

- Usar dos espacios de sangría y una línea por elemento o instrucción lógica.
- Mantener nombres descriptivos y separar el trabajo de interfaz, estilos y llamadas de red.
- Comentar el propósito, las decisiones y las limitaciones; evitar comentarios que repitan literalmente el código.
- No guardar claves privadas en archivos de `outputs/`.
- Al añadir páginas o recursos importantes, actualizar el service worker, esta guía y el README cuando corresponda.

El formato común está definido en `.prettierrc.json`. Para volver a formatear los archivos compatibles con Prettier se puede ejecutar:

```powershell
npx prettier --write "**/*.{html,css,js,mjs,json,jsonc,md,webmanifest,yml,yaml}"
```
