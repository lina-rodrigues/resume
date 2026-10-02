import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const schema = {
  name: "string",
  title: "string",
  photo: "string",
  summary: "string",
  contact: {
    email: "string",
    phone: "string",
    location: "string",
    linkedin: { label: "string", url: "string" },
    github: { label: "string", url: "string" },
  },
  experience: [{ role: "string", company: "string", start: "string", end: "string", summary: "string", highlights: ["string"] }],
  projects: [{ name: "string", url: "string", role: "string", summary: "string", highlights: ["string"] }],
  skills: [{ name: "string" }],
  languages: [{ name: "string" }],
  education: [{ degree: "string", date: "string", school: "string" }],
  labels: {
    summary: "string",
    experience: "string",
    projects: "string",
    contact: "string",
    skills: "string",
    languages: "string",
    education: "string",
  },
};

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function readArgs() {
  const args = process.argv.slice(2);
  let lang = "en";
  let hideScores = false;
  let live = false;
  for (const arg of args) {
    if (arg === "--") continue;
    if (arg === "--hide-scores") {
      hideScores = true;
      continue;
    }
    if (arg === "--live") {
      live = true;
      continue;
    }
    if (arg.startsWith("--lang=")) {
      lang = arg.slice("--lang=".length).toLowerCase();
      continue;
    }
    console.error(`Unknown argument "${arg}". Use --lang=en or --lang=pt-br, --hide-scores, and --live.`);
    process.exit(1);
  }
  if (lang !== "en" && lang !== "pt-br") {
    console.error(`Unsupported language "${lang}". Use en or pt-br.`);
    process.exit(1);
  }
  return { lang, hideScores, live };
}

function isMissing(value) {
  if (value == null) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  return false;
}

function warnMissing(node, value, fieldPath, warnings) {
  if (Array.isArray(node)) {
    if (!Array.isArray(value) || value.length === 0) {
      warnings.push(fieldPath);
      return;
    }
    const itemSchema = node[0];
    value.forEach((item, index) => {
      const itemPath = `${fieldPath}[${index}]`;
      if (itemSchema === "string") {
        if (isMissing(item)) warnings.push(itemPath);
        return;
      }
      warnMissing(itemSchema, item, itemPath, warnings);
    });
    return;
  }

  if (node === "string" || node === "number") {
    if (isMissing(value)) warnings.push(fieldPath);
    return;
  }

  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  for (const key of Object.keys(node)) {
    const childPath = fieldPath ? `${fieldPath}.${key}` : key;
    if (key === "highlights") {
      const highlights = source[key];
      if (!Array.isArray(highlights)) {
        warnings.push(childPath);
        continue;
      }
      highlights.forEach((item, index) => {
        if (isMissing(item)) warnings.push(`${childPath}[${index}]`);
      });
      continue;
    }
    warnMissing(node[key], source[key], childPath, warnings);
  }
}

function serve({ live }) {
  const server = createServer((request, response) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith("/")) pathname += "index.html";
    let relative = pathname.replace(/^\//, "");
    if (live && relative.startsWith("content/")) {
      relative = path.join("live", relative.slice("content/".length));
    }
    const file = path.normalize(path.join(root, relative || pathname.replace(/^\//, "")));
    const insideRoot = file === root || file.startsWith(root + path.sep);
    const blocked = file.split(path.sep).includes("node_modules");
    if (!insideRoot || blocked) {
      response.writeHead(403);
      response.end();
      return;
    }
    const stream = createReadStream(file);
    stream.on("error", () => {
      response.writeHead(404);
      response.end("Not found");
    });
    stream.on("open", () => {
      response.writeHead(200, {
        "Content-Type": types[path.extname(file)] ?? "application/octet-stream",
      });
    });
    stream.pipe(response);
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({ server, port: address.port });
    });
  });
}

const { lang, hideScores, live } = readArgs();
const jsonDir = live ? "live" : "content";
const jsonPath = path.join(root, jsonDir, `${lang}.json`);
let resume;
try {
  resume = JSON.parse(await readFile(jsonPath, "utf8"));
} catch (error) {
  console.error(`Could not read ${path.relative(root, jsonPath)}: ${error.message}`);
  process.exit(1);
}

const warnings = [];
warnMissing(schema, resume, "", warnings);
for (const fieldPath of warnings) {
  console.warn(`${lang}: ${fieldPath} is missing`);
}

const { server, port } = await serve({ live });
const params = new URLSearchParams();
if (lang === "pt-br") params.set("lang", "pt-br");
if (hideScores) params.set("hideScores", "true");
const query = params.size ? `?${params}` : "";
const outputDir = path.join(root, "output");
await mkdir(outputDir, { recursive: true });
const outputPath = path.join(outputDir, `${live ? "resume-live" : "resume"}-${lang}.pdf`);

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  await page.emulateMedia({ colorScheme: "light", media: "print" });
  await page.goto(`http://127.0.0.1:${port}/${query}`, { waitUntil: "networkidle" });
  await page.waitForSelector(".sheet");
  await page.waitForFunction(() => {
    const ready = (selector) => {
      const element = document.querySelector(selector);
      return !element || element.shadowRoot;
    };
    return ready("wa-avatar") && ready("wa-icon") && ready("wa-progress-bar") && document.fonts.status === "loaded";
  });
  await page.pdf({
    path: outputPath,
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

console.log(path.relative(root, outputPath));
