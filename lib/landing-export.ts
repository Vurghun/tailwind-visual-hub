import type { LandingConfig } from "@/lib/supabase";

export type ExportFormat = "html" | "inline" | "jsx" | "codepen";

export function buildHtmlDocument(
  cfg: LandingConfig,
  pageHtml: string,
  options?: { inlineTailwind?: boolean }
): string {
  const slug = (cfg.brandName || "acme").toLowerCase().replace(/\s+/g, "");
  const title = cfg.seo?.metaTitle || cfg.brandName || "Acme";
  const desc = cfg.seo?.metaDescription || cfg.heroSubtitle || "";
  const og = cfg.seo?.ogImage || cfg.heroImage || "";

  const tailwindScript = options?.inlineTailwind
    ? ""
    : `  <script src="https://cdn.tailwindcss.com"></script>\n`;

  const inlineNote = options?.inlineTailwind
    ? `  <!-- Self-contained export: class names preserved; add Tailwind build or CDN for production -->\n  <style>*,*::before,*::after{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif}</style>\n`
    : `  <style>*{box-sizing:border-box}body{margin:0}</style>\n`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(desc)}" />
  ${og ? `<meta property="og:image" content="${escapeHtml(og)}" />` : ""}
${tailwindScript}${inlineNote}</head>
<body>
<!-- ${slug}.com — generated with Tailwind Visual Hub -->
${pageHtml}
</body>
</html>`;
}

export function htmlToJsxSnippet(pageHtml: string, componentName = "LandingPage"): string {
  const jsx = pageHtml
    .replace(/\sclass=/g, " className=")
    .replace(/\sfor=/g, " htmlFor=")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();

  return `export function ${componentName}() {
  return (
    <>
${indent(jsx, 6)}
    </>
  );
}`;
}

export function codePenUrl(htmlDoc: string, title: string): string {
  const data = {
    title,
    html: htmlDoc,
    editors: "100",
  };
  return `https://codepen.io/pen/define/?data=${encodeURIComponent(JSON.stringify(data))}`;
}

export function prepareExportHtml(clone: HTMLElement): HTMLElement {
  clone.querySelectorAll("[data-ui]").forEach((el) => el.remove());
  clone.querySelectorAll("[data-section-wrap]").forEach((el) => {
    el.removeAttribute("data-section-wrap");
    el.className = el.className.replace(/\bring-[^\s]+/g, "").trim();
  });
  clone.querySelectorAll("[data-edit]").forEach((el) => {
    el.removeAttribute("contenteditable");
    el.removeAttribute("spellcheck");
    el.removeAttribute("data-edit");
  });
  clone.querySelectorAll("[class]").forEach((el) => {
    const node = el as HTMLElement;
    if (typeof node.className === "string") {
      node.className = node.className
        .replace(/@sm:/g, "sm:")
        .replace(/@md:/g, "md:")
        .replace(/@lg:/g, "lg:");
    }
  });
  return clone;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}

function indent(text: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => (line.trim() ? pad + line : line))
    .join("\n");
}
