import "dotenv/config";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { put } from "@vercel/blob";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error("Set BLOB_READ_WRITE_TOKEN in .env");
  process.exit(1);
}

const files = [
  { local: "live/photo.jpg", pathname: "photo.jpg", contentType: "image/jpeg" },
  { local: "live/en.json", pathname: "en.json", contentType: "application/json" },
  { local: "live/pt-br.json", pathname: "pt-br.json", contentType: "application/json" },
];

let base = "";
for (const file of files) {
  const body = await readFile(path.join(root, file.local));
  const blob = await put(file.pathname, body, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
    contentType: file.contentType,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  if (!blob.url.endsWith(`/${file.pathname}`)) {
    console.error(`Unexpected blob URL for ${file.pathname}: ${blob.url}`);
    process.exit(1);
  }
  const prefix = blob.url.slice(0, -(`/${file.pathname}`.length));
  if (!base) base = prefix;
  else if (prefix !== base) {
    console.error(`Blob prefix changed from ${base} to ${prefix}.`);
    process.exit(1);
  }
  console.log(blob.url);
}

const vercelPath = path.join(root, "vercel.json");
const vercel = JSON.parse(await readFile(vercelPath, "utf8"));
const redirects = Array.isArray(vercel.redirects) ? vercel.redirects : [];
const contentRedirect = redirects.find((r) => r.source === "/content/:path*");
if (contentRedirect) {
  contentRedirect.destination = `${base}/:path*`;
} else {
  redirects.push({
    source: "/content/:path*",
    destination: `${base}/:path*`,
    permanent: false,
  });
  vercel.redirects = redirects;
}
await writeFile(vercelPath, `${JSON.stringify(vercel, null, 2)}\n`);
console.log(`Updated vercel.json redirect → ${base}/:path*`);
