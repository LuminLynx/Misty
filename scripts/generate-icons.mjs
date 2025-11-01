import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

// iOS icon sizes
const sizes = [
  { size: 120, name: 'icon-120.png' },
  { size: 152, name: 'icon-152.png' },
  { size: 167, name: 'icon-167.png' },
  { size: 180, name: 'icon-180.png' },
];

async function generateIcons() {
  const sourceIcon = join(publicDir, 'icon-512.png');
  
  for (const { size, name } of sizes) {
    await sharp(sourceIcon)
      .resize(size, size, {
        kernel: sharp.kernel.lanczos3,
        fit: 'cover',
      })
      .png()
      .toFile(join(publicDir, name));
    console.log(`Generated ${name}`);
  }
}

generateIcons().catch(console.error);
