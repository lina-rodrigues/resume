import { readFile } from "node:fs/promises";
import path from "node:path";
import { buildPreview, imageUrlForPhoto, injectPreview, resolvePreviewLang } from "../scripts/social-meta.mjs";

const CANONICAL_ORIGIN = "https://linarodrigues.dev";
const HTML = { "Content-Type": "text/html; charset=utf-8" };
const CACHED = {
  ...HTML,
  "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=600",
};

export async function GET(request) {
  let shell;
  try {
    shell = await readShell(request);
  } catch (error) {
    console.error(error);
    return new Response("Could not load resume.", { status: 500, headers: HTML });
  }

  try {
    const url = new URL(request.url);
    const lang = resolvePreviewLang(url.searchParams);
    const dataRes = await fetch(new URL(`/content/${lang}.json`, url.origin));
    if (!dataRes.ok) throw new Error(`Resume JSON ${dataRes.status}`);
    const data = await dataRes.json();
    const pageUrl = lang === "pt-br" ? `${CANONICAL_ORIGIN}/?lang=pt-br` : `${CANONICAL_ORIGIN}/`;
    const imageUrl = imageUrlForPhoto(data && data.photo, dataRes.url);
    const html = injectPreview(shell, buildPreview(data, { pageUrl, imageUrl, lang }));
    return new Response(html, { headers: CACHED });
  } catch (error) {
    console.error(error);
    return new Response(shell, { headers: { ...HTML, "Cache-Control": "no-store" } });
  }
}

async function readShell(request) {
  try {
    return await readFile(path.join(process.cwd(), "index.html"), "utf8");
  } catch (error) {
    console.error(error);
    const response = await fetch(new URL("/index.html", request.url));
    if (!response.ok) throw new Error(`Shell ${response.status}`);
    return response.text();
  }
}
