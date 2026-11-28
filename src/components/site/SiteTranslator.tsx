'use client';

import { useEffect, useRef } from 'react';
import { useLyricsTranslation, type LyricsLang } from '@/components/songs/LyricsLanguageBar';

const CACHE_PREFIX = 'semi_ui_tr_v2_';
const SKIP_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'CODE',
  'PRE',
  'SVG',
  'TEXTAREA',
  'INPUT',
  'SELECT',
]);

const staticBundleCache = new Map<Exclude<LyricsLang, 'en'>, Record<string, string>>();
const staticInflight = new Map<Exclude<LyricsLang, 'en'>, Promise<Record<string, string>>>();

async function loadStaticUiBundle(
  lang: Exclude<LyricsLang, 'en'>
): Promise<Record<string, string>> {
  if (staticBundleCache.has(lang)) return staticBundleCache.get(lang)!;
  if (staticInflight.has(lang)) return staticInflight.get(lang)!;

  const p = fetch(`/translations/ui-${lang}.json`)
    .then((r) => (r.ok ? (r.json() as Promise<Record<string, string>>) : {}))
    .then((data) => {
      staticBundleCache.set(lang, data);
      staticInflight.delete(lang);
      return data;
    })
    .catch(() => {
      staticInflight.delete(lang);
      return {};
    });

  staticInflight.set(lang, p);
  return p;
}

function getCache(lang: Exclude<LyricsLang, 'en'>): Record<string, string> {
  try {
    const raw = window.localStorage.getItem(`${CACHE_PREFIX}${lang}`);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function saveCache(lang: Exclude<LyricsLang, 'en'>, map: Record<string, string>) {
  try {
    window.localStorage.setItem(`${CACHE_PREFIX}${lang}`, JSON.stringify(map));
  } catch {
    // Ignore storage quota errors
  }
}

function shouldTranslateNode(node: Text): boolean {
  const text = node.nodeValue?.trim();
  if (!text || text.length < 2) return false;
  if (/^[\d\s.,:/\-·•|()[\]{}]+$/.test(text)) return false;

  let el: HTMLElement | null = node.parentElement;
  while (el) {
    if (SKIP_TAGS.has(el.tagName)) return false;
    if (el.getAttribute('data-no-translate') === 'true') return false;
    el = el.parentElement;
  }
  return true;
}

export default function SiteTranslator() {
  const { lang } = useLyricsTranslation('io', '');
  const originalsRef = useRef<WeakMap<Text, string>>(new WeakMap());
  const activeNodesRef = useRef<Set<Text>>(new Set());
  const inflightRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const restoreAll = () => {
      for (const node of activeNodesRef.current) {
        const orig = originalsRef.current.get(node);
        if (orig !== undefined && node.isConnected) {
          node.nodeValue = orig;
        }
      }
    };

    if (lang === 'en') {
      restoreAll();
      document.documentElement.lang = 'en';
      return;
    }

    document.documentElement.lang = lang;
    let cancelled = false;
    let timer: number | null = null;

    const processDom = async () => {
      if (cancelled || !document.body) return;

      const staticMap = await loadStaticUiBundle(lang);
      if (cancelled) return;
      const localMap = getCache(lang);
      const merged: Record<string, string> = { ...localMap, ...staticMap };

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const allNodes: Array<{ node: Text; orig: string; trimmed: string }> = [];
      const missingTexts = new Set<string>();

      let current: Node | null;
      while ((current = walker.nextNode())) {
        const textNode = current as Text;
        if (!shouldTranslateNode(textNode)) continue;

        let orig = originalsRef.current.get(textNode);
        if (orig === undefined) {
          orig = textNode.nodeValue ?? '';
          originalsRef.current.set(textNode, orig);
          activeNodesRef.current.add(textNode);
        }

        const trimmed = orig.trim();
        if (!trimmed) continue;

        allNodes.push({ node: textNode, orig, trimmed });
        if (!merged[trimmed] && !inflightRef.current.has(`${lang}:${trimmed}`)) {
          missingTexts.add(trimmed);
        }
      }

      // Immediately apply all static + cached translations in a single paint frame
      for (const item of allNodes) {
        const tr = merged[item.trimmed];
        if (tr && item.node.isConnected) {
          const leading = item.orig.match(/^\s*/)?.[0] ?? '';
          const trailing = item.orig.match(/\s*$/)?.[0] ?? '';
          const nextVal = `${leading}${tr}${trailing}`;
          if (item.node.nodeValue !== nextVal) {
            item.node.nodeValue = nextVal;
          }
        }
      }

      if (missingTexts.size === 0) return;

      // Background fallback for any remaining dynamic UI strings not in the static bundle
      const missingList = Array.from(missingTexts).slice(0, 45);
      for (const t of missingList) inflightRef.current.add(`${lang}:${t}`);

      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lang, texts: missingList }),
        });
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as { translations?: Record<string, string> };
        const fresh = data.translations ?? {};

        let updated = false;
        for (const [k, v] of Object.entries(fresh)) {
          if (typeof v === 'string' && v.trim()) {
            localMap[k] = v.trim();
            merged[k] = v.trim();
            updated = true;
          }
        }
        if (updated) saveCache(lang, localMap);

        for (const item of allNodes) {
          const tr = merged[item.trimmed];
          if (tr && item.node.isConnected) {
            const leading = item.orig.match(/^\s*/)?.[0] ?? '';
            const trailing = item.orig.match(/\s*$/)?.[0] ?? '';
            item.node.nodeValue = `${leading}${tr}${trailing}`;
          }
        }
      } catch {
        // Ignore transient network errors
      } finally {
        for (const t of missingList) inflightRef.current.delete(`${lang}:${t}`);
      }
    };

    void processDom();

    const observer = new MutationObserver(() => {
      if (timer !== null) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        void processDom();
      }, 100);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      observer.disconnect();
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [lang]);

  return null;
}
