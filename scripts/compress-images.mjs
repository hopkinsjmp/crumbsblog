/**
 * compress-images.mjs
 * Compresses all images in public/uploads that are over a size threshold.
 * - JPEGs/JPGs: re-encoded at quality 82, max 1200px wide
 * - PNGs: converted to JPEG at quality 85, max 1200px wide
 * - WebP: re-encoded at quality 82, max 1200px wide
 *
 * Run: node scripts/compress-images.mjs
 * Optional flag: --threshold=200 (KB, default 300)
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '../public/uploads');
const MAX_WIDTH = 1200;
const JPEG_QUALITY = 82;

const args = process.argv.slice(2);
const thresholdArg = args.find(a => a.startsWith('--threshold='));
const THRESHOLD_KB = thresholdArg ? parseInt(thresholdArg.split('=')[1]) : 300;
const THRESHOLD_BYTES = THRESHOLD_KB * 1024;

function getAllImages(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllImages(full));
    } else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

async function compressImage(filePath) {
  const stat = fs.statSync(filePath);
  if (stat.size < THRESHOLD_BYTES) return null;

  const ext = path.extname(filePath).toLowerCase();
  const isPng = ext === '.png';
  const sizeBefore = stat.size;

  try {
    let pipeline = sharp(filePath).resize({ width: MAX_WIDTH, withoutEnlargement: true });

    let outputPath = filePath;
    if (isPng) {
      // Convert PNG -> JPEG (saves a lot)
      outputPath = filePath.replace(/\.png$/i, '.jpg');
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
    } else if (ext === '.webp') {
      pipeline = pipeline.webp({ quality: JPEG_QUALITY });
    } else {
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
    }

    const buffer = await pipeline.toBuffer();

    // Only write if we actually made it smaller
    if (buffer.length < sizeBefore) {
      fs.writeFileSync(outputPath, buffer);
      if (isPng && outputPath !== filePath) {
        fs.unlinkSync(filePath); // remove original PNG
      }
      return {
        file: path.relative(process.cwd(), filePath),
        newFile: path.relative(process.cwd(), outputPath),
        before: sizeBefore,
        after: buffer.length,
        saved: sizeBefore - buffer.length,
      };
    }
    return null;
  } catch (err) {
    console.error(`  ✗ Failed: ${filePath} — ${err.message}`);
    return null;
  }
}

const images = getAllImages(UPLOADS_DIR);
console.log(`\nFound ${images.length} images. Compressing those over ${THRESHOLD_KB}KB...\n`);

let totalSaved = 0;
let count = 0;

for (const img of images) {
  const result = await compressImage(img);
  if (result) {
    count++;
    totalSaved += result.saved;
    const beforeKB = (result.before / 1024).toFixed(0);
    const afterKB = (result.after / 1024).toFixed(0);
    const savedKB = (result.saved / 1024).toFixed(0);
    const label = result.file === result.newFile ? result.file : `${result.file} → ${result.newFile}`;
    console.log(`  ✓ ${label}`);
    console.log(`    ${beforeKB}KB → ${afterKB}KB (saved ${savedKB}KB)`);
  }
}

console.log(`\nDone. Compressed ${count} image(s), saved ${(totalSaved / 1024).toFixed(0)}KB total.\n`);
