import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const publicDir = join(projectRoot, 'public');
const artDir = join(projectRoot, 'scripts', 'share-card-art');
const tempDir = join(tmpdir(), 'boc-social-share-cards');
const logoData = readFileSync(join(publicDir, 'boc-logo.png')).toString('base64');
const logoUrl = `data:image/png;base64,${logoData}`;

const cards = [
  {
    slug: 'services',
    label: 'Services',
    title: 'What we<br />create',
    description: 'Brand identity, digital experiences, storytelling and automation.',
    art: 'share-services-art.jpg',
    frame: 'services',
  },
  {
    slug: 'work',
    label: 'Selected work',
    title: 'Ideas made<br />visible',
    description: 'Brand systems, digital experiences and visual storytelling.',
    art: 'share-work-art.jpg',
    frame: 'work',
  },
  {
    slug: 'studio',
    label: 'Inside the studio',
    title: 'Stories in<br />the making',
    description: 'Narrative, design craft, motion and world-building.',
    art: 'share-studio-art.jpg',
    frame: 'studio',
  },
];

const sharedCss = `
  * { box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; margin: 0; overflow: hidden; }
  body { background: #11162f; }
  #share-card {
    width: 1200px;
    height: 630px;
    position: relative;
    overflow: hidden;
    isolation: isolate;
    color: #f5f5f7;
    background:
      radial-gradient(ellipse at 78% 14%, rgba(212,168,83,.12), transparent 27%),
      radial-gradient(ellipse at 8% 88%, rgba(88,86,156,.2), transparent 34%),
      linear-gradient(112deg, #10142b 0%, #1a1f4b 57%, #11152e 100%);
  }
  #share-card::before {
    content: "";
    position: absolute;
    inset: 26px;
    z-index: 5;
    border: 1px solid rgba(212,168,83,.3);
    pointer-events: none;
  }
  .stars {
    position: absolute;
    inset: 0;
    z-index: 0;
    opacity: .44;
    background-image:
      radial-gradient(1.5px 1.5px at 8% 17%, rgba(255,245,215,.9) 98%, transparent),
      radial-gradient(1px 1px at 31% 13%, rgba(255,255,255,.8) 98%, transparent),
      radial-gradient(1px 1px at 49% 28%, rgba(255,245,215,.8) 98%, transparent),
      radial-gradient(1px 1px at 88% 24%, rgba(255,255,255,.75) 98%, transparent),
      radial-gradient(1.5px 1.5px at 69% 82%, rgba(255,245,215,.75) 98%, transparent),
      radial-gradient(1px 1px at 16% 77%, rgba(255,255,255,.8) 98%, transparent);
  }
  .orbit {
    position: absolute;
    z-index: 0;
    width: 580px;
    height: 580px;
    right: -270px;
    top: -280px;
    border: 1px solid rgba(212,168,83,.19);
    border-radius: 50%;
  }
  .orbit::before, .orbit::after {
    content: "";
    position: absolute;
    inset: 36px;
    border: 1px solid rgba(245,245,247,.08);
    border-radius: 50%;
  }
  .orbit::after { inset: 82px; }
  .art-frame {
    position: absolute;
    z-index: 1;
    top: 86px;
    right: 54px;
    width: 495px;
    height: 470px;
    overflow: hidden;
    border: 1px solid rgba(212,168,83,.52);
    box-shadow: 0 22px 72px rgba(0,0,0,.34), 0 0 0 10px rgba(212,168,83,.035);
    background: #11162f;
  }
  .art-frame img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 100% center;
  }
  .art-frame::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(17,22,47,.48), transparent 38%),
      linear-gradient(0deg, rgba(17,22,47,.22), transparent 48%);
  }
  .card-services .art-frame { top: 105px; right: 62px; width: 470px; height: 420px; border-radius: 14px 92px 14px 14px; }
  .card-work .art-frame { top: 93px; right: 63px; width: 470px; height: 445px; border-radius: 4px; transform: rotate(1.4deg); }
  .card-studio .art-frame { top: 68px; right: 70px; width: 450px; height: 500px; border-radius: 230px 230px 8px 8px; }
  .copy {
    position: absolute;
    z-index: 3;
    left: 82px;
    top: 67px;
    width: 570px;
    height: 490px;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 15px;
    height: 48px;
    color: rgba(245,245,247,.92);
    font: 700 14px/1.2 'Space Mono', monospace;
    letter-spacing: .11em;
  }
  .brand img {
    width: 46px;
    height: 46px;
    display: block;
    object-fit: contain;
    filter: drop-shadow(0 0 13px rgba(212,168,83,.22));
  }
  .eyebrow {
    display: flex;
    align-items: center;
    gap: 15px;
    margin: 57px 0 17px;
    color: #d4a853;
    font: 700 16px/1.2 'Space Mono', monospace;
    letter-spacing: .16em;
    text-transform: uppercase;
  }
  .eyebrow::after { content: ""; width: 54px; height: 1px; background: rgba(212,168,83,.72); }
  h1 {
    margin: 0;
    max-width: 570px;
    color: #f5f5f7;
    font: 600 76px/.94 'Cormorant Garamond', Georgia, serif;
    letter-spacing: -.025em;
  }
  .description {
    max-width: 525px;
    margin: 17px 0 0;
    color: #f2e3bd;
    font: 500 23px/1.32 'Source Sans 3', Arial, sans-serif;
    letter-spacing: .005em;
  }
  .foot {
    display: flex;
    align-items: center;
    gap: 12px;
    position: absolute;
    bottom: 0;
    left: 0;
    margin-top: 0;
    color: rgba(245,245,247,.72);
    font: 600 14px/1.2 'Source Sans 3', Arial, sans-serif;
    letter-spacing: .12em;
    text-transform: uppercase;
  }
  .foot .dot { width: 6px; height: 6px; border-radius: 50%; background: #d4a853; box-shadow: 0 0 10px rgba(212,168,83,.7); }
  .foot .url { color: #f5f5f7; font: 700 14px/1.2 'Space Mono', monospace; letter-spacing: .08em; }
`;

mkdirSync(tempDir, { recursive: true });

for (const card of cards) {
  const artData = readFileSync(join(artDir, card.art)).toString('base64');
  const artUrl = `data:image/jpeg;base64,${artData}`;
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Source+Sans+3:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
  <style>${sharedCss}</style>
  <title>${card.label} share card</title>
</head>
<body>
  <main id="share-card" class="card-${card.frame}" aria-label="Based on Creativity ${card.label} social share image">
    <div class="stars"></div>
    <div class="orbit"></div>
    <div class="art-frame"><img src="${artUrl}" alt="" /></div>
    <section class="copy">
      <div class="brand"><img src="${logoUrl}" alt="" /><span>BASED ON CREATIVITY</span></div>
      <div class="eyebrow">${card.label}</div>
      <h1>${card.title}</h1>
      <p class="description">${card.description}</p>
      <div class="foot"><span class="dot"></span><span class="url">bochq.com</span><span>·</span><span>Toronto creative studio</span></div>
    </section>
  </main>
</body>
</html>`;
  const htmlPath = join(tempDir, `share-${card.slug}.html`);
  const outputPath = join(publicDir, `og-${card.slug}.png`);
  writeFileSync(htmlPath, html, 'utf8');
  execFileSync('/usr/bin/chromium', [
    '--headless',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--window-size=1200,630',
    '--virtual-time-budget=5000',
    `--screenshot=${outputPath}`,
    `file://${htmlPath}`,
  ], { stdio: 'inherit' });
  console.log(`Rendered ${outputPath}`);
}
