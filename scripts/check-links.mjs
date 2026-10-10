import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteRoot = path.join(repoRoot, "outputs");
const errors = [];

function listFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const item = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(item) : [item];
  });
}

function checkReference(rawValue, sourceFile, description) {
  const value = rawValue.trim();
  if (!value || value.startsWith("#") || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) return;

  let pathname;
  try {
    const pathPart = value.split(/[?#]/, 1)[0];
    pathname = pathPart ? decodeURIComponent(pathPart) : path.relative(siteRoot, sourceFile);
  } catch {
    errors.push(`${description}: URL mal codificada: ${value}`);
    return;
  }
  if (pathname === ".") pathname = "./";
  if (pathname.startsWith("/api/")) return; // Pages Functions, no archivos estáticos.

  const resolved = pathname.startsWith("/")
    ? path.resolve(siteRoot, pathname.replace(/^[/\\]+/, ""))
    : path.resolve(path.dirname(sourceFile), pathname);
  const relative = path.relative(siteRoot, resolved);
  if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    errors.push(`${description}: la ruta sale de outputs: ${value}`);
    return;
  }

  const candidates = pathname.endsWith("/") || (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory())
    ? [path.join(resolved, "index.html")]
    : [resolved];
  if (!candidates.some(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile())) {
    errors.push(`${description}: no existe ${value}`);
  }
}

const htmlFiles = listFiles(siteRoot).filter(file => file.toLowerCase().endsWith(".html"));
if (!htmlFiles.length) {
  console.error("No se encontraron páginas HTML dentro de outputs/.");
  process.exit(1);
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const attributePattern = /\b(href|src|poster|action)\s*=\s*(["'])(.*?)\2/gi;
  for (const match of html.matchAll(attributePattern)) {
    checkReference(match[3], file, `${path.relative(siteRoot, file)} (${match[1]})`);
  }
}

const manifestFile = path.join(siteRoot, "manifest.webmanifest");
if (fs.existsSync(manifestFile)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
    if (manifest.start_url) checkReference(manifest.start_url, manifestFile, "manifest start_url");
    for (const icon of manifest.icons ?? []) {
      if (icon.src) checkReference(icon.src, manifestFile, "manifest icon");
    }
  } catch (error) {
    errors.push(`manifest.webmanifest: JSON inválido (${error.message})`);
  }
}

const workerFile = path.join(siteRoot, "service-worker.js");
if (fs.existsSync(workerFile)) {
  const worker = fs.readFileSync(workerFile, "utf8");
  const coreMatch = worker.match(/const\s+CORE\s*=\s*(\[[\s\S]*?\])\s*;/);
  if (!coreMatch) {
    errors.push("service-worker.js: no se encontró el arreglo CORE.");
  } else {
    try {
      for (const asset of JSON.parse(coreMatch[1])) {
        checkReference(asset, workerFile, "service-worker CORE");
      }
    } catch (error) {
      errors.push(`service-worker.js: CORE no es JSON válido (${error.message})`);
    }
  }
}

const redirectsFile = path.join(siteRoot, "_redirects");
if (fs.existsSync(redirectsFile)) {
  for (const [index, line] of fs.readFileSync(redirectsFile, "utf8").split(/\r?\n/).entries()) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [source, destination] = trimmed.split(/\s+/);
    if (destination && !/^https?:\/\//i.test(destination)) {
      checkReference(destination, path.join(siteRoot, "index.html"), `_redirects:${index + 1}`);
    }
  }
}

if (errors.length) {
  console.error(`Se encontraron ${errors.length} problema(s) en rutas locales:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validación correcta: ${htmlFiles.length} páginas HTML y recursos locales revisados.`);
