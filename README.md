# Decido Cuidarme

**Decido Cuidarme** es una plataforma educativa que acompaña las campañas de prevención realizadas por la **Alcaldía de Puerto Escondido, Córdoba**, con recursos para estudiantes, docentes y comunidades escolares.

La plataforma combina información, actividades participativas y juegos que pueden desarrollarse en el aula o proyectarse para jugar en grupo. Sus contenidos promueven el cuidado, la toma de decisiones informadas y la búsqueda de redes de apoyo.

**Sitio público:** [decido-cuidarme.pages.dev](https://decido-cuidarme.pages.dev/)

## Contenidos

- **Prevención del consumo de sustancias psicoactivas:** recursos informativos y actividades para conversar sobre decisiones, presión de grupo y apoyo entre pares.
- **Prevención de la violencia intrafamiliar:** materiales para reconocer señales, escuchar y buscar acompañamiento seguro.
- **Prevención del abuso sexual:** contenidos sobre límites, consentimiento, seguridad digital y redes de apoyo.
- **Prevención de siniestros viales:** recursos y actividades sobre movilidad segura y cuidado de peatones, ciclistas y pasajeros.
- **Juegos educativos:** memoramas, rompecabezas, retos arcade, historias interactivas y actividades colaborativas para el aula.
- **Espacios institucionales:** recursos para la Institución Educativa Vicente Díaz y la Institución Educativa Villa Esther. Este último integra herramientas de orientación, proyecto de vida, preparación Saber 11 y exploración educativa y laboral.
- **Recursos para docentes:** materiales de aula, orientación para actividades y una presentación guiada de la plataforma.

Las actividades usan situaciones ficticias y no requieren que los participantes compartan experiencias personales. El material tiene propósito educativo y no sustituye la orientación profesional ni los protocolos institucionales.

## Tecnologías

- Sitio estático desarrollado con HTML, CSS y JavaScript.
- Cloudflare Pages para publicación y Pages Functions para servicios de servidor.
- Firebase Authentication y Cloud Firestore para funciones de aula, cuentas y datos asociados.
- Service worker y manifiestos PWA para instalación y acceso a recursos estáticos seleccionados sin conexión.
- Integraciones de servidor con Gemini y YouTube, además de servicios públicos de frases, traducción e información multimedia.

La configuración del cliente Firebase no equivale a credenciales privadas. Las reglas de Firestore y la validación del servidor son parte del control de acceso. Las claves de servicios externos deben guardarse como secretos en Cloudflare, nunca en el código que se entrega al navegador.

## Estructura del repositorio

```text
functions/                 Pages Functions y endpoints de servidor
firebase-functions/        Funciones y utilidades administrativas de Firebase
outputs/                   Sitio estático publicado
  index.html               Página central
  instituciones/           Espacios institucionales
  juegos/                  Juegos y actividades interactivas
  recursos/                Campañas y materiales informativos
  css/                     Hojas de estilo
  js/                      Lógica del sitio
  service-worker.js        Caché de recursos estáticos
docs/                      Arquitectura, despliegue y guía del código
scripts/                   Herramientas de revisión del repositorio
firestore.rules            Reglas de Firestore
wrangler.jsonc             Configuración de Cloudflare Pages
```

## Uso local

Se requiere Python 3 para servir las páginas estáticas:

```powershell
py -m http.server 8080 --directory outputs
```

Abre `http://localhost:8080`. Esta opción sirve páginas y juegos estáticos, pero no ejecuta Pages Functions.

Para probar localmente Pages Functions, usa Wrangler:

```powershell
npx wrangler pages dev outputs
```

Las funciones que dependen de servicios externos requieren variables locales en `.dev.vars`. Consulta `.dev.vars.example` y `docs/despliegue.md`; el archivo con valores reales está excluido de Git.

## Publicación

Cloudflare Pages publica el directorio `outputs/`. Con el repositorio conectado a GitHub, los cambios enviados a `main` generan una publicación automática. La configuración se encuentra en `wrangler.jsonc` y las instrucciones completas, incluidas las variables de entorno y Firebase, están en [docs/despliegue.md](docs/despliegue.md).

También se puede publicar manualmente desde la raíz del repositorio:

```powershell
npx wrangler pages deploy outputs --project-name decido-cuidarme
```

## Seguridad y uso responsable

- No subas claves privadas, credenciales de servicio, tokens ni archivos `.dev.vars` al repositorio.
- Configura las claves de Gemini y YouTube como secretos de Cloudflare.
- Revisa `firestore.rules` antes de cambiar permisos y valida la autenticación en funciones que manejan datos de aula.
- Evita registrar información personal o relatos identificables de estudiantes.
- El contenido generado automáticamente requiere revisión docente.
- Verifica que las rutas y contactos locales de apoyo estén actualizados antes de utilizarlos en una actividad.

## Documentación

- [Arquitectura](docs/arquitectura.md)
- [Desarrollo y despliegue](docs/despliegue.md)
- [Guía para leer el código](docs/guia-del-codigo.md)
- [Fuentes y uso responsable](docs/fuentes-y-uso-responsable.md)
- [Contribución al proyecto](CONTRIBUTING.md)
