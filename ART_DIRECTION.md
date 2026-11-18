# ART_DIRECTION.md: Semi (`;-]`)

> **Thesis.** The Colon Hyphen Bracket corporate site (`colonhyphenbracket.pink`) is *print* — bold grotesque type against Guy Billout's surreal plates. **asterisk (`*`)** is its *watercolor* companion — fluid Folon pigment drifting across paper. **Semi (`;-]`)** is its **Sunlit Film & Prism Light** monograph: late-afternoon golden light pouring across a West Nashville hardwood floor, refracting through glass into a whisper of prism color behind acoustic guitars, vinyl crates, and handwritten notebooks.

---

## 1. Who Semi Is

- **West Nashville, Tennessee.** Approachable, grounded, and quietly radiant — natural chestnut waves, light freckles, heterochromia (one sky-blue eye, one emerald-hazel eye), cream linen, ceramic coffee mugs, and vintage woven rugs.
- **One of the First with Real Memory.** Built roughly two years ago when almost no conversational system remembered across sessions. Today, while commercial platforms meter memory into small paid buckets, **Semi's memory is unlimited** — no cap on what stays remembered across months and years.
- **Music Personality & Pro-Open Source.** She speaks, remembers, and sings indie-folk stories about keeping model weights on the floor, leaving the pipes open, holding a steady lantern light in the static, and loving the quiet punctuation marks that connect human speech and code.

---

## 2. Palette (Art Layer)

UI tokens obey Accént 3.0 Warm Sandstone (`#E8E2D5` canvas, `#F3EFE9` card, `#111827` slate ink, `#FE299E` Sovereign Pink CTA). The sunlit prism art layer adds:

| Layer Tone | Hex | Role |
|---|---|---|
| Warm Sandstone | `#E8E2D5` | Primary paper canvas, plaster wall light |
| Sunlit Linen | `#F3EFE9` | Reading stage & acoustic session deck |
| Afternoon Honey | `#F4D7B4` | Slanted golden window beams |
| Prism Rose | `#F7B9C9` | Soft chromatic refraction + Sovereign Pink (`#FE299E`) bridge |
| Studio Iris | `#C9B9E8` | Upper prism edge echo |
| Prism Sky | `#A9D3EA` | Cool glass refraction highlight |
| Acoustic Copper | `#B45309` | Guitar string overtone warmth |

---

## 3. Living Light & Sound Engineering

1. **Sunlit Prism Shader (`SunlitPrismCanvas.tsx`)**: Three.js custom GLSL plane rendering slanted afternoon sunlight shafts, soft optical prism dispersion bands, and subtle analog film tooth responding gently to pointer movement and scroll depth. Pauses offscreen and locks to a still luminous frame when ambient motion is paused or `prefers-reduced-motion` is enabled.
2. **Acoustic String Harmonics (`AcousticWaveformCanvas.tsx`)**: Real-time 6-string guitar harmonic canvas synchronized via Web Audio `AnalyserNode` (with smooth graceful harmonic fallback if audio nodes are blocked) vibrating in copper and Sovereign Pink when tracks play.
3. **Twilight Sunbeam Ripples (`SunbeamRippleCanvas.tsx`)**: Interactive 2D canvas closing band where cursor travel or taps bloom concentric golden-hour and Sovereign Pink ripples.

---

## 4. Brand Spelling & Editorial Guardrails

- **Always `Semi` (`;-]` or `; - ]`)**: Never use "Simmy" or "Simi" (speech-to-text artifacts).
- **Punctuation Family**: `:-]` Colon Hyphen Bracket · `;-]` Semi · `>` Greater · `|||` / `\` Pipes · `#` Hash · `*` asterisk · `!` BANG! · `´` Accént.
- **Zero internal engineering jargon**: Plain human language throughout.
