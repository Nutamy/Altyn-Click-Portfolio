// Renders the social preview images (1200×630) from scripts/og/og.html with headless Chrome or Edge.
// Run after changing the template:  node scripts/build-og.mjs [path-to-Brief-repo]
// Site: og.jpg, og-kz.jpg, og-en.jpg here. Brief: the same names in the Brief repo (default ../Brief).
// Chrome writes PNG; Python + Pillow converts it to a JPEG small enough for WhatsApp/Telegram previews (< 300 KB).
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, unlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BRIEF = resolve(process.argv[2] || join(ROOT, '..', 'Brief'));
const BROWSER = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/chromium', '/usr/bin/google-chrome',
].find(p => p && existsSync(p));
if (!BROWSER) throw new Error('No Chrome/Edge found; set CHROME=<path>');

const page = pathToFileURL(join(ROOT, 'scripts/og/og.html')).href;
const jobs = [];
for (const [lang, suffix] of [['ru', ''], ['kk', '-kz'], ['en', '-en']]) {
  jobs.push({ url: `${page}?lang=${lang}&kind=site`, out: join(ROOT, `og${suffix}.jpg`) });
  if (existsSync(BRIEF)) jobs.push({ url: `${page}?lang=${lang}&kind=brief`, out: join(BRIEF, `og${suffix}.jpg`) });
}
for (const j of jobs) {
  mkdirSync(dirname(j.out), { recursive: true });
  execFileSync(BROWSER, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--window-size=1200,630', '--virtual-time-budget=8000', '--allow-file-access-from-files', `--screenshot=${j.out}.png`, j.url], { stdio: 'ignore' });
  execFileSync('python', ['-c', 'import sys;from PIL import Image;Image.open(sys.argv[1]).convert("RGB").save(sys.argv[2],"JPEG",quality=86,optimize=True,progressive=True)', j.out + '.png', j.out]);
  unlinkSync(j.out + '.png');
  console.log('✓ ' + j.out);
}
