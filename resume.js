const { createApp } = Vue;

const media = window.matchMedia("(prefers-color-scheme: dark)");

function text(value) {
  if (value == null) return "";
  return String(value).trim();
}

function present(value) {
  return text(value) !== "";
}

function score(value, max) {
  const number = typeof value === "number" ? value : Number(text(value));
  if (!Number.isFinite(number)) return null;
  const rounded = Math.round(number);
  if (rounded < 1) return null;
  return Math.min(max, rounded);
}

function asGroups(items) {
  const groups = [];
  for (const item of items) {
    if (item.level !== null) {
      groups.push({ type: "score", name: item.name, level: item.level });
      continue;
    }
    if (!item.name) continue;
    const last = groups[groups.length - 1];
    if (last && last.type === "text") last.names.push(item.name);
    else groups.push({ type: "text", names: [item.name] });
  }
  return groups;
}

function initialsFrom(name) {
  const parts = text(name).split(/\s+/).filter(Boolean);
  if (!parts.length) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function whenRange(start, end) {
  const left = text(start);
  const right = text(end);
  if (left && right) return `${left} – ${right}`;
  return left || right;
}

function resolveLang() {
  const value = new URLSearchParams(window.location.search).get("lang");
  if (value && value.toLowerCase() === "pt-br") return "pt-br";
  return "en";
}

function resolvePhoto(value) {
  const photo = text(value);
  if (!photo) return "";
  if (/^(https?:)?\/\//i.test(photo) || photo.startsWith("/")) return photo;
  return `content/${photo}`;
}

function applyThemeClass(dark) {
  document.documentElement.classList.toggle("wa-dark", dark);
  document.documentElement.classList.toggle("wa-light", !dark);
}

const app = createApp({
  data() {
    return {
      resume: null,
      error: "",
      dark: document.documentElement.classList.contains("wa-dark"),
      followSystem: true,
      silent: false,
    };
  },
  computed: {
    labels() {
      const labels = this.resume && this.resume.labels;
      return labels && typeof labels === "object" ? labels : {};
    },
    name() {
      return text(this.resume && this.resume.name);
    },
    title() {
      return text(this.resume && this.resume.title);
    },
    photo() {
      return resolvePhoto(this.resume && this.resume.photo);
    },
    initials() {
      return initialsFrom(this.resume && this.resume.name);
    },
    showAvatar() {
      return Boolean(this.photo || this.initials);
    },
    showHeader() {
      return Boolean(this.name || this.title || this.showAvatar);
    },
    summary() {
      return text(this.resume && this.resume.summary);
    },
    contactRows() {
      const contact = (this.resume && this.resume.contact) || {};
      const rows = [];
      if (present(contact.email)) {
        rows.push({ icon: "envelope", text: text(contact.email), href: `mailto:${text(contact.email)}` });
      }
      if (present(contact.phone)) {
        rows.push({
          icon: "phone",
          text: text(contact.phone),
          href: `tel:${text(contact.phone).replace(/[^\d+]/g, "")}`,
        });
      }
      if (present(contact.location)) {
        rows.push({ icon: "location-dot", text: text(contact.location) });
      }
      const linkedin = contact.linkedin || {};
      const label = text(linkedin.label);
      const url = text(linkedin.url);
      if (label || url) {
        rows.push({
          icon: "linkedin",
          family: "brands",
          text: label || url,
          href: url || undefined,
        });
      }
      const github = contact.github || {};
      const githubLabel = text(github.label);
      const githubUrl = text(github.url);
      if (githubLabel || githubUrl) {
        rows.push({
          icon: "github",
          family: "brands",
          text: githubLabel || githubUrl,
          href: githubUrl || undefined,
        });
      }
      return rows;
    },
    experience() {
      const items = Array.isArray(this.resume && this.resume.experience) ? this.resume.experience : [];
      return items
        .map((item) => ({
          role: text(item && item.role),
          company: text(item && item.company),
          when: whenRange(item && item.start, item && item.end),
          summary: text(item && item.summary),
          highlights: Array.isArray(item && item.highlights) ? item.highlights.map(text).filter(Boolean) : [],
        }))
        .filter((item) => item.role || item.company || item.when || item.summary || item.highlights.length);
    },
    projects() {
      const items = Array.isArray(this.resume && this.resume.projects) ? this.resume.projects : [];
      return items
        .map((item) => ({
          name: text(item && item.name),
          url: text(item && item.url),
          role: text(item && item.role),
          summary: text(item && item.summary),
          highlights: Array.isArray(item && item.highlights) ? item.highlights.map(text).filter(Boolean) : [],
        }))
        .filter((item) => item.name || item.role || item.summary || item.highlights.length);
    },
    hideScores() {
      const params = new URLSearchParams(window.location.search);
      if (params.has("hide-scores")) return true;
      return (params.get("hideScores") || "").toLowerCase() === "true";
    },
    skills() {
      const items = Array.isArray(this.resume && this.resume.skills) ? this.resume.skills : [];
      return items
        .map((item) => ({
          name: text(item && item.name),
          level: this.hideScores ? null : score(item && item.level, 10),
        }))
        .filter((item) => item.name || item.level !== null);
    },
    skillGroups() {
      return asGroups(this.skills);
    },
    languages() {
      const items = Array.isArray(this.resume && this.resume.languages) ? this.resume.languages : [];
      return items
        .map((item) => ({
          name: text(item && item.name),
          level: this.hideScores ? null : score(item && item.level, 5),
        }))
        .filter((item) => item.name || item.level !== null);
    },
    languageGroups() {
      return asGroups(this.languages);
    },
    education() {
      const items = Array.isArray(this.resume && this.resume.education) ? this.resume.education : [];
      return items
        .map((item) => ({
          degree: text(item && item.degree),
          date: text(item && item.date),
          school: text(item && item.school),
        }))
        .filter((item) => item.degree || item.date || item.school);
    },
  },
  methods: {
    label(key) {
      return text(this.labels[key]);
    },
    setDark(dark) {
      this.dark = dark;
      applyThemeClass(dark);
      this.syncSwitch();
    },
    syncSwitch() {
      const element = this.$refs.themeSwitch;
      if (!element) return;
      this.silent = true;
      element.checked = this.dark;
      this.silent = false;
    },
    onThemeChange(event) {
      if (this.silent) return;
      this.followSystem = false;
      this.setDark(Boolean(event.target.checked));
    },
    onSystemChange(event) {
      if (!this.followSystem) return;
      this.setDark(event.matches);
    },
  },
  async mounted() {
    const lang = resolveLang();
    document.documentElement.lang = lang === "pt-br" ? "pt-BR" : "en";
    media.addEventListener("change", this.onSystemChange);
    customElements.whenDefined("wa-switch").then(() => this.syncSwitch());

    try {
      const response = await fetch(`content/${lang}.json`);
      if (!response.ok) throw new Error(String(response.status));
      this.resume = await response.json();
      if (this.name) document.title = this.title ? `${this.name} — ${this.title}` : this.name;
    } catch (error) {
      this.error = "Could not load resume.";
    }
  },
  beforeUnmount() {
    media.removeEventListener("change", this.onSystemChange);
  },
});

app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("wa-");
app.mount("#app");
