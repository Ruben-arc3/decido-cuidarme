import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";
import { initializeFirestore, getFirestore, persistentLocalCache, persistentMultipleTabManager, doc, setDoc, addDoc, collection, query, where, getDocs, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-functions.js";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app-check.js";
import { firebaseConfig, recaptchaEnterpriseSiteKey } from "./firebase-config.js";

const $ = id => document.getElementById(id);
const ready = firebaseConfig.apiKey !== "REEMPLAZAR_API_KEY_FIREBASE" && firebaseConfig.projectId !== "REEMPLAZAR_PROJECT_ID";
let auth, db, functions, currentUser = null, activeClassId = localStorage.getItem("villaClassId") || "";
const status = (text, error = false) => { const el = $("firebaseStatus"); if (el) { el.textContent = text; el.style.color = error ? "#a34232" : ""; } };
function readableAuthError(error) {
  const messages = {
    "auth/configuration-not-found": "El proyecto aún no tiene Firebase Authentication configurado. En Firebase Console, abre Authentication, pulsa Comenzar y habilita Correo/contraseña.",
    "auth/operation-not-allowed": "El registro por correo está desactivado. En Firebase Console → Authentication → Sign-in method, activa Correo/contraseña.",
    "auth/unauthorized-domain": "Este dominio no está autorizado para iniciar sesión. En Authentication → Settings → Authorized domains, agrega el dominio donde publicaste la página; para probar localmente, usa localhost.",
    "auth/api-key-not-valid": "La clave web de Firebase no es válida para este proyecto. Revisa la configuración de la aplicación web."
  };
  return messages[error?.code] || error?.message || "No se pudo completar la autenticación.";
}
function readableFunctionError(error) {
  const code = error?.code || "";
  if (code === "functions/unauthenticated") return "Inicia sesión y comprueba que App Check esté configurado para este dominio.";
  if (code === "functions/failed-precondition") return "Falta configurar App Check o la clave de sitio de reCAPTCHA Enterprise.";
  if (code === "functions/not-found") return "La función createLearningMaterial todavía no está desplegada en Firebase.";
  if (code === "functions/permission-denied") return "Esta acción requiere una cuenta docente autorizada.";
  if (code === "functions/resource-exhausted") return "Esta cuenta alcanzó el límite diario de consultas Gemini.";
  if (code === "functions/internal") return "La función de Firebase falló. Revisa que esté desplegada y que tenga configurado el secreto GEMINI_API_KEY.";
  if (code === "functions/unavailable" || code === "functions/deadline-exceeded") return "No se pudo conectar con Firebase. Revisa la conexión y vuelve a intentar.";
  return error?.message || "No se pudo completar la solicitud a Firebase.";
}
function setAuthView(user) {
  currentUser = user;
  $("firebaseSignedOut").hidden = !!user;
  $("firebaseSignedIn").hidden = !user;
  $("firebaseUserLabel").textContent = user ? `${user.displayName || "Estudiante"} · ${user.email}` : "";
  if ($("careerChatStatus")) {
    $("careerLoginLink").hidden = !!user;
    $("careerChatStatus").textContent = !ready
      ? "Firebase aún no está configurado para esta página."
      : !user
        ? "Inicia sesión para conversar con Gemini."
        : recaptchaEnterpriseSiteKey === "REEMPLAZAR_SITE_KEY_RECAPTCHA_ENTERPRISE"
          ? "Falta configurar App Check para habilitar Gemini."
          : "Sesión iniciada. Puedes conversar con Gemini.";
  }
  $("teacherTools").hidden = true;
  if (user) user.getIdTokenResult().then(token => {
    const isTeacher = token.claims.role === "teacher";
    $("teacherTools").hidden = !isTeacher;
    $("studentTools").hidden = isTeacher;
  }).catch(() => {});
}
if (!ready) status("Firebase está pendiente de configuración. El reto local sigue disponible.");
else {
  try {
    const app = initializeApp(firebaseConfig);
    if (recaptchaEnterpriseSiteKey !== "REEMPLAZAR_SITE_KEY_RECAPTCHA_ENTERPRISE") initializeAppCheck(app, { provider: new ReCaptchaEnterpriseProvider(recaptchaEnterpriseSiteKey), isTokenAutoRefreshEnabled: true });
    else status("Falta configurar App Check. La sesión funciona; Gemini requiere su clave de sitio.");
    try { db = initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) }); }
    catch { db = getFirestore(app); }
    auth = getAuth(app);
    functions = getFunctions(app, "southamerica-east1");
    onAuthStateChanged(auth, async user => {
      setAuthView(user);
      if (!user) { status("Puedes practicar sin cuenta. Inicia sesión para guardar resultados y usar Gemini."); return; }
      try {
        await setDoc(doc(db, "users", user.uid), { displayName: user.displayName || "", email: user.email, school: "villa-esther", updatedAt: serverTimestamp() }, { merge: true });
        status("Sesión iniciada. El progreso se sincroniza cuando hay conexión.");
        await loadStudentClasses();
        await loadStudentProgress();
        await loadPublishedQuestions();
      } catch { status("Sesión iniciada; no se pudo sincronizar el perfil sin conexión."); }
    });
  } catch (error) { status("No se pudo iniciar Firebase: " + error.message, true); }
}

async function loadStudentClasses() {
  if (!currentUser || !db) return;
  try {
    const q = query(collection(db, "users", currentUser.uid, "memberships"));
    const snapshot = await getDocs(q);
    const select = $("studentClass"); select.replaceChildren(new Option("Sin grupo seleccionado", ""));
    snapshot.forEach(item => { const d = item.data(); select.add(new Option(d.className || "Grupo", item.id)); });
    if (activeClassId && [...select.options].some(o => o.value === activeClassId)) select.value = activeClassId;
  } catch { /* Funciona localmente aunque no cargue la lista. */ }
}
async function loadStudentProgress() {
  if (!currentUser || !db) return;
  const root = $("studentProgress");
  try {
    const snapshot = await getDocs(query(collection(db, "users", currentUser.uid, "results"), limit(50)));
    const rows = snapshot.docs.map(item => item.data());
    if (!rows.length) { root.textContent = "Aún no hay resultados guardados. Completa una práctica con sesión iniciada."; return; }
    const totals = {};
    rows.forEach(result => Object.entries(result.byArea || {}).forEach(([area, value]) => {
      const total = totals[area] || (totals[area] = { correct: 0, total: 0 });
      total.correct += Number(value.correct || 0); total.total += Number(value.total || 0);
    }));
    root.replaceChildren();
    const title = document.createElement("b"); title.textContent = `Prácticas guardadas: ${rows.length}`; root.append(title);
    Object.entries(totals).forEach(([area, value]) => { const line = document.createElement("p"); line.textContent = `${area}: ${value.total ? Math.round(value.correct / value.total * 100) : 0}% (${value.correct}/${value.total})`; root.append(line); });
  } catch { root.textContent = "El historial se actualizará cuando vuelva la conexión."; }
}
async function loadPublishedQuestions() {
  if (!currentUser || !db) return;
  try {
    const snapshot = await getDocs(query(collection(db, "questions"), where("status", "==", "published"), where("school", "==", "villa-esther"), limit(100)));
    window.dispatchEvent(new CustomEvent("villa:published-questions", { detail: snapshot.docs.map(item => ({ id: item.id, ...item.data() })) }));
  } catch { /* El banco de práctica local siempre permanece disponible. */ }
}
$("firebaseRegister").addEventListener("click", async () => {
  if (!ready) return status("Completa primero outputs/js/firebase-config.js.", true);
  const name = $("accountName").value.trim(), email = $("accountEmail").value.trim(), password = $("accountPassword").value;
  if (name.length < 2 || password.length < 8) return status("Escribe tu nombre y una contraseña de al menos 8 caracteres.", true);
  try { const credential = await createUserWithEmailAndPassword(auth, email, password); await updateProfile(credential.user, { displayName: name }); await setDoc(doc(db, "users", credential.user.uid), { displayName: name, email, school: "Villa Esther", createdAt: serverTimestamp() }, { merge: true }); status("Cuenta creada."); }
  catch (e) { status(readableAuthError(e), true); }
});
$("firebaseLogin").addEventListener("click", async () => {
  if (!ready) return status("Completa primero outputs/js/firebase-config.js.", true);
  try { await signInWithEmailAndPassword(auth, $("accountEmail").value.trim(), $("accountPassword").value); status("Sesión iniciada."); }
  catch (e) { status(readableAuthError(e), true); }
});
$("firebaseLogout").addEventListener("click", () => signOut(auth));
$("joinClass").addEventListener("click", async () => {
  if (!currentUser) return status("Inicia sesión para vincular un grupo.", true);
  try {
    const result = await httpsCallable(functions, "createLearningMaterial")({ mode: "joinClass", code: $("classCode").value });
    activeClassId = result.data.classId; localStorage.setItem("villaClassId", activeClassId);
    await loadStudentClasses(); status("Te uniste a " + result.data.className + ".");
  } catch (e) { status(e.message, true); }
});
$("createClass").addEventListener("click", async () => {
  if (!currentUser) return;
  const token = await currentUser.getIdTokenResult(true);
  if (token.claims.role !== "teacher") return status("Solo una cuenta habilitada como docente puede crear grupos.", true);
  const name = $("newClassName").value.trim(); if (!name) return status("Escribe un nombre para el grupo.", true);
  const code = Array.from(crypto.getRandomValues(new Uint8Array(6)), x => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[x % 32]).join("");
  try { const ref = await addDoc(collection(db, "classes"), { name, teacherUid: currentUser.uid, joinCode: code, active: true, school: "villa-esther", createdAt: serverTimestamp() }); $("classCreated").textContent = `${name} · Código: ${code}`; $("classCreated").dataset.id = ref.id; await loadTeacherClasses(); }
  catch (e) { status(e.message, true); }
});
async function loadTeacherClasses() {
  const q = query(collection(db, "classes"), where("teacherUid", "==", currentUser.uid));
  const snap = await getDocs(q), list = $("teacherClasses"); list.replaceChildren();
  snap.forEach(item => { const button = document.createElement("button"); button.className = "btn secondary"; button.textContent = item.data().name; button.onclick = () => showClassOverview(item.id); list.append(button); });
}
async function showClassOverview(classId) {
  try { const result = await httpsCallable(functions, "createLearningMaterial")({ mode: "classOverview", classId }); const data = result.data; $("classOverview").textContent = `${data.name}: ${data.members} estudiantes, ${data.attempts} prácticas. ` + Object.entries(data.areas).map(([a,p]) => `${a}: ${p}%`).join(" · "); }
  catch (e) { status(e.message, true); }
}
$("teacherTools").addEventListener("toggle", () => { if (!$("teacherTools").hidden && currentUser) loadTeacherClasses().catch(() => {}); });
$("saveTeacherQuestion").addEventListener("click", async () => {
  const claim = await currentUser?.getIdTokenResult(); if (claim?.claims.role !== "teacher") return status("Solo docentes habilitados pueden publicar preguntas.", true);
  const options = ["A", "B", "C", "D"].map(k => $("q" + k).value.trim());
  const data = { area: $("teacherArea").value, stimulus: $("teacherStimulus").value.trim(), question: $("teacherQuestion").value.trim(), options, answer: Number($("teacherAnswer").value), explanation: $("teacherExplanation").value.trim(), status: "published", school: "villa-esther", authorUid: currentUser.uid, createdAt: serverTimestamp() };
  if (!data.stimulus || !data.question || options.some(x => !x) || !data.explanation) return status("Completa el caso, las cuatro opciones y la explicación.", true);
  try { await addDoc(collection(db, "questions"), data); status("Pregunta publicada para estudiantes con sesión iniciada."); }
  catch (e) { status(e.message, true); }
});
$("askTutor").addEventListener("click", async () => {
  const question = $("tutorQuestion").value.trim();
  if (!question) return status("Escribe primero una consulta.", true);
  const button = $("askTutor"), answer = $("tutorAnswer");
  button.disabled = true; answer.hidden = false; answer.textContent = "Pensando…";
  try { const result = await window.aulaGemini({ mode: "tutor", question, context: "Estudiante de secundaria que se prepara para Saber 11." }); answer.textContent = result.answer; }
  catch (e) { answer.textContent = e.message; }
  finally { button.disabled = false; }
});
const careerChat = { messages: [], busy: false };
const careerLog = $("careerChatLog");
const careerLauncher = $("careerLauncher"), careerPanel = $("careerPanel");
function setCareerPanel(open) {
  careerPanel.hidden = !open;
  careerLauncher.setAttribute("aria-expanded", String(open));
  if (open) $("careerChatInput").focus(); else careerLauncher.focus();
}
careerLauncher.addEventListener("click", () => setCareerPanel(careerPanel.hidden));
$("careerClose").addEventListener("click", () => setCareerPanel(false));
$("careerLoginLink").addEventListener("click", event => {
  event.preventDefault();
  setCareerPanel(false);
  $("aula-digital").scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => $("accountEmail").focus({ preventScroll: true }), 350);
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !careerPanel.hidden) setCareerPanel(false);
});
function addCareerMessage(role, text) {
  const message = document.createElement("div");
  message.className = `career-message ${role}`;
  message.textContent = text;
  careerLog.append(message);
  careerLog.scrollTop = careerLog.scrollHeight;
}
$("careerChatForm").addEventListener("submit", async event => {
  event.preventDefault();
  if (careerChat.busy) return;
  const input = $("careerChatInput"), text = input.value.trim();
  if (!text) return;
  if (!ready) {
    $("careerChatStatus").textContent = "Firebase aún no está configurado para esta página.";
    addCareerMessage("system", "Esta herramienta necesita la configuración de Firebase para conectarse con Gemini.");
    return;
  }
  if (!currentUser) {
    $("careerChatStatus").textContent = "Inicia sesión en Aula digital para conversar con Gemini.";
    $("careerLoginLink").hidden = false;
    addCareerMessage("system", "Primero inicia sesión o crea una cuenta en Aula digital. Usa el enlace de abajo para ir al formulario.");
    return;
  }
  if (recaptchaEnterpriseSiteKey === "REEMPLAZAR_SITE_KEY_RECAPTCHA_ENTERPRISE") {
    $("careerChatStatus").textContent = "Falta configurar App Check para habilitar Gemini.";
    addCareerMessage("system", "La cuenta ya inició sesión, pero falta registrar este dominio en App Check y agregar su clave de sitio en js/firebase-config.js.");
    return;
  }
  careerChat.busy = true;
  const button = $("careerChatSend"), clearButton = $("careerChatClear"), statusEl = $("careerChatStatus");
  button.disabled = true; clearButton.disabled = true; input.disabled = true;
  statusEl.textContent = "Gemini está pensando una respuesta…";
  careerChat.messages.push({ role: "user", text });
  addCareerMessage("user", text);
  input.value = "";
  try {
    const result = await window.aulaGemini({ mode: "vocational", messages: careerChat.messages.slice(-10) });
    careerChat.messages.push({ role: "assistant", text: result.answer });
    addCareerMessage("assistant", result.answer);
    careerChat.messages = careerChat.messages.slice(-10);
    statusEl.textContent = "Puedes seguir explorando o probar un paso concreto.";
  } catch (error) {
    careerChat.messages.pop();
    input.value = text;
    addCareerMessage("system", error.message);
    statusEl.textContent = "No se pudo consultar Gemini. Revisa tu sesión y conexión; tu mensaje sigue en el campo.";
  } finally {
    careerChat.busy = false; button.disabled = false; clearButton.disabled = false; input.disabled = false; input.focus();
  }
});
$("careerChatClear").addEventListener("click", () => {
  careerChat.messages = [];
  careerLog.replaceChildren();
  addCareerMessage("assistant", "Conversación nueva. ¿Qué actividad, tema o problema te gusta explorar?");
  $("careerChatStatus").textContent = "La conversación anterior se borró de esta página.";
});
document.querySelectorAll("[data-career-prompt]").forEach(button => button.addEventListener("click", () => {
  const input = $("careerChatInput"); input.value = button.dataset.careerPrompt; input.focus();
}));
$("studentClass").addEventListener("change", e => { activeClassId = e.target.value; localStorage.setItem("villaClassId", activeClassId); });

window.aulaGemini = async payload => {
  if (!ready) throw new Error("Firebase aún no está configurado para esta página.");
  if (!currentUser) throw new Error("Inicia sesión en Aula digital para usar Gemini.");
  if (!functions) throw new Error("No se pudo iniciar la conexión de Gemini con Firebase.");
  try {
    const result = await httpsCallable(functions, "createLearningMaterial")(payload);
    return result.data;
  } catch (error) {
    throw new Error(readableFunctionError(error));
  }
};
window.addEventListener("villa:attempt", async event => {
  if (!currentUser || !db) return;
  const d = event.detail, classId = activeClassId || "";
  const byArea = {};
  (d.questions || []).forEach(q => { const key = q.areaName || q.area || "General"; const x = byArea[key] || (byArea[key] = { correct: 0, total: 0 }); x.total++; if (q.correct) x.correct++; });
  const payload = { area: d.area || "all", total: Number(d.total), correct: Number(d.correct), percent: Number(d.percent), byArea, source: d.source || "local", createdAt: serverTimestamp() };
  if (classId) payload.classId = classId;
  try { await addDoc(collection(db, "users", currentUser.uid, "results"), payload); status("Resultado guardado."); }
  catch { status("Resultado listo en este equipo; la sincronización se hará cuando haya conexión."); }
});
