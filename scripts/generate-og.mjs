/**
 * Generate the Open Graph preview image.
 *
 * Output: `public/og-image.jpg` (1200×630, JPEG ~80 quality)
 *
 * Composition:
 *   - Base canvas: Bacara's #0a0a0a background
 *   - Champagne radial glow top-center (rgba(212,165,72,0.12))
 *   - Broadcast-red bloom upper-right (rgba(239,68,68,0.06))
 *   - Bacara logo (square) centered horizontally, slightly above vertical center
 *   - SVG text "MIAMI BEACH'S FIRST STREAMING NIGHTCLUB" below the logo
 *
 * The 1200×630 size is the standard OG / Twitter summary_large_image canvas. Run:
 *
 *     node scripts/generate-og.mjs
 *
 * Re-run any time the logo source or brand tagline changes.
 */

import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const W = 1200;
const H = 630;
const LOGO_SIZE = 260;

async function main() {
  // 1. Base canvas with the layered radial glows, rendered via an SVG since sharp
  //    handles SVG natively and we can describe the gradients declaratively.
  const baseSvg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="goldGlow" cx="50%" cy="10%" r="70%">
          <stop offset="0%" stop-color="rgba(212,165,72,0.22)" />
          <stop offset="55%" stop-color="rgba(212,165,72,0.05)" />
          <stop offset="100%" stop-color="rgba(212,165,72,0)" />
        </radialGradient>
        <radialGradient id="redBloom" cx="85%" cy="18%" r="45%">
          <stop offset="0%" stop-color="rgba(239,68,68,0.08)" />
          <stop offset="100%" stop-color="rgba(239,68,68,0)" />
        </radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="#0a0a0a" />
      <rect width="${W}" height="${H}" fill="url(#goldGlow)" />
      <rect width="${W}" height="${H}" fill="url(#redBloom)" />
    </svg>
  `;

  // 2. Tagline overlay — inline attributes only.
  //
  // sharp's SVG renderer (librsvg) has inconsistent support for both `<style>` blocks
  // AND `dominant-baseline="middle"`. The earlier version using both produced a
  // phantom rectangle below the pill because the text baseline fell outside the pill.
  // We now use:
  //   - inline font-family/size/weight attributes (no <style>)
  //   - explicit `y` positions aligned to the glyph baseline
  //   - computed pill geometry from constants for clarity
  const pillW = 260;
  const pillH = 40;
  const pillCx = W / 2;
  const pillCy = 180;
  const pillX = pillCx - pillW / 2;
  const pillY = pillCy - pillH / 2;
  // Text baseline is ~0.35 × font-size below the visual center for most sans-serif
  // fonts — 17px font → +6px offset gets us a visually centered line.
  const pillTextY = pillCy + 6;

  const taglineSvg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <!-- Eyebrow pill: ON AIR · WED & SAT -->
      <rect x="${pillX}" y="${pillY}" width="${pillW}" height="${pillH}" rx="${pillH / 2}"
            fill="rgb(18, 18, 18)" stroke="rgb(48, 48, 48)" stroke-width="1" />
      <circle cx="${pillCx - 88}" cy="${pillCy}" r="4" fill="#ef4444" />
      <text x="${pillCx + 10}" y="${pillTextY}" text-anchor="middle"
            font-family="-apple-system, 'Helvetica Neue', Arial, sans-serif"
            font-size="17" font-weight="500" letter-spacing="3"
            fill="#9a9a9a">ON AIR &#183; WED &amp; SAT</text>

      <!-- Tagline -->
      <text x="${W / 2}" y="495" text-anchor="middle"
            font-family="Georgia, 'Times New Roman', serif"
            font-size="44" font-weight="500"
            fill="#f5f5f5">Miami Beach&apos;s First Streaming Nightclub</text>

      <!-- Sub-tagline -->
      <text x="${W / 2}" y="545" text-anchor="middle"
            font-family="-apple-system, 'Helvetica Neue', Arial, sans-serif"
            font-size="15" font-weight="500" letter-spacing="2.5"
            fill="#9a9a9a">BACARACLUB.COM &#183; 235 23RD ST &#183; MIAMI BEACH</text>
    </svg>
  `;

  // 3. Render: base canvas → composite logo and tagline on top
  //
  // We use the WHITE-on-transparent icon source (not the filled navy square) so the
  // logo sits cleanly on the dark radial canvas without a visible bounding box.
  // The 1100×1000 source scales down beautifully with lanczos3.
  //
  // CRITICAL: fit: "contain" adds padding when the source aspect doesn't match the
  // target aspect (1100×1000 source, 260×260 target → 12px vertical padding). Sharp
  // defaults that padding to OPAQUE BLACK, which was rendering visible black bars
  // on the final OG image. Force `alpha: 0` so the padding is transparent.
  const logoBuffer = await sharp("brand/bacara-icon-white.png")
    .resize(LOGO_SIZE, LOGO_SIZE, {
      kernel: "lanczos3",
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png() // force PNG output so the alpha channel survives
    .toBuffer();

  const og = await sharp(Buffer.from(baseSvg))
    .composite([
      {
        input: logoBuffer,
        left: Math.round((W - LOGO_SIZE) / 2),
        top: 230,
      },
      {
        input: Buffer.from(taglineSvg),
        left: 0,
        top: 0,
      },
    ])
    .jpeg({ quality: 85, progressive: true, mozjpeg: true })
    .toBuffer();

  await writeFile("public/og-image.jpg", og);

  const meta = await sharp("public/og-image.jpg").metadata();
  console.log(
    `Generated public/og-image.jpg — ${meta.width}×${meta.height}, ${(og.length / 1024).toFixed(1)} KB`,
  );
}

main().catch((err) => {
  console.error("OG image generation failed:", err);
  process.exit(1);
});
