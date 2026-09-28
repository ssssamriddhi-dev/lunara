const sharp = require('sharp');
const A = './assets/';

const jobs = [
  { in: 'raw-move.png',  out: 'move-art.png',
    crop: { left: 380, top: 190, width: 1300, height: 1440 } },
  { in: 'raw-cycle.png', out: 'cycle-art.png',
    crop: { left: 60, top: 650, width: 1930, height: 690 } },
  { in: 'raw-learn.png', out: 'learn-art.png',
    crop: { left: 700, top: 215, width: 650, height: 1440 } },
  { in: 'raw-fertility.png',     out: 'fertility-art.png' },
  { in: 'raw-birthcontrol.png',  out: 'birthcontrol-art.png' },
  { in: 'raw-perimenopause.png', out: 'perimenopause-art.png' },
];

(async () => {
  for (const j of jobs) {
    let base = sharp(A + j.in);
    if (j.crop) base = base.extract(j.crop);
    const rgb = await base.resize({ width: 800, withoutEnlargement: true })
      .removeAlpha().toBuffer();

    const mask = await sharp(rgb).greyscale().linear(-10, 246 * 10).toBuffer();

    await sharp(rgb).joinChannel(mask)
      .png({ compressionLevel: 9, palette: true, quality: 88 })
      .toFile(A + j.out);
    console.log('made', j.out);
  }
})();
