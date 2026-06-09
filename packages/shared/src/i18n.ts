import catalogs from "./generated/translations.json" with { type: "json" };

export const locales = ["en", "hi", "bn"] as const;
export type Locale = (typeof locales)[number];
export type TranslationCatalog = Record<string, string>;

export const localeLabels: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  bn: "বাংলা"
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export function translate(locale: Locale, source: string, variables: Record<string, string | number> = {}) {
  const template = locale === "en"
    ? source
    : ((catalogs as Record<string, TranslationCatalog>)[locale]?.[source] || source);

  return template.replace(/\{\{(\w+)\}\}/g, (_, name: string) => String(variables[name] ?? `{{${name}}}`));
}

export function getCatalog(locale: Locale): TranslationCatalog {
  return locale === "en" ? {} : (catalogs as Record<string, TranslationCatalog>)[locale] ?? {};
}
