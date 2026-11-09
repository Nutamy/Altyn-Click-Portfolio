// Non-breaking spaces after short words and before dashes, so a line never ends on «в», «и», «және»
// or starts with «—». Touches text between tags only (no attributes, scripts or styles).
// Russian pages are edited by hand, so run this after changing their copy:  node scripts/typograph.mjs index.html privacy.html
// scripts/build-i18n.mjs applies it to the generated Kazakh pages on every build.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const NBSP = ' ';
const SHORT = {
  ru: 'в|во|к|ко|с|со|о|об|обо|у|и|а|но|на|по|за|из|от|до|не|ни|да|для|без|при|про|под|над|что|как|или',
  kk: 'және|мен|бен|пен|не|да|де|ал|бір|әр|осы|бұл|сол',
};

function fixText(text, lang) {
  const re = new RegExp(`(^|[\\s(«„"—–])(${SHORT[lang]}) +(?=\\S)`, 'gi');
  let prev;
  // Repeat: in «и в сайт» the second word only becomes reachable after the first is glued
  do { prev = text; text = text.replace(re, `$1$2${NBSP}`); } while (text !== prev);
  return text.replace(/ +(—)/g, `${NBSP}$1`);
}

export function typograph(html, lang) {
  if (!SHORT[lang]) return html;
  return html.replace(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>)|([^<]+)/g,
    (m, tag, text) => tag ? tag : fixText(text, lang));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const file of process.argv.slice(2)) {
    const src = readFileSync(file, 'utf8');
    const out = typograph(src, 'ru');
    if (out !== src) writeFileSync(file, out);
    console.log((out !== src ? '✓ ' : '· ') + file);
  }
}
