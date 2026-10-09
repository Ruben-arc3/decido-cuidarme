const GRAMMAR_KNOWLEDGE = [
  { id: "word-order", title: "Orden básico de la oración", terms: "oracion sujeto verbo objeto orden afirmativa estructura", text: "En una oración afirmativa básica en inglés se usa Subject + Verb + Object/Complement (sujeto + verbo + objeto/complemento): She studies biology. El sujeto suele aparecer antes del verbo. En español el orden puede variar más, pero en inglés conviene mantenerlo." },
  { id: "be", title: "Verbo be: am, is, are", terms: "be ser estar am is are afirmacion pregunta negacion", text: "El verbo be significa ser o estar. Se conjuga I am; you/we/they are; he/she/it is. Negación: añade not (She is not tired). Pregunta: invierte be y sujeto (Are they ready?). No se usa do/does con be." },
  { id: "present-simple", title: "Presente simple", terms: "present simple presente rutina habito hechos do does tercera persona s", text: "El presente simple expresa rutinas, hábitos y hechos generales: I study every day. Con he/she/it, normalmente se añade -s al verbo: She studies. Para preguntas y negaciones se usa do con I/you/we/they y does con he/she/it; tras does, el verbo queda en forma base: Does she study? She doesn't study." },
  { id: "present-continuous", title: "Presente continuo", terms: "present continuous presente continuo ahora accion am is are ing", text: "El presente continuo describe algo que ocurre ahora o temporalmente. Estructura: sujeto + am/is/are + verbo terminado en -ing: They are working now. Negación: She isn't studying. Pregunta: Are you listening? No omitas am/is/are." },
  { id: "past-simple", title: "Pasado simple", terms: "past simple pasado regular irregular did preguntas negacion", text: "El pasado simple habla de acciones terminadas en el pasado. Los verbos regulares suelen terminar en -ed (worked); los irregulares cambian (go → went). En preguntas y negaciones se usa did/didn't + verbo base: Did you go? I didn't go. En afirmativa se conserva went." },
  { id: "future-going-to", title: "Planes con going to", terms: "future futuro going to planes intencion am is are", text: "Going to expresa planes o intenciones y predicciones con evidencia. Estructura: sujeto + am/is/are + going to + verbo base: We are going to apply. Para preguntar: Are they going to study? No se omite el verbo be." },
  { id: "future-will", title: "Futuro con will", terms: "future futuro will decision promesa prediccion", text: "Will + verbo base se usa, entre otros casos, para decisiones tomadas en el momento, promesas y predicciones: I will help you. La misma forma va con todos los sujetos. Negación: will not/won't. Pregunta: Will you come? Going to suele encajar mejor con planes ya decididos." },
  { id: "articles", title: "Artículos a, an y the", terms: "articles articulos a an the sustantivo vocal consonante", text: "A y an presentan un sustantivo contable singular no específico. Se elige por el sonido inicial: a university (sonido /y/), an hour (sonido vocal). The se usa cuando el referente es específico o conocido: The book on the table. No se usa a/an con plurales o incontables." },
  { id: "prepositions", title: "Preposiciones de tiempo", terms: "prepositions preposiciones in on at tiempo hora dia mes año", text: "Como guía inicial para tiempo: at con horas (at 7:00), on con días y fechas (on Monday, on May 5), in con meses, años y periodos amplios (in July, in 2026, in the morning). Hay expresiones fijas y excepciones; aprende la regla junto con ejemplos." },
  { id: "modals", title: "Modales: can, should, must", terms: "modals modales can should must consejo habilidad obligacion", text: "Los modales van antes de un verbo en forma base y no cambian con he/she/it: She can swim. Can expresa capacidad o posibilidad; should da consejo; must expresa obligación fuerte. Negación: cannot/can't, shouldn't, mustn't. Después del modal no se añade to ni -s." },
  { id: "comparatives", title: "Comparativos", terms: "comparatives comparativos adjetivos er more than", text: "Los comparativos comparan dos elementos y suelen llevar than. Muchos adjetivos cortos añaden -er (small → smaller); muchos largos usan more (more interesting). Hay formas irregulares: good → better. Ejemplo: This route is safer than that one." },
  { id: "connectors", title: "Conectores: because, but, so", terms: "connectors conectores because but so causa contraste resultado", text: "Because presenta una causa: I stayed home because it rained. But expresa contraste: I was tired, but I finished. So presenta una consecuencia: It rained, so we stayed home. Úsalos para conectar ideas completas y mostrar la relación entre ellas." }
];

const STOP_WORDS = new Set("a al algo aprender con como cual cuando de del el en es esta fue gramática grammar hago hay la las lo los me mi más no para pero por que se sobre sin su the to un una y yo uso usar".split(" "));

function words(value) {
  return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").match(/[a-z0-9]+/g) || [];
}

export function retrieveGrammarContext(question, limit = 4, extraKnowledge = []) {
  const knowledge = [...GRAMMAR_KNOWLEDGE, ...extraKnowledge];
  const query = new Set(words(question).filter(word => word.length > 2 && !STOP_WORDS.has(word)));
  const ranked = knowledge.map(item => {
    const searchable = new Set(words(`${item.title} ${item.terms} ${item.text}`));
    let score = 0;
    for (const word of query) if (searchable.has(word)) score += 1 + (words(item.title).includes(word) ? 1 : 0);
    return { item, score };
  }).sort((a, b) => b.score - a.score);
  const matches = ranked.filter(result => result.score > 0).slice(0, limit);
  if (!matches.length) return { chunks: [GRAMMAR_KNOWLEDGE[0]], matched: false };
  return { chunks: matches.map(result => result.item), matched: true };
}
