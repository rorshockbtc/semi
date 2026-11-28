'use client';

import { useEffect, useRef } from 'react';
import { useLyricsTranslation, type LyricsLang } from '@/components/songs/LyricsLanguageBar';

const CACHE_PREFIX = 'semi_ui_tr_v1_';
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

function setMainTransitionOpacity(value: string) {
  const main = document.querySelector('main');
  if (!main) return;
  main.style.transition = 'opacity 160ms ease';
  main.style.opacity = value;
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
      setMainTransitionOpacity('1');
      document.documentElement.lang = 'en';
      return;
    }

    document.documentElement.lang = lang;
    const cache = getCache(lang);
    let cancelled = false;
    let timer: number | null = null;

    const applyTranslations = (
      nodes: Array<{ node: Text; orig: string; trimmed: string }>
    ) => {
      for (const item of nodes) {
        const tr = cache[item.trimmed];
        if (tr && item.node.isConnected) {
          const leading = item.orig.match(/^\s*/)?.[0] ?? '';
          const trailing = item.orig.match(/\s*$/)?.[0] ?? '';
          const nextVal = `${leading}${tr}${trailing}`;
          if (item.node.nodeValue !== nextVal) {
            item.node.nodeValue = nextVal;
          }
        }
      }
    };

    const processDom = async () => {
      if (cancelled || !document.body) return;

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
        if (!cache[trimmed] && !inflightRef.current.has(`${lang}:${trimmed}`)) {
          missingTexts.add(trimmed);
        }
      }

      // Immediately apply everything already cached (zero flicker)
      applyTranslations(allNodes);

      if (missingTexts.size === 0) {
        setMainTransitionOpacity('1');
        return;
      }

      // Subtle fade while fetching uncached strings in parallel chunks of 45
      setMainTransitionOpacity('0.72');

      const missingList = Array.from(missingTexts);
      const chunks: string[][] = [];
      for (let i = 0; i < missingList.length; i += 45) {
        chunks.push(missingList.slice(i, i + 45));
      }

      for (const t of missingList) inflightRef.current.add(`${lang}:${t}`);

      try {
        const results = await Promise.all(
          chunks.map(async (chunk) => {
            try {
              const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lang, texts: chunk }),
              });
              if (!res.ok) return {};
              const data = (await res.json()) as { translations?: Record<string, string> };
              return data.translations ?? {};
            } catch {
              return {};
            }
          })
        );

        if (cancelled) return;

        let updated = false;
        for (const map of results) {
          for (const [k, v] of Object.entries(map)) {
            if (typeof v === 'string' && v.trim()) {
              cache[k] = v.trim();
              updated = true;
            }
          }
        }
        if (updated) saveCache(lang, cache);

        // Apply all translated nodes in a single paint frame
        applyTranslations(allNodes);
      } finally {
        for (const t of missingList) inflightRef.current.delete(`${lang}:${t}`);
        if (!cancelled) setMainTransitionOpacity('1');
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
      setMainTransitionOpacity('1');
    };
  }, [lang]);

  return null;
}
