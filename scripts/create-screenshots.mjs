import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

async function createScreenshot(width, height, filename, text) {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#fafbfd"/>
      <rect x="20" y="60" width="${width - 40}" height="${height - 100}" rx="20" fill="#ffffff" stroke="#e0e0e0" stroke-width="2"/>
      <circle cx="${width/2}" cy="140" r="40" fill="#7ea8c4"/>
      <text x="${width/2}" y="220" font-family="Arial" font-size="24" fill="#333" text-anchor="middle" font-weight="bold">${text}</text>
      <rect x="40" y="260" width="${width - 80}" height="60" rx="10" fill="#f5f5f5"/>
      <rect x="40" y="340" width="${width - 80}" height="60" rx="10" fill="#f5f5f5"/>
      <rect x="40" y="420" width="${width - 80}" height="60" rx="10" fill="#f5f5f5"/>
    </svg>
  `;
  
  await sharp(Buffer.from(svg))
    .png()
    .toFile(join(publicDir, filename));
}

await createScreenshot(540, 720, 'screenshot-narrow-1.png', 'Weather Dashboard');
await createScreenshot(540, 720, 'screenshot-narrow-2.png', 'Forecast View');
await createScreenshot(1280, 720, 'screenshot-wide-1.png', 'Desktop View');

console.log('Screenshots created');
