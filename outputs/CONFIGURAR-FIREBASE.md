# Configurar el aula digital de Villa Esther

La página ya contiene práctica local sin conexión. Firebase se usa para cuentas, sincronización y grupos. Las solicitudes a Gemini salen por una Pages Function de Cloudflare.

## 1. Crear la app web

El proyecto `camp2-93288` y su app web ya están escritos en `.firebaserc` y `outputs/js/firebase-config.js`. En Firebase Console, abre **Authentication**, pulsa **Comenzar**, habilita **Sign-in method → correo y contraseña** y agrega el dominio donde publicarás la página en **Settings → Authorized domains**. Para probar localmente, sírvela desde `localhost`; abrirla como `file://` no es adecuado para el inicio de sesión. También crea la base en **Firestore Database**. La configuración web identifica el proyecto; nunca pongas allí la clave de Gemini.

## 2. Configurar Gemini en Cloudflare

La clave que apareció en una captura debe revocarse en Google AI Studio/Google Cloud. Genera una nueva y no la pegues en el HTML, en `firebase-config.js` ni en GitHub. En el proyecto de Cloudflare Pages, abre **Settings → Variables and Secrets → Add**, crea el secreto `GEMINI_API_KEY`, pega allí la nueva clave y guarda. Configúralo en Production y, si usarás previews, también en Preview. Debe estar creado antes de desplegar.

La ruta `functions/api/aula.js` lee el secreto desde Cloudflare y verifica que la solicitud incluya una sesión Firebase válida. El navegador nunca recibe la clave de Gemini. Para publicar los cambios con Wrangler desde la raíz del repositorio:

```powershell
npx wrangler pages deploy outputs --project-name decido-cuidarme
```

Si el repositorio está conectado con **Pages → Connect to Git**, basta con hacer `git push`; Cloudflare inicia el despliegue. No uses `npx wrangler deploy`, que es para Workers. Gemini tiene cuotas gratuitas sujetas a límites y cambios del proveedor; en el nivel gratuito Google puede usar las solicitudes para mejorar sus productos. No envíes información personal ni relatos identificables de estudiantes.

## 3. App Check y rol docente

En Firebase Console → **App Check**, registra los dominios reales de Firebase Hosting y Cloudflare Pages con reCAPTCHA Enterprise. Pon la clave de sitio en `recaptchaEnterpriseSiteKey` de `outputs/js/firebase-config.js`. App Check protege las funciones Firebase que gestionan grupos; la función de Gemini valida el token de inicio de sesión Firebase en Cloudflare. No uses tokens de depuración en producción.

Las cuentas nuevas son estudiantes. Nadie puede asignarse el rol docente desde la página. El administrador del proyecto debe asignar los claims `role: "teacher"` y `school: "villa-esther"` a las cuentas docentes. Con credenciales de administrador configuradas en la máquina autorizada, ejecuta:

```js
node firebase-functions/scripts/set-teacher-role.js UID_DEL_DOCENTE
```

El ejemplo conserva otros claims existentes. Luego el docente debe cerrar sesión y volver a entrar. No habilites escrituras abiertas en Firestore ni otorgues ese rol a todos.

## 4. Qué incluye

- Estudiantes: crear/iniciar sesión, vincularse con el código de su grupo y consultar las herramientas de estudio.
- Docentes habilitados: crear grupos, compartir códigos, revisar resultados agregados y publicar preguntas con explicación.
- Gemini: preguntas nuevas de práctica, propuestas de clase, tutoría y orientación vocacional a través de Cloudflare Pages Functions; el material generado debe revisarse.
- Sin conexión: el banco incorporado y el plan semanal siguen funcionando. Firestore guarda su caché y sincroniza cambios cuando vuelve internet; la primera descarga, el login y Gemini requieren conexión.
- PWA: el service worker se activa al alojar la página en HTTPS. Abrir el HTML con `file://` no permite instalar la PWA, pero no impide el reto local.

Antes de crear cuentas de menores o guardar su progreso, la institución debe definir aviso de privacidad, autorización aplicable, retención y responsables de los datos. No solicites relatos personales sobre violencia o consumo en el tutor.

## 5. Compatibilidad con Cloudflare Pages

`wrangler.jsonc` configura la carpeta estática `outputs`; `functions/api/aula.js` es el endpoint de Gemini. La carpeta `firebase-functions/` conserva las funciones de Firebase usadas por grupos y otras herramientas existentes. Firebase Hosting queda configurado como otra opción de publicación. La práctica local no depende de ninguno de los dos servicios.
