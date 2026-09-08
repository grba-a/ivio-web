import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import ffmpeg from 'ffmpeg-static';
import sharp from 'sharp';

const SRC = join(homedir(), 'Desktop', 'slike_ivio');
const OUT = join(process.cwd(), 'public', 'media');
mkdirSync(OUT, { recursive: true });

// Same grade as the stills, so video and photography read as one set.
// No vignette: it injects RGB noise that wrecks VP9 compression.
const GRADE = 'eq=saturation=0.93:gamma=1.02,colorbalance=rs=-0.02:bs=0.04:rh=0.03:bh=-0.02';

const CLIPS = [
  { file: 'IMG_4547.MOV', slug: 'coast-run', ss: '0', t: '8' },
  { file: 'IMG_4856.MOV', slug: 'cave-glide', ss: '5', t: '8' },
];

const ff = (args) => execFileSync(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', ...args]);
const kb = (p) => Math.round(statSync(p).size / 1024);

const manifest = {};

for (const { file, slug, ss, t } of CLIPS) {
  const src = join(SRC, file);
  const vf = `scale=720:-2,${GRADE}`;

  const mp4 = join(OUT, `${slug}.mp4`);
  ff(['-ss', ss, '-t', t, '-i', src, '-an', '-vf', vf,
      '-c:v', 'libx264', '-profile:v', 'high', '-crf', '29', '-preset', 'slow',
      '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4]);

  // Poster must be the first rendered frame, or the swap to video flickers.
  const posterPng = join(OUT, `${slug}-poster.png`);
  ff(['-ss', ss, '-i', src, '-frames:v', '1', '-vf', vf, posterPng]);
  const posterBuf = await sharp(posterPng).webp({ quality: 74 }).toBuffer();
  writeFileSync(join(OUT, `${slug}-poster.webp`), posterBuf);
  const meta = await sharp(posterPng).metadata();
  const lqip = await sharp(posterPng).resize({ width: 20 }).webp({ quality: 30 }).toBuffer();
  execFileSync('/bin/rm', [posterPng]);

  manifest[slug] = {
    width: meta.width,
    height: meta.height,
    aspect: +(meta.width / meta.height).toFixed(4),
    lqip: `data:image/webp;base64,${lqip.toString('base64')}`,
  };

  console.log(`${slug.padEnd(12)} ${meta.width}x${meta.height}  mp4 ${kb(mp4)}KB  poster ${Math.round(posterBuf.length/1024)}KB`);
}

const p = join(process.cwd(), 'src', 'data', 'video.json');
writeFileSync(p, JSON.stringify(manifest, null, 2) + '\n');
console.log('\nmanifest -> src/data/video.json');
