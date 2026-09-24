// Cloudflare Pages Function: POST /api/lead → Telegram.
// Secrets live in Pages env vars (TELEGRAM_BOT_TOKEN, CHAT_ID, TURNSTILE_SECRET[_KEY], PROMO_CODES),
// so none of them ever reach the browser.

import { PRICES, json, badOrigin, findPromo, discountFor } from './promo.js';

const LIMITS = { name: 80, contact: 120, link: 300, promo: 32, utm_source: 100, utm_medium: 100, utm_campaign: 100 };

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fmt = n => n.toLocaleString('ru-RU').replace(/ /g, ' ');

// Turnstile check runs only when TURNSTILE_SECRET is set, so the form keeps working before setup
async function turnstileFails(env, token, ip) {
  // Either variable name works: TURNSTILE_SECRET or TURNSTILE_SECRET_KEY
  const secret = env.TURNSTILE_SECRET || env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;
  if (!token) return true;
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const out = await r.json();
    return !out.success;
  } catch {
    return true;
  }
}

export async function onRequestPost({ request, env }) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.CHAT_ID) return json({ ok: false, error: 'not_configured' }, 500);

  const blocked = badOrigin(request);
  if (blocked) return blocked;

  let data;
  try { data = await request.json(); } catch { return json({ ok: false, error: 'bad_json' }, 400); }

  // Honeypot: real users never see the "website" field, bots tend to fill every input
  if (data.website) return json({ ok: true });

  // The form requires explicit consent; keep a record of it in the lead itself
  if (data.consent !== 'yes') return json({ ok: false, error: 'consent' }, 400);

  const f = {};
  for (const [key, max] of Object.entries(LIMITS)) f[key] = String(data[key] ?? '').trim().slice(0, max);
  if (!f.name || !f.contact) return json({ ok: false, error: 'required' }, 400);

  // Contact must look like a phone (10+ digits) or a Telegram username
  const digits = f.contact.replace(/\D/g, '');
  if (digits.length < 10 && !/^@?[a-zA-Z0-9_]{4,32}$/.test(f.contact)) return json({ ok: false, error: 'contact' }, 400);

  if (await turnstileFails(env, data['cf-turnstile-response'], request.headers.get('CF-Connecting-IP'))) {
    return json({ ok: false, error: 'captcha' }, 403);
  }

  // Price is recalculated from the server's own table; the browser only sends option ids
  const optIds = [...new Set(String(data.options ?? '').split(',').filter(id => PRICES.options[id]))];
  const subtotal = PRICES.base + optIds.reduce((sum, id) => sum + PRICES.options[id].price, 0);
  const promo = findPromo(env, f.promo);
  const discount = discountFor(promo, subtotal);

  const lines = [
    '<b>🟡 Новая заявка с сайта</b>',
    `<b>Имя:</b> ${esc(f.name)}`,
    `<b>Контакт:</b> ${esc(f.contact)}`,
    f.link && `<b>Сайт/Instagram/2ГИС:</b> ${esc(f.link)}`,
    optIds.length && `<b>Опции:</b> ${optIds.map(id => PRICES.options[id].title).join(', ')}`,
  ];
  if (promo && promo.valid) {
    const size = promo.percent ? `−${promo.percent}%` : `−${fmt(promo.amount)} ₸`;
    lines.push(`<b>Промокод:</b> ${esc(promo.code)} (${size}${promo.label ? ', ' + esc(promo.label) : ''})`);
  } else if (promo) {
    lines.push(`<b>Промокод:</b> ${esc(promo.code)} — ${promo.reason === 'expired' ? 'срок истёк' : 'не найден'}, скидка не применена`);
  }
  lines.push(`<b>Расчёт:</b> ${fmt(subtotal)} ₸${discount ? ` − ${fmt(discount)} ₸ = <b>${fmt(subtotal - discount)} ₸</b>` : ''}`);
  const utm = [f.utm_source, f.utm_medium, f.utm_campaign].filter(Boolean).map(esc).join(' / ');
  if (utm) lines.push(`<b>Источник (utm):</b> ${utm}`);
  lines.push('<b>Согласие на обработку ПД:</b> да');
  lines.push(`<i>${esc(request.headers.get('referer') || 'altyn click')}</i>`);

  const tg = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: env.CHAT_ID, text: lines.filter(Boolean).join('\n'), parse_mode: 'HTML', disable_web_page_preview: true }),
  });

  return tg.ok ? json({ ok: true }) : json({ ok: false, error: 'telegram' }, 502);
}
