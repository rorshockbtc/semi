'use client';

import { useEffect, useRef } from 'react';
import { useLyricsTranslation, type LyricsLang } from '@/components/songs/LyricsLanguageBar';

const CACHE_PREFIX = 'semi_ui_tr_v1_';
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'SVG', 'TEXTAREA', 'INPUT', 'SELECT']);

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
    // Restore original English text whenever switching back to EN (or before re-translating)
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
    const cache = getCache(lang);
    let cancelled = false;
    let timer: number | null = null;

    const processDom = async () => {
      if (cancelled || !document.body) return;

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const pendingNodes: Array<{ node: Text; orig: string; trimmed: string }> = [];
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

        const translated = cache[trimmed];
        if (translated) {
          const leading = orig.match(/^\s*/)?.[0] ?? '';
          const trailing = orig.match(/\s*$/)?.[0] ?? '';
          const nextVal = `${leading}${translated}${trailing}`;
          if (textNode.nodeValue !== nextVal) {
            textNode.nodeValue = nextVal;
          }
        } else if (!inflightRef.current.has(`${lang}:${trimmed}`)) {
          pendingNodes.push({ node: textNode, orig, trimmed });
          missingTexts.add(trimmed);
        }
      }

      if (missingTexts.size === 0) return;

      const batch = Array.from(missingTexts).slice(0, 60);
      for (const t of batch) inflightRef.current.add(`${lang}:${t}`);

      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lang, texts: batch }),
        });
        if (!res.ok) return;
        const data = (await res.json()) as { translations?: Record<string, string> };
        const map = data.translations ?? {};
        if (cancelled) return;

        let updated = false;
        for (const [k, v] of Object.entries(map)) {
          if (typeof v === 'string' && v.trim()) {
            cache[k] = v.trim();
            updated = true;
          }
        }
        if (updated) saveCache(lang, cache);

        for (const item of pendingNodes) {
          const tr = cache[item.trimmed];
          if (tr && item.node.isConnected) {
            const leading = item.orig.match(/^\s*/)?.[0] ?? '';
            const trailing = item.orig.match(/\s*$/)?.[0] ?? '';
            item.node.nodeValue = `${leading}${tr}${trailing}`;
          }
        }
      } catch {
        // Ignore transient translation network errors
      } finally {
        for (const t of batch) inflightRef.current.delete(`${lang}:${t}`);
      }
    };

    restoreAll();
    void processDom();

    const observer = new MutationObserver(() => {
      if (timer !== null) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        void processDom();
      }, 120);
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
