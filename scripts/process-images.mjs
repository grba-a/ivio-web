import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { MAP } from './media-map.mjs';

const SRC = join(homedir(), 'Desktop', 'slike_ivio');
const OUT = join(process.cwd(), 'public', 'media');

// Tiers chosen from CSS px x DPR, not round numbers:
// 390@2x=780, 430@3x=1290, 768@2x=1536->1600, desktop hero 2000.
const TIERS = [480, 780, 1080, 1290, 1600, 2000];

/**
 * One grade across the whole set so 23 phone photos read as one shoot.
 * Split tone: shadows cool toward the sea, highlights warm toward limestone.
 * Saturation pulled back so the neon pool noodles stop fighting the palette.
 */
const grade = (p) =>
  p
    .rotate()                                  // EXIF orientation 6 on 20/23 files
    .modulate({ saturation: 0.93, brightness: 1.01 })
    .linear([1.03, 1.0, 0.98], [-3, 0, 5])     // R+ / B- gain, R- / B+ lift
    .gamma(1.02);

const STAGE = join(process.cwd(), '.cache', 'heic');

/**
 * sharp reads HEIC metadata happily, then libheif dies decoding the pixels of
 * these particular iPhone files ("bad seek"). macOS has Apple's own decoder in
 * sips, so HEIC gets transcoded once to a high-quality JPEG and the rest of the
 * pipeline never has to know.
 */
const source = (file) => {
  const src = join(SRC, file);
  if (!/\.heic$/i.test(file)) return src;
  const staged = join(STAGE, `${file.replace(/\.[^.]+$/, '')}.jpg`);
  if (!existsSync(staged)) {
    execFileSync('/usr/bin/sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', 'best', src, '--out', staged], { stdio: 'ignore' });
  }
  return staged;
};

const run = async () => {
  await mkdir(OUT, { recursive: true });
  await mkdir(STAGE, { recursive: true });
  const files = (await readdir(SRC)).filter((f) => MAP[f]);
  const missing = Object.keys(MAP).filter((k) => !files.includes(k));
  if (missing.length) console.warn('! missing sources:', missing.join(', '));

  const manifest = {};

  for (const file of files) {
    const slug = MAP[file];
    const src = source(file);

    // metadata() reports the file as stored, NOT the rotated pipeline output.
    // 20 of 23 sources carry EXIF orientation 6, so swap the axes ourselves.
    const meta = await sharp(src).metadata();
    const swapped = [5, 6, 7, 8].includes(meta.orientation ?? 1);
    const width = swapped ? meta.height : meta.width;
    const height = swapped ? meta.width : meta.height;

    const widths = TIERS.filter((w) => w <= width);
    if (widths.length === 0) widths.push(width);

    for (const w of widths) {
      await grade(sharp(src))
        .resize({ width: w, kernel: 'lanczos3', withoutEnlargement: true })
        .sharpen({ sigma: 0.5, m1: 0.5, m2: 1.0 })
        // Big tiers only reach large desktops, where 78 buys detail nobody sees
        // but costs ~1.8 MB on foliage- and ripple-heavy frames.
        .webp({ quality: w >= 1600 ? 70 : 78, effort: 5 })
        .toFile(join(OUT, `${slug}-${w}.webp`));
    }

    // LQIP: inlined base64, so the blur-up costs zero requests.
    const lqipBuf = await grade(sharp(src))
      .resize({ width: 20 })
      .webp({ quality: 30 })
      .toBuffer();

    manifest[slug] = {
      width,
      height,
      aspect: +(width / height).toFixed(4),
      widths,
      lqip: `data:image/webp;base64,${lqipBuf.toString('base64')}`,
    };
    console.log(`${slug.padEnd(24)} ${width}x${height}  ${widths.join(',')}`);
  }

  await mkdir(join(process.cwd(), 'src', 'data'), { recursive: true });
  await writeFile(
    join(process.cwd(), 'src', 'data', 'media.json'),
    JSON.stringify(manifest, null, 2) + '\n'
  );
  console.log(`\n${Object.keys(manifest).length} images -> public/media, manifest -> src/data/media.json`);
};

run().catch((e) => { console.error(e); process.exit(1); });
