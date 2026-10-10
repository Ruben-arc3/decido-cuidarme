# Decido Cuidarme

[![Validación del sitio](https://github.com/Ruben-arc3/decido-cuidarme/actions/workflows/validate-site.yml/badge.svg?branch=main)](https://github.com/Ruben-arc3/decido-cuidarme/actions/workflows/validate-site.yml)

Plataforma educativa para campañas escolares de prevención y orientación. Reúne juegos para usar en grupo, recursos para estudiantes y herramientas de apoyo académico para las instituciones educativas Vicente Díaz y Villa Esther.

**Demo:** [decido-cuidarme.pages.dev](https://decido-cuidarme.pages.dev)

## Qué ofrece

- Campañas de prevención sobre consumo de sustancias psicoactivas, violencia intrafamiliar y abuso sexual.
- Juegos educativos que se pueden proyectar y jugar en grupo desde un solo computador.
- Espacios institucionales para Vicente Díaz y Villa Esther. Villa Esther incluye proyecto de vida, preparación Saber 11 y exploración de opciones educativas y laborales.
- Recursos de aula y herramientas docentes con acceso a Firebase cuando está configurado.
- Inglés con vocabulario local, consulta de frases y traducción español–inglés.
- Una parte de los juegos y materiales estáticos disponible sin conexión; las APIs, el inicio de sesión y la sincronización requieren internet.

## Tecnologías

HTML, CSS y JavaScript; Cloudflare Pages y Pages Functions; Firebase Authentication y Firestore; Google Gemini API; APIs públicas de Tatoeba, MyMemory y Wikimedia; service worker para caché local.

## Arquitectura y carpetas

```text
├── functions/api/              Endpoints de Pages: aula, frases y traducción
├── firebase-functions/         Función callable de Firebase y utilidades administrativas
├── outputs/                    Sitio estático publicado por Cloudflare Pages
│   ├── index.html              Portal principal
│   ├── instituciones/
│   │   ├── institucion-vicente-diaz.html
│   │   └── villa-esther/        Páginas de Villa Esther
│   ├── juegos/                  Juegos educativos
│   ├── recursos/                Portal de prevención
│   ├── assets/                  Escudos e iconos institucionales
│   ├── css/                     Estilos por institución
│   ├── js/villa-esther/         Scripts de Villa Esther
│   ├── service-worker.js        Caché de recursos para uso sin conexión
│   └── manifest.webmanifest     Datos de instalación como aplicación
├── docs/                        Arquitectura, despliegue y fuentes
├── scripts/check-links.mjs      Validador de rutas locales
├── firestore.rules             Reglas de acceso a Firestore
├── wrangler.jsonc              Carpeta de salida: outputs
└── firebase.json               Configuración de Firebase
```

La oferta educativa de Córdoba se conserva en `outputs/instituciones/` porque es un recurso compartido. Los enlaces antiguos a páginas de Villa Esther redirigen a la nueva carpeta.

Más detalle: [arquitectura](docs/arquitectura.md), [despliegue](docs/despliegue.md), [fuentes y uso responsable](docs/fuentes-y-uso-responsable.md), [contribuir](CONTRIBUTING.md).

## Ejecutar en local

Para navegar las páginas estáticas:

```powershell
py -m http.server 8080 --directory outputs
```

Abre <http://localhost:8080>. Esto sirve el contenido estático; no ejecuta las Pages Functions.

Para ejecutar Pages Functions en local con Wrangler:

```powershell
npx wrangler pages dev outputs
```

Si necesitas Gemini localmente, crea `.dev.vars` en la raíz con `GEMINI_API_KEY=tu_clave`. El archivo está excluido de Git. Firebase Authentication requiere `localhost` en los dominios autorizados de Firebase. Las APIs externas necesitan conexión.

## Despliegue

Cloudflare Pages usa `outputs` como directorio de publicación y detecta `functions/` automáticamente. Conecta el repositorio en Pages, deja vacío el comando de compilación y configura el secreto `GEMINI_API_KEY` en Production (y en Preview si lo utilizas). Al enviar cambios a `main`, Pages publica automáticamente si Git está conectado.

El despliegue manual desde la raíz es:

```powershell
npx wrangler pages deploy outputs --project-name decido-cuidarme
```

Consulta los pasos de Firebase y Cloudflare en [docs/despliegue.md](docs/despliegue.md) y [outputs/CONFIGURAR-FIREBASE.md](outputs/CONFIGURAR-FIREBASE.md).

## Seguridad y privacidad

- No guardes claves de API, credenciales de servicio ni archivos `.dev.vars` en Git.
- La función de Gemini recibe la clave desde Cloudflare; no debe exponerse en HTML ni JavaScript del navegador.
- Firebase protege los datos con Authentication y reglas de Firestore. Revisa esas reglas antes de ampliar permisos.
- No ingreses datos personales ni relatos identificables de estudiantes en los asistentes. El contenido generado por IA requiere revisión docente.
- Las actividades son educativas; no reemplazan atención profesional ni protocolos institucionales.

## Aportar cambios

Usa una rama por mejora y abre un Pull Request hacia `main`. GitHub Actions revisa los enlaces locales del sitio automáticamente. Guía: [CONTRIBUTING.md](CONTRIBUTING.md).
