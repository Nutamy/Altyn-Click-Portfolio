// Cloudflare Pages Function: POST /api/promo → checks a promo code.
// Codes live in the Pages env var PROMO_CODES (JSON), so they never appear in the site's source.
//
// PROMO_CODES example (one line in Cloudflare): ОСЕНЬ2026:20, СВОИ_ЛЮДИ:30
// percent — скидка в процентах от суммы с опциями; amount — фиксированная скидка в тенге;
// until — последний день действия (включительно, по времени Алматы), необязательно.

// Must match BASE_PRICE and the option cards (data-opt / data-price) in index.html
export const PRICES = {
  base: 120000,
  options: {
    lang: { title: 'Вторая языковая версия', price: 30000 },
    quiz: { title: 'Калькулятор / квиз', price: 15000 },
    express: { title: 'Экспресс-разработка', price: 25000 },
  },
};

export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

// Only the site itself may call the API: blocks naive cross-site scripts and form spam from other origins
export function badOrigin(request) {
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return json({ ok: false, error: 'origin' }, 403);
  if (!(request.headers.get('content-type') || '').includes('application/json')) return json({ ok: false, error: 'type' }, 415);
  return null;
}

const normalize = raw => String(raw ?? '').trim().toUpperCase().slice(0, 32);
// Spaces, hyphens and underscores are ignored when matching: "свои люди" finds "СВОИ_ЛЮДИ"
const compact = code => code.replace(/[\s_-]+/g, '').replace(/Ё/g, 'Е');
// Today's date in Almaty (UTC+5) as YYYY-MM-DD, to compare with "until"
const today = () => new Date(Date.now() + 5 * 3600e3).toISOString().slice(0, 10);

// Two accepted formats for PROMO_CODES:
//   simple — ОСЕНЬ2026:20, СВОИ_ЛЮДИ:30   (number ≤ 100 = percent, bigger = tenge)
//   JSON   — {"ОСЕНЬ2026":{"percent":20,"label":"Осень 2026","until":"2026-11-30"}}
function parseCodes(raw) {
  const text = String(raw ?? '').trim();
  if (!text) return {};
  if (text.startsWith('{')) {
    try { return JSON.parse(text); } catch { return {}; }
  }
  const all = {};
  for (const part of text.split(/[,;\n]+/)) {
    const m = part.trim().match(/^(.+?)\s*[:=]\s*(\d+)\s*%?$/);
    if (!m) continue;
    const n = Number(m[2]);
    all[m[1]] = n <= 100 ? { percent: n } : { amount: n };
  }
  return all;
}

// Returns null for an empty code, { code, valid: false, reason } or { code, valid: true, label, percent|amount }
export function findPromo(env, raw) {
  const code = normalize(raw);
  if (!code) return null;
  const all = parseCodes(env.PROMO_CODES);
  const key = Object.keys(all).find(k => compact(normalize(k)) === compact(code));
  const p = key && all[key];
  if (!p) return { code, valid: false, reason: 'not_found' };
  // Report the code as written in the config, not as typed
  const canonical = normalize(key);
  if (p.until && today() > p.until) return { code: canonical, valid: false, reason: 'expired' };
  const percent = Number(p.percent) || 0;
  const amount = Number(p.amount) || 0;
  if (!(percent > 0 && percent <= 100) && !(amount > 0)) return { code, valid: false, reason: 'not_found' };
  return percent
    ? { code: canonical, valid: true, label: String(p.label || ''), percent }
    : { code: canonical, valid: true, label: String(p.label || ''), amount };
}

export function discountFor(promo, subtotal) {
  if (!promo || !promo.valid) return 0;
  return Math.min(subtotal, promo.percent ? Math.round(subtotal * promo.percent / 100) : promo.amount);
}

export async function onRequestPost({ request, env }) {
  const blocked = badOrigin(request);
  if (blocked) return blocked;

  let data;
  try { data = await request.json(); } catch { return json({ ok: false, error: 'bad_json' }, 400); }

  const p = findPromo(env, data.code);
  if (!p || !p.valid) return json({ ok: false, error: p ? p.reason : 'not_found' });
  const { valid, ...pub } = p;
  return json({ ok: true, ...pub });
}
