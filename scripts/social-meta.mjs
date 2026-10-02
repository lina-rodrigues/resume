const TITLE_MARK = "<title>Resume</title>";
const DESCRIPTION_MAX = 160;

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function truncate(value, max = DESCRIPTION_MAX) {
  const normalized = text(value).replace(/\s+/g, " ");
  if (normalized.length <= max) return normalized;
  const cut = normalized.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  const trimmed = (space > max / 2 ? cut.slice(0, space) : cut).replace(/[.,;:–—-]+$/u, "");
  return `${trimmed}…`;
}

export function resolvePreviewLang(searchParams) {
  const value = searchParams.get("lang");
  if (value && value.toLowerCase() === "pt-br") return "pt-br";
  return "en";
}

export function imageUrlForPhoto(photo, jsonUrl) {
  const value = text(photo);
  if (!value || !jsonUrl) return "";
  if (/^https?:\/\//i.test(value)) return value;
  const base = new URL(jsonUrl);
  if (value.startsWith("/")) return new URL(value, base).href;
  const filename = value.split("/").filter(Boolean).pop();
  if (!filename) return "";
  base.pathname = base.pathname.replace(/[^/]+$/, filename);
  base.search = "";
  base.hash = "";
  return base.href;
}

function linkedinUrl(data) {
  const url = text(data && data.contact && data.contact.linkedin && data.contact.linkedin.url);
  return /^https?:\/\//i.test(url) ? url : "";
}

function jsonLd(fields) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: fields.name,
    url: fields.pageUrl,
  };
  if (fields.role) data.jobTitle = fields.role;
  if (fields.summary) data.description = fields.summary;
  if (fields.imageUrl) data.image = fields.imageUrl;
  if (fields.sameAs) data.sameAs = [fields.sameAs];
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function buildPreview(data, { pageUrl, imageUrl, lang }) {
  const name = text(data && data.name);
  if (!name || !pageUrl) return null;
  const role = text(data && data.title);
  const summary = truncate(text(data && data.summary));
  const title = role ? `${name} — ${role}` : name;
  const image = text(imageUrl);
  const htmlLang = lang === "pt-br" ? "pt-BR" : "en";
  const locale = lang === "pt-br" ? "pt_BR" : "en_US";
  const sameAs = linkedinUrl(data);
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    summary && `<meta name="description" content="${escapeHtml(summary)}">`,
    `<link rel="canonical" href="${escapeHtml(pageUrl)}">`,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    summary && `<meta property="og:description" content="${escapeHtml(summary)}">`,
    `<meta property="og:url" content="${escapeHtml(pageUrl)}">`,
    `<meta property="og:type" content="profile">`,
    `<meta property="og:locale" content="${locale}">`,
    image && `<meta property="og:image" content="${escapeHtml(image)}">`,
    image && `<meta property="og:image:alt" content="${escapeHtml(name)}">`,
    `<meta name="twitter:card" content="summary">`,
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    summary && `<meta name="twitter:description" content="${escapeHtml(summary)}">`,
    image && `<meta name="twitter:image" content="${escapeHtml(image)}">`,
    `<script type="application/ld+json">${jsonLd({ name, role, summary, pageUrl, imageUrl: image, sameAs })}</script>`,
  ].filter(Boolean);

  return { head: tags.join("\n    "), htmlLang };
}

export function injectPreview(html, preview) {
  if (!preview || !html.includes(TITLE_MARK)) return html;
  let next = html.replace(TITLE_MARK, preview.head);
  if (preview.htmlLang !== "en") {
    next = next.replace('<html lang="en"', `<html lang="${preview.htmlLang}"`);
  }
  return next;
}
