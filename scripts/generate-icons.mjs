/**
 * Generate the full favicon + logo asset set from Bacara brand sources.
 *
 * Next.js App Router picks up certain filenames in src/app/ as icon conventions:
 *   - src/app/icon.png          → primary favicon, Next serves at its native size
 *   - src/app/apple-icon.png    → apple touch icon, served as 180x180
 *
 * Anything in /public/brand/ is a plain asset path we can reference from React.
 *
 * Source strategy:
 *   - MIDBLUE (1100×1000 JPG, no alpha) — filled navy square. Used for favicons and
 *     anywhere we need a guaranteed opaque background (iOS home screen, Android icons,
 *     NightClub schema image reference).
 *   - WHITE WORDMARK (1100×507 PNG with alpha) — landscape "trident + BACARA" composition
 *     on transparent background. Used by the Header and Footer on the live site, where
 *     it floats on the dark page background with no surrounding box.
 *   - WHITE ICON (1100×1000 PNG with alpha) — square variant of the full composition on
 *     transparent. Used by the OG image pipeline for clean compositing on dark canvas.
 *
 * Run: node scripts/generate-icons.mjs  (or npm run generate:icons)
 */

import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import sharp from "sharp";

const SOURCES = {
  midblue: "brand/bacara-logo-midblue.jpg",
  wordmarkWhite: "brand/bacara-wordmark-white.png",
};

/**
 * Targets are grouped by source file. Each target preserves aspect ratio where it
 * matters (wordmark keeps 2.17:1, filled square stays square).
 */
const TARGETS = [
  // Filled navy square (for favicons) — Next.js conventions
  {
    source: SOURCES.midblue,
    out: "src/app/icon.png",
    width: 512,
    height: 512,
    fit: "cover",
  },
  {
    source: SOURCES.midblue,
    out: "src/app/apple-icon.png",
    width: 180,
    height: 180,
    fit: "cover",
  },
  // Filled navy square — referenced by NightClubSchema + OG composition base
  {
    source: SOURCES.midblue,
    out: "public/brand/bacara-logo.png",
    width: 512,
    height: 512,
    fit: "cover",
  },
  // Landscape white wordmark on transparent — Header + Footer on live site.
  // Width tuned to 1024 so Footer at 174px × 2 DPR = 348px stays well within
  // the generated resolution, and the file stays under ~60 KB.
  {
    source: SOURCES.wordmarkWhite,
    out: "public/brand/bacara-wordmark.png",
    width: 1024,
    height: 472, // 1024 × (507/1100) = 471.9
    fit: "contain",
  },
];

async function ensureDir(filePath) {
  await mkdir(dirname(filePath), { recursive: true });
}

async function run() {
  for (const src of Object.values(SOURCES)) {
    const meta = await sharp(src).metadata();
    console.log(`Source: ${src} — ${meta.width}×${meta.height} ${meta.format}`);
  }
  console.log("");

  for (const target of TARGETS) {
    await ensureDir(target.out);
    await sharp(target.source)
      .resize(target.width, target.height, {
        kernel: "lanczos3",
        fit: target.fit,
        position: "center",
        // On the wordmark (contain), keep the transparent background so the alpha
        // channel survives into the output PNG.
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(target.out);
    console.log(
      `  → ${target.out} (${target.width}×${target.height}, ${target.fit})`,
    );
  }

  console.log("\nDone.");
}

run().catch((err) => {
  console.error("Icon generation failed:", err);
  process.exit(1);
});
