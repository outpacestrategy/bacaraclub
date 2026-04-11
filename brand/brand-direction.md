# Bacara Club — Brand & Visual Direction

## Positioning
Miami Beach's first streaming nightclub. Always on air. Built for creators, backed by Clavicular.

## Tone of voice
- Confident, not cocky
- Cinematic, not salesy
- Short sentences. Punchy headlines. Room to breathe.
- Never uses exclamation points in headlines. Let the footage carry the energy.
- Always names the two nights: Wednesday and Saturday. Repetition is positioning.

## Visual system (for the website build)

Per the `create-website` skill's non-negotiables:
- **Dark-themed by default** — near-black `#0a0a0a` body background with radial glow
- **Delius** (Google Font) for display/headings — loaded via `next/font/google`
- **Inter** for body copy
- **No emoji icons** — Lucide React or custom SVGs only
- **No generic gradients** — any gradient must be intentional (radial glow, mesh, directional accent)
- **Subtle animations** — Framer Motion blur-reveals for content, GSAP ScrollTrigger for section entrances
- **Spline 3D hero background** — abstract motion/particles that evoke broadcast waveforms
- **Three.js wireframe globe** in the CTA section per the skill's spec

## Color palette (proposal — confirm with Clavicular's team)

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#0a0a0a` | Body background |
| `--bg-elevated` | `#131313` | Cards, elevated surfaces |
| `--fg` | `#f5f5f5` | Primary text |
| `--fg-muted` | `#9a9a9a` | Secondary text |
| `--accent` | `#d4a548` (champagne gold) | CTAs, highlights, borders |
| `--accent-glow` | `rgba(212, 165, 72, 0.25)` | Shadows, button glows, radial overlays |
| `--live` | `#ef4444` (broadcast red) | "Live now," on-air indicators, stream badges |
| `--border` | `rgba(255,255,255,0.08)` | Dividers, card outlines |

The champagne-gold + broadcast-red combination reinforces the two identities: *luxury bottle club* and *always-streaming broadcast venue*. Red is used sparingly — only for live indicators and broadcast badges — so it carries signal weight.

## Typography scale

- `h1` — Delius, clamp(3rem, 7vw, 6rem), tight tracking
- `h2` — Delius, clamp(2rem, 4vw, 3.5rem)
- `h3` — Delius, 1.75rem
- `body` — Inter, 1rem, 1.6 line-height
- `small` — Inter, 0.875rem
- `caps` — Inter, 0.75rem, 0.12em tracking, uppercase — use for section eyebrows

## Imagery direction

- Low-light, high-contrast, warm highlights
- Motion blur is welcome — it reads "in the moment"
- Avoid stock nightlife photography at all costs
- Primary sources: Bacara's existing IG archive (@bacaraclub), new shoots on upcoming Wed/Sat nights, UGC from attending creators
- Every photo or video should feel like it was pulled from a livestream

## Motion language

- Blur-to-sharp reveals on text (Framer Motion `filter: blur(8px) → blur(0)`)
- Slow, confident GSAP scroll-triggered section fades from y+40
- Continuous subtle motion in the background (Spline scene rotation, particle drift)
- Pulsing "LIVE" dot on stream indicators (Framer Motion `scale: [1, 1.2, 1]`, 2s loop)
- No bounces, no elastic springs except on confirmation states
- Respects `prefers-reduced-motion`

## What we're NOT
- Not another nightclub template with a full-bleed DJ hero and four sections of bullet points
- Not bright / neon / loud-colored — that's E11EVEN's lane
- Not minimal-luxe white-on-white — that's Fontainebleau's lane
- Not a social-feed clone — the IG embed is one section, not the whole site

## What we ARE
- A broadcast deck. Every page feels like the pre-show screen of a livestream.
- A reservation engine. Every element is subordinate to "Reserve a Table."
- A creator magnet. The streamer program is visible, not buried.
