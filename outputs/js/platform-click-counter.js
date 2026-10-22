import { firebaseConfig, recaptchaEnterpriseSiteKey } from "./villa-esther/firebase-config.js";

const queuedClicks = window.platformCounterQueue || [];

const notify = (detail) =>
  window.dispatchEvent(new CustomEvent("platform-counter:sync", { detail }));

const firebaseErrorMessage = (error, action) => {
  console.error(`[contador Firebase] ${action}`, error);
  const code = error?.code ? ` (${error.code})` : "";
  if (error?.code === "permission-denied")
    return `Firestore rechazó el acceso${code}. Confirma que las reglas estén desplegadas para publicCounters/platformClicks y revisa App Check.`;
  if (error?.code === "failed-precondition")
    return `Firestore no está listo${code}. Confirma que la base de datos esté creada.`;
  if (error?.code === "unavailable" || error?.code === "network-request-failed")
    return `No hay conexión con Firestore${code}. Revisa internet y vuelve a intentar.`;
  if (error?.code === "unauthenticated")
    return `Firebase requiere una verificación App Check${code} para aceptar este clic.`;
  return `Firebase no pudo ${action}${code}. Abre la consola del navegador para ver más detalles.`;
};

const databasePromise = (async () => {
  try {
    const [{ initializeApp }, firestore] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js"),
    ]);
    const app = initializeApp(firebaseConfig, "platform-click-counter");
    if (recaptchaEnterpriseSiteKey) {
      const { initializeAppCheck, ReCaptchaEnterpriseProvider } = await import(
        "https://www.gstatic.com/firebasejs/12.19.0/firebase-app-check.js"
      );
      initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(recaptchaEnterpriseSiteKey),
        isTokenAutoRefreshEnabled: true,
      });
    }

    let database;
    try {
      database = firestore.initializeFirestore(app, {
        localCache: firestore.persistentLocalCache({
          tabManager: firestore.persistentMultipleTabManager(),
        }),
      });
    } catch {
      database = firestore.getFirestore(app);
    }

    const counterRef = firestore.doc(database, "publicCounters", "platformClicks");
    firestore.onSnapshot(
      counterRef,
      { includeMetadataChanges: true },
      (snapshot) => {
        const count = snapshot.exists() ? snapshot.data().count : 0;
        window.dispatchEvent(
          new CustomEvent("platform-counter:remote", {
            detail: { count, hasPendingWrites: snapshot.metadata.hasPendingWrites },
          }),
        );
      },
      (error) => notify({ error: firebaseErrorMessage(error, "leer el contador") }),
    );

    return {
      database,
      counterRef,
      setDoc: firestore.setDoc,
      increment: firestore.increment,
    };
  } catch (error) {
    notify({ error: firebaseErrorMessage(error, "inicializar el contador") });
    return null;
  }
})();

const saveClick = async (clickId) => {
  try {
    const firebase = await databasePromise;
    if (!firebase) throw new Error("Firebase no está disponible.");
    const { database, counterRef, setDoc, increment } = firebase;
    await setDoc(counterRef, { count: increment(1) }, { merge: true });
    // setDoc resolves when an offline-persisted write is queued too. The
    // snapshot listener clears this state only after the server confirms it.
    notify({ clickId, pending: true });
  } catch (error) {
    notify({ clickId, error: firebaseErrorMessage(error, "guardar el clic") });
  }
};

window.platformCounterReady = true;
window.addEventListener("platform-counter:click", (event) => saveClick(event.detail.clickId));
queuedClicks.splice(0).forEach(({ clickId }) => saveClick(clickId));
