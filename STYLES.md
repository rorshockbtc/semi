# STYLES.md — Accént 3.0 Brand Adapter Contract (`semi` · Warm Sandstone & Prism Light)

> **Style Control Plane (`STYLES.md` vs. `AGENTS.md`)**: Operational agent rules live in `AGENTS.md`. All visual, typographic, chromatic, structural, and motion rules for **Semi (`; - ]`)** live here, in [`ART_DIRECTION.md`](./ART_DIRECTION.md), and in [`src/app/globals.css`](./src/app/globals.css).
> Canonical Spec: https://design.pipes.pink · Upstream Package: [`rorshockbtc/accent-ui`](https://github.com/rorshockbtc/accent-ui)

---

## 1. Visual & Chromatic Invariants (`Sunlit Sandstone & Prism Light`)

1. **Warm Sandstone Light Canvas (Never Clinical White)**:
   - **Layer 0 · Page Canvas (`--a-bg`)**: `#E8E2D5` (Warm Sandstone — attenuates 450nm blue sub-pixel glare).
   - **Layer 1 · Architectural Surface (`--a-surface` / `--a-card`)**: `#F3EFE9` (Archival Card).
   - **Layer 2 · Inner Reading & Audio Well (`--a-well`)**: `#FAF8F5` (dedicated song wells, persistent audio dock, and inputs).
   - **Primary Ink (`--a-ink`)**: `#111827` (Slate Ink — `12.6:1` WCAG AAA on `#E8E2D5` Sandstone).
   - **Muted Ink (`--a-muted`)**: `#4B5563` (`>= 5.1:1` WCAG AA on `#E8E2D5`).
   - **Hairlines (`--a-rule`)**: `rgba(17, 24, 39, 0.14)`.

2. **Sovereign Hot Pink (`#FE299E`) Focal Accent & Corporate `; - ]` Mark**:
   - **Mark & Primary CTA Fill (`--a-accent` / `--a-accent-fill`)**: `#FE299E`.
   - **Corporate Punctuation Mark (`SemiMark.tsx` / `Smile`)**: Always rendered in **`Bricolage Grotesque` Bold (`--font-mark`)**, **explicitly spaced (`; - ]`)**, and **uniformly Sovereign Hot Pink (`#FE299E`)**—matching `colonhyphenbracket.pink`.
   - **Inline Accessible Text (`--a-accent-text`)**: `#A3285C` (`>= 5.65:1` WCAG AA contrast on `#E8E2D5`).

3. **Typographic Voice (Bold Sculptural Feminine Editorial)**:
   - **Display (`--font-display`)**: `Playfair Display` (weights `600`, `700`; optical tracking `-0.03em`).
   - **Serif Italic & Lyrics (`--font-serif`)**: `Cormorant Garamond` (weights `400`, `500`, `600`, italic counterpoint inside headlines, pull-quotes, and song lyrics).
   - **UI & Essays (`--font-sans`)**: `Plus Jakarta Sans` (`16px–20px`, `line-height: 1.65`).
   - **Corporate Mark (`--font-mark`)**: `Bricolage Grotesque` (`700`, `800`).
   - **Code & Timecodes (`--font-jetbrains`)**: `JetBrains Mono` strictly for track numbers, timestamps, and git commands.

---

## 2. Layer 1 Mathematical & Accessibility Invariants

1. **8-Point Spatial Grid**: Multiples of `4px` / `8px`.
2. **Strict `13px` (`0.8125rem`) Typographic Floor**: `--text-xs` overridden to `0.8125rem`; zero `text-[10px]`, `text-[11px]`, or `text-[12px]` classes anywhere in `src/`.
3. **`44×44px` Minimum Interactive Touch Targets**: Enforced on every button, tab, link, range input, and dialog trigger.
4. **Zero Nested Cards (`card.no-nesting`)**: Sibling tracks and essays divide with `1px solid var(--a-rule)` hairlines and background steps.
5. **Native Top-Layer `<dialog closedby="any">`**: Portaled into `document.body` (`SemiDialogPortal.tsx`), opened via `.showModal()`, with mandatory Safari backdrop-bounds fallback.
6. **Accessible Motion (WCAG 2.2.2)**:
   - Continuous sparkles, shaders, marquees, and muted film loops pause cleanly via the header `"Pause motion"` / `"Play motion"` button without setting `aria-pressed`.
   - Scoped `@media (prefers-reduced-motion: reduce)` rules preserve clean static states without global `0.01ms` hacks.
