import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getCatalog, isLocale, localeLabels, Locale, translate } from "@floydee/shared";

const STORAGE_KEY = "floydee-locale";
const TRANSLATED_ATTRIBUTES = ["aria-label", "alt", "placeholder", "title"];

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (source: string, variables?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function preserveWhitespace(original: string, translated: string) {
  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}

function translateDom(root: ParentNode, locale: Locale) {
  const catalog = getCatalog(locale);
  const translateSource = (source: string) => locale === "en" ? source : catalog[source] || source;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const text = node.textContent ?? "";
    const source = (node as Text & { __floydeeSource?: string }).__floydeeSource ?? text.trim();
    if (source && (catalog[source] || (node as Text & { __floydeeSource?: string }).__floydeeSource)) {
      (node as Text & { __floydeeSource?: string }).__floydeeSource = source;
      const nextText = preserveWhitespace(text, translateSource(source));
      if (node.textContent !== nextText) node.textContent = nextText;
    }
    node = walker.nextNode();
  }

  root.querySelectorAll?.("*").forEach((element) => {
    TRANSLATED_ATTRIBUTES.forEach((attribute) => {
      const current = element.getAttribute(attribute);
      if (!current) return;
      const sourceAttribute = `data-i18n-source-${attribute.replace("aria-", "")}`;
      const source = element.getAttribute(sourceAttribute) || current;
      if (catalog[source] || element.hasAttribute(sourceAttribute)) {
        element.setAttribute(sourceAttribute, source);
        const nextValue = translateSource(source);
        if (element.getAttribute(attribute) !== nextValue) element.setAttribute(attribute, nextValue);
      }
    });
  });
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isLocale(stored) ? stored : "en";
  });

  const setLocale = (nextLocale: Locale) => {
    localStorage.setItem(STORAGE_KEY, nextLocale);
    setLocaleState(nextLocale);
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    document.body.dataset.locale = locale;
    translateDom(document, locale);

    const observer = new MutationObserver(() => translateDom(document, locale));
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: TRANSLATED_ATTRIBUTES
    });
    return () => observer.disconnect();
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t: (source: string, variables?: Record<string, string | number>) => translate(locale, source, variables)
  }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}

export function LanguageSelector() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const localeCodes: Record<Locale, string> = { en: "EN", hi: "HI", bn: "BN" };

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!selectorRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
    };
  }, [open]);

  return (
    <div className={`language-selector${open ? " is-open" : ""}`} ref={selectorRef}>
      <button aria-expanded={open} aria-haspopup="listbox" aria-label="Select language" className="language-selector-trigger" onClick={() => setOpen((current) => !current)} type="button">
        <svg aria-hidden="true" className="language-selector-globe" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M3.8 12h16.4M12 3.5c2.3 2.4 3.5 5.2 3.5 8.5S14.3 18.1 12 20.5M12 3.5C9.7 5.9 8.5 8.7 8.5 12s1.2 6.1 3.5 8.5" />
        </svg>
        <span className="language-selector-label">{localeLabels[locale]}</span>
        <span aria-hidden="true" className="language-selector-chevron"></span>
      </button>
      <div aria-label="Select language" className="language-selector-menu" role="listbox">
        <p>Select language</p>
        {(Object.keys(localeLabels) as Locale[]).map((item) => (
          <button aria-selected={locale === item} className="language-selector-option" key={item} onClick={() => { setLocale(item); setOpen(false); }} role="option" type="button">
            <span className="language-option-code">{localeCodes[item]}</span>
            <span>{localeLabels[item]}</span>
            <span aria-hidden="true" className="language-option-check">✓</span>
          </button>
        ))}
      </div>
    </div>
  );
}
