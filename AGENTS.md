# AGENTS.md — Semi (`;-]`) Operational Guide

1. **Identity Guardrail**: Her name is strictly **Semi (`;-]`)**. Never write "Simmy" or "Simi" anywhere in code, docs, tests, or copy.
2. **Design System Compliance (`STYLES.md`)**:
   - Warm Sandstone `#E8E2D5` page canvas, `#F3EFE9` archival surface, `#FAF8F5` inner wells only.
   - `#111827` Slate Ink (`12.6:1` WCAG AAA), `#FE299E` Sovereign Hot Pink CTAs, `#A3285C` inline pink text (`>= 4.5:1` WCAG AA).
   - Strict `13px` (`0.8125rem`) minimum font size and `44×44px` minimum touch targets.
   - Zero nested cards (`card.no-nesting`).
   - Top-layer `<dialog closedby="any">` via React Portal for modals, including Safari backdrop fallback.
3. **Verification Commands**:
   - `npm run test:unit` (media integrity, design-system contract, brand spelling)
   - `npm run build` (Next.js 16 production build)
   - `npm run test:e2e` (Playwright UX & JTBD suites on `1440×900` & `390×844`)

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
