# Local fonts

This directory is the home for any `.ttf` / `.otf` / `.woff2` files we load via
`next/font/local`. It is currently empty because the project's display face is
loaded from Google Fonts (Bodoni Moda) via `next/font/google` in
`src/app/layout.tsx`.

## Why the empty directory exists

The client originally asked for the [Vogue font by Vladimir Nikolic](https://www.dafont.com/vogue.font).
That font is **free for personal use only** — commercial use requires a paid
license from Creative Fabrica. Since the Bacara Club website is a commercial
project, we can't ship the dafont download as-is. Instead we're using Bodoni
Moda (SIL Open Font License, free for commercial use) as the closest visually
matching substitute.

If the client later purchases a commercial license, swap in the real Vogue file
with the steps below.

## Swapping in Vogue (or any other local font) later

**Step 1.** Buy a commercial license. Drop the licensed `Vogue.ttf` (or the
purchased variant files) into this directory:

```
src/styles/fonts/Vogue.ttf
```

**Step 2.** In `src/app/layout.tsx`, replace the `Bodoni_Moda` import with a
`next/font/local` call that points at the file:

```ts
// Remove this:
import { Bodoni_Moda, Inter } from "next/font/google";

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Add this:
import { Inter } from "next/font/google";
import localFont from "next/font/local";

const vogue = localFont({
  src: "../../styles/fonts/Vogue.ttf",
  variable: "--font-display",
  display: "swap",
});
```

Then update the `<html>` className so `${bodoniModa.variable}` becomes
`${vogue.variable}`.

**Step 3.** In `src/app/globals.css`, revisit the `font-weight: 500` rules on
`h1–h6`. Bodoni Moda is a variable font with soft strokes at weight 500;
Vogue ships as a single cut and may look heavier or lighter at the same size.
Tune the heading weight to whatever feels right with the purchased font.

**Step 4.** Commit the license PDF alongside the font file (or keep it in the
client's shared drive with a pointer here) so future maintainers can confirm
provenance.

## Fonts currently shipped via `next/font/google`

| Role | Family | Weights | CSS variable |
|---|---|---|---|
| Display / headings | Bodoni Moda | 400, 500, 600, 700 | `--font-display` |
| Body | Inter | variable | `--font-inter` |

Both are imported in `src/app/layout.tsx` and surfaced to Tailwind v4 through
the `@theme` block in `src/app/globals.css`.
