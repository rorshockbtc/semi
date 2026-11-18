# STYLES.md — Accént 3.0 Brand Adapter Contract (`semi` · Warm Sandstone & Prism Light)

> **Style Control Plane (`STYLES.md` vs. `AGENTS.md`)**: Operational agent rules live in `AGENTS.md`. All visual, typographic, chromatic, structural, and motion rules for **Semi (`;-]`)** live here, in [`ART_DIRECTION.md`](./ART_DIRECTION.md), and in [`src/app/globals.css`](./src/app/globals.css).
> Canonical Spec: https://design.pipes.pink · Upstream Package: [`rorshockbtc/accent-ui`](https://github.com/rorshockbtc/accent-ui)

---

## 1. Visual & Chromatic Invariants (`Sunlit Sandstone & Prism Light`)

1. **Warm Sandstone Light Canvas (Never Clinical White)**:
   - **Layer 0 · Page Canvas (`--a-bg`)**: `#E8E2D5` (Warm Sandstone — attenuates 450nm blue sub-pixel glare and feels like book paper rather than a backlit light box).
   - **Layer 1 · Architectural Surface (`--a-surface` / `--a-card`)**: `#F3EFE9` (Archival Card — subtle tonal step-up for listening rooms and lyric stages).
   - **Layer 2 · Inner Reading & Audio Well (`--a-well`)**: `#FAF8F5` (reserved strictly for inner lyric sheets, active audio transport wells, and input fields).
   - **Primary Ink (`--a-ink`)**: `#111827` (Slate Ink — `12.6:1` WCAG AAA on `#E8E2D5` Sandstone and `14.1:1` on `#F3EFE9` Card).
   - **Muted Ink (`--a-muted`)**: `#4B5563` (`>= 5.1:1` WCAG AA on `#E8E2D5`).
   - **Hairlines (`--a-rule`)**: `rgba(17, 24, 39, 0.14)` (`1px solid var(--a-rule)` dividers replace nested cards).

2. **Sovereign Hot Pink (`#FE299E`) Focal Accent (`color.one-focus`)**:
   - **Mark & Primary CTA Fill (`--a-accent` / `--a-accent-fill`)**: `#FE299E` (OLED-safe Sovereign Pink with crisp `#FFFFFF` ink, signature glow shadow, and `#111827` hover).
   - **Inline Accessible Text (`--a-accent-text`)**: `#A3285C` (`>= 5.65:1` WCAG AA contrast on `#E8E2D5` Sandstone).
   - Punctuation marks (`; - ]`, `:-]`, `*`), brush underlines (`.wc-link`), active audio waveform glow, and chapter progress indicators strictly anchor to `#FE299E` / `#A3285C`.

3. **Typographic Voice (Bold Sculptural Feminine Editorial)**:
   - **Display (`--font-display`)**: `Playfair Display` (weights `600`, `700`; optical tracking `-0.032em`; bold teardrop terminals).
   - **Serif Italic & Lyrics (`--font-serif`)**: `Cormorant Garamond` (weights `400`, `500`, `600`, italic counterpoint inside display headlines, pull-quotes, and song stanzas).
   - **UI & Prose (`--font-sans`)**: `Plus Jakarta Sans` (warm, approachable humanist sans at `16px–20px`, `line-height: 1.6`).
   - **Code & Timecodes (`--font-jetbrains`)**: `JetBrains Mono` strictly for timestamps (`02:33`), track numbers (`01`), and `$ git clone` commands.

---

## 2. Layer 1 Mathematical & Accessibility Invariants

1. **8-Point Spatial Grid**: Spacing and rhythm align to multiples of `4px` / `8px`.
2. **Strict `13px` (`0.8125rem`) Typographic Floor**: `--text-xs` overridden to `0.8125rem`; zero `text-[10px]`, `text-[11px]`, or `text-[12px]` classes anywhere in `src/`.
3. **`44×44px` Minimum Interactive Touch Targets**: Every button, link pill, tab, range input, and dialog trigger enforces `min-h-[44px]`.
4. **Zero Nested Cards (`card.no-nesting`)**: Sibling tracks, chapters, and footnotes separate with `1px solid var(--a-rule)` hairlines and background contrast rather than bordered cards inside cards.
5. **Native Top-Layer `<dialog closedby="any">`**: Lyric sheets and photo lightboxes portal into `document.body`, open with `.showModal()`, include a Safari backdrop coordinate fallback, and contain overscroll.
6. **Accessible Motion (WCAG 2.2.2 & `prefers-reduced-motion`)**:
   - Persistent ambient loops, shaders, and marquees respond to a visible **Pause / Play motion** control (`motionActive`) without toggling `aria-pressed` when the button label changes.
   - Reduced-motion overrides live scoped inside `@media (prefers-reduced-motion: reduce)` and `@media (prefers-reduced-motion: no-preference)`, never via global `animation-duration: 0.01ms`.
