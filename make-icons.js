const sharp = require('sharp');
const fs = require('fs');

const PINK = '#E8C4E0';
const WHITE = '#FFFFFF';

// Crescent: a full circle with an offset circle punched out of it.
function crescent(size, inset) {
  const c = size / 2;
  const r = (size / 2) * inset;
  const offset = r * 0.42;
  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${PINK}"/>
  <mask id="m">
    <rect width="${size}" height="${size}" fill="black"/>
    <circle cx="${c}" cy="${c}" r="${r}" fill="white"/>
    <circle cx="${c + offset}" cy="${c - offset * 0.55}" r="${r * 0.86}" fill="black"/>
  </mask>
  <rect width="${size}" height="${size}" fill="${WHITE}" mask="url(#m)"/>
</svg>`;
}

async function build() {
  // Main icon: crescent fills most of the square
  await sharp(Buffer.from(crescent(1024, 0.62)))
    .png().toFile('assets/icon.png');

  // Adaptive icon: smaller, safely inside the centre 66% Android may crop to
  await sharp(Buffer.from(crescent(1024, 0.40)))
    .png().toFile('assets/adaptive-icon.png');

  // Splash: crescent on pink
  await sharp(Buffer.from(crescent(1024, 0.34)))
    .png().toFile('assets/splash-icon.png');

  // Favicon
  await sharp(Buffer.from(crescent(1024, 0.62)))
    .resize(48, 48).png().toFile('assets/favicon.png');

  console.log('Done: icon, adaptive-icon, splash-icon, favicon');
}

build().catch(console.error);
