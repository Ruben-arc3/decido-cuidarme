const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const uid = process.argv[2];
if (!uid) {
  console.error("Uso: node firebase-functions/scripts/set-teacher-role.js UID_DEL_DOCENTE");
  process.exit(1);
}
initializeApp({ credential: applicationDefault() });
(async () => {
  const auth = getAuth();
  const user = await auth.getUser(uid);
  await auth.setCustomUserClaims(uid, { ...user.customClaims, role: "teacher", school: "villa-esther" });
  console.log(`Rol docente asignado a ${user.email || uid}. Cierra y vuelve a iniciar sesión.`);
})().catch(error => { console.error(error.message); process.exit(1); });
