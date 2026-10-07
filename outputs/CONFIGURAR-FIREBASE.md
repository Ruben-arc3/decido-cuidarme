# Configurar el aula digital de Villa Esther

La página ya contiene práctica local sin conexión. Cuentas, sincronización, grupos y Gemini se activan cuando se configura y publica el backend Firebase.

## 1. Crear la app web

El proyecto `camp2-93288` y su app web ya están escritos en `.firebaserc` y `outputs/js/firebase-config.js`. En Firebase Console, abre **Authentication**, pulsa **Comenzar**, habilita **Sign-in method → correo y contraseña** y agrega el dominio donde publicarás la página en **Settings → Authorized domains**. Para probar localmente, sírvela desde `localhost`; abrirla como `file://` no es adecuado para el inicio de sesión. También crea la base en **Firestore Database**. La configuración web identifica el proyecto; nunca pongas allí la clave de Gemini.

## 2. Proteger la API Gemini

La captura adjunta muestra una clave Gemini. Revócala en Google AI Studio/Google Cloud y genera otra. No la pegues en este HTML ni en `firebase-config.js`. Desde una terminal en la raíz del proyecto, instala Firebase CLI si hace falta y ejecuta:

```sh
npm install --prefix firebase-functions
firebase login
firebase functions:secrets:set GEMINI_API_KEY
```

Pega la clave nueva solo en el prompt privado de la terminal. Despliega con:

```sh
firebase deploy --only firestore:rules,functions,hosting
```

Cloud Functions exige vincular una cuenta de facturación (plan Blaze). Gemini también puede tener cargos según modelo, volumen y cuotas. Define alertas de presupuesto y límites de cuota; las alertas no son un tope automático de gasto.

## 3. App Check y rol docente

En Firebase Console → **App Check**, registra los dominios reales de Firebase Hosting y Cloudflare Pages con reCAPTCHA Enterprise. Pon la clave de sitio en `recaptchaEnterpriseSiteKey` de `outputs/js/firebase-config.js`. La función callable exige App Check. No uses tokens de depuración en producción.

Las cuentas nuevas son estudiantes. Nadie puede asignarse el rol docente desde la página. El administrador del proyecto debe asignar los claims `role: "teacher"` y `school: "villa-esther"` a las cuentas docentes. Con credenciales de administrador configuradas en la máquina autorizada, ejecuta:

```js
node firebase-functions/scripts/set-teacher-role.js UID_DEL_DOCENTE
```

El ejemplo conserva otros claims existentes. Luego el docente debe cerrar sesión y volver a entrar. No habilites escrituras abiertas en Firestore ni otorgues ese rol a todos.

## 4. Qué incluye

- Estudiantes: crear/iniciar sesión, vincularse con el código de su grupo y consultar las herramientas de estudio.
- Docentes habilitados: crear grupos, compartir códigos, revisar resultados agregados y publicar preguntas con explicación.
- Gemini: preguntas nuevas de práctica, propuestas de clase y tutoría; el reto advierte que el material generado debe revisarse.
- Sin conexión: el banco incorporado y el plan semanal siguen funcionando. Firestore guarda su caché y sincroniza cambios cuando vuelve internet; la primera descarga, el login y Gemini requieren conexión.
- PWA: el service worker se activa al alojar la página en HTTPS. Abrir el HTML con `file://` no permite instalar la PWA, pero no impide el reto local.

Antes de crear cuentas de menores o guardar su progreso, la institución debe definir aviso de privacidad, autorización aplicable, retención y responsables de los datos. No solicites relatos personales sobre violencia o consumo en el tutor.

## 5. Compatibilidad con Cloudflare Pages

`wrangler.jsonc` y la carpeta `functions/` se conservan para publicar los archivos estáticos y la función antigua de Cloudflare Pages. El backend Firebase usa `firebase-functions/` para no interferir con las rutas de Pages. El mismo frontend puede llamar a Firebase Functions desde el dominio de Pages si ese dominio también se registra en App Check. Firebase Hosting queda configurado como otra opción de publicación. La práctica local no depende de ninguno de los dos servicios.
