# Fuentes y uso responsable

## APIs y materiales

- **Gemini API:** propone materiales educativos y respuestas de orientación mediante `POST /api/aula`. La respuesta es generada automáticamente; un docente debe revisarla antes de usarla en clase.
- **Tatoeba:** aporta ejemplos de frases y traducciones cuando hay resultados disponibles. Las frases enlazan a su ficha de origen.
- **MyMemory:** ofrece traducción automática español–inglés e inglés–español. La calidad depende del contexto; no se presenta como traducción certificada.
- **Wikimedia:** algunos módulos digitales consultan Wikipedia en español para lecturas complementarias. Se deben contrastar sus referencias originales.
- **Recursos educativos enlazados:** cada módulo puede incluir fuentes institucionales como MDN, UNESCO, W3C, FTC o universidades. Consulta el enlace de cada actividad para conocer su autor y vigencia.

## Diccionario de inglés

El archivo `outputs/js/villa-esther/villa-ingles-dictionary-data.js` contiene vocabulario del *Diccionario de Términos de Salud: Español–Inglés*, 4.ª edición (2012), de la Iniciativa de Salud de las Américas, UC Berkeley y entidades colaboradoras de California. La página del módulo conserva la cita bibliográfica. El dataset incluye términos complementarios elaborados para la plataforma.

Al ampliar o actualizar el dataset, conserva la atribución y revisa los términos, las licencias y las condiciones de redistribución de la fuente original. No añadas archivos completos de terceros sin comprobar sus permisos.

## Contexto educativo

Las campañas son material preventivo y de conversación guiada; no sustituyen atención psicológica, médica, jurídica ni protocolos de protección escolar. No solicites testimonios personales ni registres detalles que identifiquen a estudiantes. Si una actividad genera una revelación de riesgo, corresponde activar los canales institucionales establecidos.

## Privacidad técnica

- No pongas claves de API en archivos publicados en `outputs/`.
- No subas credenciales de Firebase Admin ni datos reales de estudiantes.
- Conserva las reglas de Firestore restrictivas y asigna roles docentes desde un canal administrativo.
- Revisa cuotas, condiciones y políticas de tratamiento de datos de cada proveedor antes de ampliar su uso.
