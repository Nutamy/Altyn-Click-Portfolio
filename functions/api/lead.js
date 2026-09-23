// Cloudflare Pages Function: POST /api/lead → Telegram.
// Secrets live in Pages env vars (TELEGRAM_BOT_TOKEN, CHAT_ID) so the token never reaches the browser.

const LIMITS = { name: 80, contact: 120, link: 300 };

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export async function onRequestPost({ request, env }) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.CHAT_ID) return json({ ok: false, error: 'not_configured' }, 500);

  let data;
  try { data = await request.json(); } catch { return json({ ok: false, error: 'bad_json' }, 400); }

  // Honeypot: real users never see the "website" field, bots tend to fill every input
  if (data.website) return json({ ok: true });

  const f = {};
  for (const [key, max] of Object.entries(LIMITS)) f[key] = String(data[key] ?? '').trim().slice(0, max);
  if (!f.name || !f.contact) return json({ ok: false, error: 'required' }, 400);

  const text = [
    '<b>🟡 Заявка на бесплатный аудит</b>',
    `<b>Имя:</b> ${esc(f.name)}`,
    `<b>Контакт:</b> ${esc(f.contact)}`,
    f.link && `<b>Сайт/Instagram:</b> ${esc(f.link)}`,
    `<i>${esc(request.headers.get('referer') || 'altyn click')}</i>`,
  ].filter(Boolean).join('\n');

  const tg = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: env.CHAT_ID, text, parse_mode: 'HTML', disable_web_page_preview: true }),
  });

  return tg.ok ? json({ ok: true }) : json({ ok: false, error: 'telegram' }, 502);
}
