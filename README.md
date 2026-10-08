# Decido Cuidarme

Plataforma educativa para apoyar campañas escolares de prevención y ofrecer recursos de orientación, motivación y preparación académica. Está pensada para usarse en clase, proyectarse en grupo y consultarse desde el navegador.

## ¿Qué incluye?

- **Tres campañas de prevención:** consumo de sustancias psicoactivas, violencia intrafamiliar y abuso sexual.
- **Juegos educativos:** memoramas, rompecabezas, aventuras, retos arcade, detectives, lotería y actividades colaborativas.
- **Espacios por institución:** páginas para la Institución Educativa Vicente Díaz y la Institución Educativa Villa Esther.
- **Enfoque de Villa Esther:** proyecto de vida, motivación, práctica tipo Saber 11 y exploración de opciones de educación superior.
- **Aula digital:** herramientas para estudiantes y docentes, grupos y seguimiento de resultados, sujeto a la configuración de Firebase.
- **Orientación con Gemini:** tutoría, orientación vocacional y generación de materiales educativos a través de una función del servidor.
- **Uso local:** los juegos y recursos estáticos pueden abrirse desde un servidor local sin conexión a internet. El inicio de sesión, la sincronización y Gemini sí requieren conexión.

## Tecnologías

- HTML, CSS y JavaScript
- Cloudflare Pages y Pages Functions
- Firebase Authentication, Firestore y Firebase Functions
- Gemini API
- Service worker y manifiesto para instalación como PWA en un dominio HTTPS compatible

## Estructura

```text
functions/                  Funciones de Cloudflare Pages; incluye /api/aula
firebase-functions/         Funciones de Firebase
outputs/
  index.html                Portal central
  instituciones/            Páginas institucionales y recursos de Villa Esther
  juegos/                   Juegos educativos
  js/                       Configuración y lógica del aula digital
  recursos/                 Materiales de prevención
  service-worker.js         Caché de recursos para la PWA
  manifest.webmanifest      Datos de instalación de la PWA
firestore.rules             Reglas de seguridad de Firestore
firebase.json               Configuración de Firebase Hosting y Functions
wrangler.jsonc              Configuración de Cloudflare Pages
```

## Ejecutar localmente

Desde la raíz del repositorio, inicia un servidor estático con Python:

```powershell
py -m http.server 8080 --directory outputs
```

Abre [http://localhost:8080](http://localhost:8080). Los juegos estáticos se pueden probar localmente y no requieren una cuenta. Para que el inicio de sesión funcione en local, agrega `localhost` a los dominios autorizados en Firebase Authentication.

La ejecución estática local no activa las Pages Functions. El asistente Gemini, la sincronización y otras funciones conectadas necesitan sus servicios correspondientes y configuración válida.

## Publicar en Cloudflare Pages

1. Conecta este repositorio con un proyecto de **Cloudflare Pages**.
2. Usa la raíz del repositorio como directorio del proyecto.
3. Selecciona la configuración estática, sin comando de compilación, y define `outputs` como directorio de salida. `wrangler.jsonc` también declara esta carpeta.
4. En **Settings → Variables and Secrets**, agrega `GEMINI_API_KEY` como secreto en Production. Configúralo también en Preview si vas a probar despliegues de vista previa.
5. Autoriza el dominio `decido-cuidarme.pages.dev` —y el dominio propio, si aplica— en Firebase Authentication.
6. Envía cambios a `main` para iniciar el despliegue automático, si el proyecto está conectado a Git.

También puedes publicar manualmente con Wrangler desde la raíz:

```powershell
npx wrangler pages deploy outputs --project-name decido-cuidarme
```

No uses `npx wrangler deploy` para este proyecto de Pages.

## Configuración de Firebase

La configuración detallada de Authentication, Firestore, App Check y roles docentes está en [`outputs/CONFIGURAR-FIREBASE.md`](outputs/CONFIGURAR-FIREBASE.md).

Antes de probar el aula digital:

- habilita el proveedor de correo y contraseña en Firebase Authentication;
- crea Firestore y publica las reglas de [`firestore.rules`](firestore.rules);
- agrega a Firebase los dominios desde los que se abrirá la plataforma;
- configura App Check y los permisos docentes siguiendo la guía del proyecto.

## Uso responsable

El contenido es educativo y no reemplaza la atención de profesionales. En las actividades no se deben solicitar relatos personales ni datos que permitan identificar a estudiantes. Gemini puede tener límites de uso y sus respuestas deben ser revisadas por un docente antes de usarse como material de clase. Mantén `GEMINI_API_KEY` como secreto de Cloudflare: no la incluyas en HTML, JavaScript del navegador ni en el repositorio.
