# Contribuir

Las mejoras deben mantener una experiencia clara en proyector, computador y móvil, y respetar el enfoque preventivo y educativo del sitio.

## Antes de cambiar

1. Identifica la página y la carpeta de recursos relacionada.
2. Revisa enlaces entrantes, assets y rutas del service worker si mueves archivos.
3. Para contenidos de salud, prevención o protección, registra la fuente en `docs/fuentes-y-uso-responsable.md` o en la página correspondiente.
4. No incluyas información identificable de estudiantes ni secretos de proveedor.

## Ramas y commits

Usa ramas breves y específicas:

```text
feature/filtro-oferta-educativa
fix/ruta-diccionario-ingles
docs/guia-de-despliegue
```

Prefiere commits pequeños que expliquen la acción:

```text
Agregar banner institucional de Vicente Díaz
Corregir enlaces del módulo de inglés
Documentar despliegue de Pages Functions
```

## Pull Request

Abre un Pull Request hacia `main`. Incluye objetivo, páginas afectadas, pasos para revisar y capturas si cambia el diseño. Indica si tocaste APIs, permisos, reglas de Firestore, contenidos sensibles o rutas de despliegue. La validación automática comprueba rutas locales; la revisión visual y funcional sigue siendo necesaria.

Para proteger el historial del proyecto, configura GitHub para exigir que la validación **Revisar rutas locales** pase antes de fusionar cambios a `main`.

## Revisión manual recomendada

- Revisa la página en escritorio y móvil.
- Comprueba la navegación por teclado y los textos alternativos de imágenes.
- Verifica los enlaces de páginas y recursos movidos.
- Comprueba el modo local y la conexión a APIs cuando el cambio los afecte.
- No publiques secretos en el Pull Request o en capturas.
