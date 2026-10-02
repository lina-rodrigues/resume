import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildPreview, imageUrlForPhoto, injectPreview, resolvePreviewLang } from "./social-meta.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT) || 4173;

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

async function previewHtml(requestUrl) {
  const html = await readFile(path.join(root, "index.html"), "utf8");
  const lang = resolvePreviewLang(requestUrl.searchParams);
  let data;
  try {
    data = JSON.parse(await readFile(path.join(root, "content", `${lang}.json`), "utf8"));
  } catch (error) {
    console.error(error);
    return html;
  }
  const origin = `${requestUrl.protocol}//${requestUrl.host}`;
  const pageUrl = lang === "pt-br" ? `${origin}/?lang=pt-br` : `${origin}/`;
  const imageUrl = imageUrlForPhoto(data.photo, `${origin}/content/${lang}.json`);
  return injectPreview(html, buildPreview(data, { pageUrl, imageUrl, lang }));
}

const server = createServer(async (request, response) => {
  const host = request.headers.host || `127.0.0.1:${port}`;
  const url = new URL(request.url ?? "/", `http://${host}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith("/")) pathname += "index.html";
  const file = path.normalize(path.join(root, pathname));
  const insideRoot = file === root || file.startsWith(root + path.sep);
  const blocked = file.split(path.sep).includes("node_modules");
  if (!insideRoot || blocked) {
    response.writeHead(403);
    response.end();
    return;
  }
  if (file === path.join(root, "index.html")) {
    try {
      const html = await previewHtml(url);
      response.writeHead(200, { "Content-Type": types[".html"] });
      response.end(html);
    } catch (error) {
      console.error(error);
      if (response.headersSent) {
        response.destroy();
        return;
      }
      response.writeHead(500);
      response.end("Could not load resume.");
    }
    return;
  }
  const stream = createReadStream(file);
  stream.on("error", () => {
    if (response.headersSent) {
      response.destroy();
      return;
    }
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

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use.`);
  } else {
    console.error(error.message);
  }
  process.exit(1);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`http://127.0.0.1:${port}/`);
});
