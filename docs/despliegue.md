# Desarrollo y despliegue

## Desarrollo estático

Requiere Python 3:

```powershell
py -m http.server 8080 --directory outputs
```

Abre <http://localhost:8080>. Esta modalidad sirve juegos y páginas estáticas. No ejecuta `functions/`.

## Pages Functions en local

Instala Wrangler o ejecútalo temporalmente con `npx`:

```powershell
npx wrangler pages dev outputs
```

Para usar Gemini localmente, crea `.dev.vars` en la raíz del repositorio:

```dotenv
GEMINI_API_KEY=pega_aqui_una_clave_de_desarrollo
```

`.dev.vars` está ignorado por Git. No pegues claves reales en ejemplos, issues, capturas ni commits. El endpoint también valida sesiones Firebase; configura Authentication para el dominio de prueba si vas a probar esa parte.

## Cloudflare Pages conectado a GitHub

1. Conecta `Ruben-arc3/decido-cuidarme` como proyecto Pages.
2. Usa la raíz del repositorio como raíz del proyecto.
3. Deja vacío el comando de compilación y configura `outputs` como directorio de salida. `wrangler.jsonc` ya declara ese directorio.
4. En Variables and Secrets, agrega `GEMINI_API_KEY` como secreto para Production. Crea otro valor en Preview si vas a usar esos despliegues.
5. Confirma que `functions/` se detecta durante el despliegue.
6. Haz push a `main`; Cloudflare desplegará automáticamente si la integración Git está activa.

Despliegue manual desde la raíz:

```powershell
npx wrangler pages deploy outputs --project-name decido-cuidarme
```

Usa `wrangler pages deploy` para Pages; `wrangler deploy` publica Workers.

## Firebase

Consulta [CONFIGURAR-FIREBASE.md](../outputs/CONFIGURAR-FIREBASE.md). Revisa especialmente:

- dominios autorizados de Firebase Authentication;
- reglas de Firestore y rol docente;
- App Check para funciones Firebase;
- privacidad y retención antes de guardar datos de estudiantes.

## Flujo GitHub sugerido

1. Crea una rama `feature/nombre-corto` o `fix/nombre-corto` desde `main`.
2. Haz cambios pequeños y commits con mensajes claros.
3. Abre un Pull Request y describe páginas, comportamiento y cómo revisarlo.
4. Espera la validación automática de enlaces y revisa el preview de Cloudflare.
5. Fusiona a `main` cuando la revisión esté completa.
