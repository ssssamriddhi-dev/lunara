const sharp = require('sharp');

const DEEP1 = '#4A4270';
const DEEP2 = '#38315C';
const MOON1 = '#F7DCF0';
const MOON2 = '#E4BEDD';
const SPARK = '#FBEAF6';

function svg(size, inset) {
  const c = size / 2;
  const r = (size / 2) * inset;
  const off = r * 0.44;
  const s = size / 1024;

  const spark = (x, y, k, o) => `
    <path d="M${x} ${y - k}
             Q${x + k * 0.16} ${y - k * 0.16} ${x + k} ${y}
             Q${x + k * 0.16} ${y + k * 0.16} ${x} ${y + k}
             Q${x - k * 0.16} ${y + k * 0.16} ${x - k} ${y}
             Q${x - k * 0.16} ${y - k * 0.16} ${x} ${y - k} Z"
          fill="${SPARK}" opacity="${o}"/>`;

  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="0.35" cy="0.25" r="1">
      <stop offset="0" stop-color="${DEEP1}"/>
      <stop offset="1" stop-color="${DEEP2}"/>
    </radialGradient>
    <radialGradient id="moon" cx="0.32" cy="0.26" r="0.92">
      <stop offset="0" stop-color="#FFF2FB"/>
      <stop offset="0.55" stop-color="${MOON1}"/>
      <stop offset="1" stop-color="${MOON2}"/>
    </radialGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0.55" stop-color="${MOON1}" stop-opacity="0.30"/>
      <stop offset="1" stop-color="${MOON1}" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="${14 * s}"/>
    </filter>
    <mask id="m">
      <rect width="${size}" height="${size}" fill="black"/>
      <circle cx="${c}" cy="${c}" r="${r}" fill="white"/>
      <circle cx="${c + off}" cy="${c - off * 0.50}" r="${r * 0.88}" fill="black"/>
    </mask>
  </defs>

  <rect width="${size}" height="${size}" fill="url(#bg)"/>

  <circle cx="${c - r * 0.10}" cy="${c + r * 0.06}" r="${r * 1.30}" fill="url(#glow)"/>

  <g mask="url(#m)">
    <circle cx="${c + r * 0.06}" cy="${c + r * 0.10}" r="${r}" fill="#2C2650"
            opacity="0.45" filter="url(#soft)"/>
    <circle cx="${c}" cy="${c}" r="${r}" fill="url(#moon)"/>
    <path d="M${c - r} ${c} a${r} ${r} 0 0 0 ${r * 2} 0 a${r} ${r} 0 0 0 ${-r * 2} 0"
          fill="#B98FC4" opacity="0.10"/>
  </g>

  ${spark(c + r * 0.50, c - r * 0.34, r * 0.20, 0.95)}
  ${spark(c + r * 0.80, c + r * 0.02, r * 0.27, 1)}
  ${spark(c + r * 0.36, c - r * 0.78, r * 0.10, 0.7)}
  <circle cx="${c + r * 0.96}" cy="${c - r * 0.56}" r="${5 * s}" fill="${SPARK}" opacity="0.6"/>
  <circle cx="${c + r * 0.62}" cy="${c + r * 0.52}" r="${4 * s}" fill="${SPARK}" opacity="0.5"/>
</svg>`;
}

async function build() {
  await sharp(Buffer.from(svg(1024, 0.60))).png().toFile('assets/icon.png');
  await sharp(Buffer.from(svg(1024, 0.38))).png().toFile('assets/adaptive-icon.png');
  await sharp(Buffer.from(svg(1024, 0.34))).png().toFile('assets/splash-icon.png');
  await sharp(Buffer.from(svg(1024, 0.60))).resize(48, 48).png().toFile('assets/favicon.png');
  console.log('icons rebuilt');
}
build().catch(console.error);
