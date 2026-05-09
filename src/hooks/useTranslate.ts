import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const CACHE_KEY = "th_i18n_cache_v1";
type Cache = Record<string, Record<string, string>>; // { lang: { en: translated } }

const loadCache = (): Cache => {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch { return {}; }
};
const saveCache = (c: Cache) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch {}
};

// Batch queue so multiple useT() calls in the same tick share one request
type PendingItem = { text: string; lang: string; resolve: (v: string) => void };
let queue: PendingItem[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

const flush = async () => {
  flushTimer = null;
  const items = queue;
  queue = [];
  // group by language
  const byLang: Record<string, PendingItem[]> = {};
  for (const it of items) (byLang[it.lang] ||= []).push(it);

  for (const [lang, group] of Object.entries(byLang)) {
    const uniqueTexts = Array.from(new Set(group.map((g) => g.text)));
    try {
      const { data, error } = await supabase.functions.invoke("translate-text", {
        body: { texts: uniqueTexts, target: lang },
      });
      if (error) throw error;
      const translations: string[] = data?.translations || uniqueTexts;
      const map: Record<string, string> = {};
      uniqueTexts.forEach((t, i) => { map[t] = translations[i] || t; });
      // persist
      const cache = loadCache();
      cache[lang] = { ...(cache[lang] || {}), ...map };
      saveCache(cache);
      // resolve waiters
      group.forEach((g) => g.resolve(map[g.text] || g.text));
    } catch {
      group.forEach((g) => g.resolve(g.text));
    }
  }
};

const requestTranslation = (text: string, lang: string): Promise<string> =>
  new Promise((resolve) => {
    queue.push({ text, lang, resolve });
    if (!flushTimer) flushTimer = setTimeout(flush, 80);
  });

/** Translate a single English string to the active language. Cached in localStorage. */
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
