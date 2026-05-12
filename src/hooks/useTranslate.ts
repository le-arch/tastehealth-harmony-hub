import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const CACHE_KEY = "th_i18n_cache_v1";
const FAIL_KEY = "th_i18n_fail_v1"; // remember temporary failures to avoid spamming
type Cache = Record<string, Record<string, string>>;

const loadCache = (): Cache => {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch { return {}; }
};
const saveCache = (c: Cache) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch {}
};
const loadFails = (): Record<string, number> => {
  try { return JSON.parse(sessionStorage.getItem(FAIL_KEY) || "{}"); } catch { return {}; }
};
const saveFails = (f: Record<string, number>) => {
  try { sessionStorage.setItem(FAIL_KEY, JSON.stringify(f)); } catch {}
};

// ---- Placeholder preservation ----
// Protect tokens like {count}, {{name}}, %s, %d, %1$s, <0>...</0>, emojis, URLs, and numbers w/ units
const PLACEHOLDER_REGEX = /(\{\{?[^{}]+?\}?\}|%[0-9]*\$?[sdif]|<\d+>[^<]*<\/\d+>|https?:\/\/\S+)/g;

type Masked = { masked: string; tokens: string[] };
const mask = (text: string): Masked => {
  const tokens: string[] = [];
  const masked = text.replace(PLACEHOLDER_REGEX, (m) => {
    tokens.push(m);
    return `__PH${tokens.length - 1}__`;
  });
  return { masked, tokens };
};
const unmask = (text: string, tokens: string[]): string => {
  let out = text;
  // Tolerate spacing/casing variants that some models may emit
  tokens.forEach((tok, i) => {
    const variants = [
      new RegExp(`__PH${i}__`, "g"),
      new RegExp(`__\\s*PH\\s*${i}\\s*__`, "gi"),
      new RegExp(`\\{\\s*PH${i}\\s*\\}`, "gi"),
    ];
    variants.forEach((r) => { out = out.replace(r, tok); });
  });
  return out;
};

// ---- Batched request queue ----
type PendingItem = { text: string; lang: string; resolve: (v: string) => void };
let queue: PendingItem[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

const flush = async () => {
  flushTimer = null;
  const items = queue;
  queue = [];
  const byLang: Record<string, PendingItem[]> = {};
  for (const it of items) (byLang[it.lang] ||= []).push(it);

  for (const [lang, group] of Object.entries(byLang)) {
    const uniqueTexts = Array.from(new Set(group.map((g) => g.text)));
    // Mask placeholders before sending
    const maskedPairs = uniqueTexts.map((t) => ({ original: t, ...mask(t) }));
    const payload = maskedPairs.map((p) => p.masked);

    let translatedMap: Record<string, string> = {};
    let failed = false;

    try {
      const { data, error } = await supabase.functions.invoke("translate-text", {
        body: { texts: payload, target: lang },
      });
      if (error) throw error;
      const items: string[] = data?.translations || payload;
      maskedPairs.forEach((p, i) => {
        const t = unmask(items[i] || p.masked, p.tokens);
        translatedMap[p.original] = t || p.original;
      });
    } catch {
      failed = true;
    }

    if (failed) {
      // Graceful fallback: keep English text, but remember failures so we don't re-spam this session
      const fails = loadFails();
      uniqueTexts.forEach((t) => { fails[`${lang}::${t}`] = Date.now(); });
      saveFails(fails);
      group.forEach((g) => g.resolve(g.text));
      continue;
    }

    const cache = loadCache();
    cache[lang] = { ...(cache[lang] || {}), ...translatedMap };
    saveCache(cache);
    group.forEach((g) => g.resolve(translatedMap[g.text] || g.text));
  }
};

const FAIL_COOLDOWN_MS = 5 * 60 * 1000; // retry failed strings after 5 minutes

const requestTranslation = (text: string, lang: string): Promise<string> =>
  new Promise((resolve) => {
    const fails = loadFails();
    const failedAt = fails[`${lang}::${text}`];
    if (failedAt && Date.now() - failedAt < FAIL_COOLDOWN_MS) {
      resolve(text);
      return;
    }
    queue.push({ text, lang, resolve });
    if (!flushTimer) flushTimer = setTimeout(flush, 80);
  });

/** Translate a single English string to the active language. Cached & placeholder-safe. */
export function useT(text: string): string {
  const { language } = useLanguage();
  const [out, setOut] = useState<string>(() => {
    if (!text) return text;
    if (language === "en") return text;
    const cache = loadCache();
    return cache[language]?.[text] ?? text;
  });

  useEffect(() => {
    if (!text || language === "en") { setOut(text); return; }
    const cache = loadCache();
    const hit = cache[language]?.[text];
    if (hit) { setOut(hit); return; }
    let cancelled = false;
    requestTranslation(text, language).then((v) => { if (!cancelled) setOut(v); });
    return () => { cancelled = true; };
  }, [text, language]);

  return out;
}
