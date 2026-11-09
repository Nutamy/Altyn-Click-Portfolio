/* ================================================================
   Altyn Click — вся логика страницы
   3D-мир (dist/world.js, исходники в src/world/) подгружается отсюда
   только когда устройство его потянет; без него страница полная.
================================================================ */

/* ---------- 0. Настройки: меняются здесь ---------- */
// Номер счётчика Яндекс Метрики (только цифры). 0 — Метрика не загружается.
const METRIKA_ID = 113005383;
// Site key виджета Cloudflare Turnstile. Пустая строка — защита не подключается.
const TURNSTILE_SITEKEY = '0x4AAAAAAFCLVDL4nJ79j7pJ';

const TG = 'https://t.me/altynclick';
const WA = 'https://wa.me/message/SEVFCLAYNOANG1';
// Must match PRICES in functions/api/promo.js — the server recalculates the total from its own copy
const BASE_PRICE = 120000;

const ARR = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const EXT = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg>';

/* ---------- Языки ---------- */
// The page language comes from <html lang>. /kz/ and /en/ load i18n/<lang>.js before this file;
// it sets window.I18N = { ui: {...}, works: {...} } and overrides the Russian defaults below.
const LANG = document.documentElement.lang || 'ru';
const L10N = window.I18N || {};
// Site root derived from this script's URL, so asset paths work from /kz/ and /en/ too
const ROOT = new URL('.', document.currentScript.src).href;
const RU = {
  menuOpen: 'Открыть меню',
  menuClose: 'Закрыть меню',
  optNone: '— пока без опций',
  optSum: sum => '+ ' + sum + ' ₸ (опции)',
  promoLine: (code, size, disc) => 'Промокод ' + code + ': ' + size + ' (−' + disc + ' ₸)',
  rowBase: 'Лендинг под ключ',
  rowOpts: names => 'Опции: ' + names,
  rowPromo: code => 'Промокод ' + code,
  rowTotal: 'Предварительный итог',
  promoChecking: 'Проверяю…',
  promoOk: size => 'Промокод применён: ' + size + '. Итоговую сумму подтвержу в ответе.',
  promoExpired: 'Срок действия промокода закончился.',
  promoUnknown: 'Такого промокода нет — проверьте написание.',
  promoNetErr: 'Не получилось проверить промокод. Отправьте заявку — проверю его сама.',
  sending: 'Отправляю…',
  errTail: (tg, wa) => ' Или напишите в ' + tg + ' / ' + wa + '.',
  errors: {
    captcha: 'Проверка от спама не прошла — попробуйте ещё раз.',
    contact: 'Проверьте контакт: нужен телефон или ник в Telegram.',
    required: 'Заполните имя, контакт и пару слов о проекте.',
    consent: 'Отметьте согласие на обработку данных.',
  },
  errGeneric: 'Не получилось отправить. Попробуйте ещё раз.',
  errNetwork: 'Нет связи с сервером — заявка не ушла. Проверьте интернет и отправьте ещё раз.',
  hintTg: 'Например, @username или +7 701 123 45 67',
  hintPhone: 'Например, +7 701 123 45 67',
  // Turnstile has no Kazakh UI; 'auto' follows the browser language
  turnstileLang: 'ru',
  city: 'Алматы',
  done: 'Что сделано',
  highlight: 'Изюминка',
  wantSimilar: 'Хочу похожий сайт',
  viewSite: 'Посмотреть сайт',
  tellMore: tg => 'Расскажу подробнее о решениях по проекту — ' + tg + '.',
  tellMoreLink: 'в Telegram',
  prevShot: 'Предыдущий скриншот',
  nextShot: 'Следующий скриншот',
  closeCase: 'Закрыть кейс',
  showScreen: i => 'Показать экран ' + i,
  shotAlt: (name, i, n) => 'Скриншот сайта ' + name + ', экран ' + i + ' из ' + n,
};
const T = { ...RU, ...L10N.ui, errors: { ...RU.errors, ...(L10N.ui && L10N.ui.errors) } };
// English groups thousands with commas; Russian and Kazakh use spaces, as in the static prices
const fmt = n => n.toLocaleString(LANG === 'en' ? 'en-US' : 'ru-RU');
// /en/ quotes its own rounded USD prices (i18n/en.js → currency); the lead is still priced in KZT on the server
const CUR = L10N.currency;
const money = n => CUR ? CUR.sign + fmt(n) : fmt(n) + ' ₸';
const basePrice = CUR?.prices.base ?? BASE_PRICE;
const optPrice = card => CUR?.prices[card.dataset.opt] ?? +card.dataset.price;
// Fixed promo discounts are stored in tenge; convert them at the page's reference rate
const promoAmount = p => CUR ? Math.round(p.amount / CUR.kztRate) : p.amount;

// Language links keep the promo/utm query and the current section when switching
document.querySelectorAll('a[data-lang]').forEach(a => a.addEventListener('click', () => {
  a.href = a.getAttribute('href').split(/[?#]/)[0] + location.search + location.hash;
}));
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)');
// Two frames: lets the browser paint the start state before a CSS transition begins
const raf2 = fn => requestAnimationFrame(() => requestAnimationFrame(fn));
// With reduced motion there are no transitions to wait for
const later = (fn, ms) => setTimeout(fn, REDUCED.matches ? 0 : ms);

/* ---------- Аналитика: Яндекс Метрика + цели ---------- */
if (METRIKA_ID) {
  // Official loader snippet, moved here from inline HTML so the CSP can forbid inline scripts
  (function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
    m[i].l = 1 * new Date();
    k = e.createElement(t); a = e.getElementsByTagName(t)[0]; k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=' + METRIKA_ID, 'ym');
  // Webvisor stays off: the privacy policy promises no session recording
  ym(METRIKA_ID, 'init', { ssr: true, webvisor: false, clickmap: true, accurateTrackBounce: true, trackLinks: true });
}
// Goal ids must match the "JavaScript event" goals created in Metrika
function track(goal, params) {
  if (METRIKA_ID && typeof window.ym === 'function') ym(METRIKA_ID, 'reachGoal', goal, params);
}
document.addEventListener('click', e => {
  const a = e.target.closest('a[href]');
  if (!a) return;
  if (a.href.startsWith('https://t.me/')) track('tg_click');
  else if (a.href.startsWith('https://wa.me/')) track('wa_click');
  else if (a.dataset.goal) track(a.dataset.goal);
});

/* ---------- 1. Шапка и меню ---------- */
const hdr = document.getElementById('hdr');
let hdrOn = false;
function onScrollHeader() {
  const on = scrollY > 12;
  if (on !== hdrOn) { hdrOn = on; hdr.classList.toggle('on', on); }
}
addEventListener('scroll', onScrollHeader, { passive: true });
onScrollHeader();

const mobMenu = document.getElementById('mobMenu');
const burger = document.getElementById('burger');
function setMenu(open) {
  mobMenu.hidden = !open;
  hdr.classList.toggle('menu-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? T.menuClose : T.menuOpen);
}
burger.addEventListener('click', () => setMenu(mobMenu.hidden));
mobMenu.querySelectorAll('.mob-link').forEach(a => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', e => {
  if (e.key === 'Escape' && !mobMenu.hidden) { setMenu(false); burger.focus(); }
});

/* ---------- 2. Указатель маршрута ---------- */
// One gauge for the whole route: entrance → nine works → approach → request. Its fill follows the scroll.
const route = document.getElementById('route');
const routeLinks = [...route.querySelectorAll('a[data-route]')];
const workEls = [...document.querySelectorAll('.work')];
const ticks = route.querySelector('.route-ticks');
workEls.forEach(() => ticks.appendChild(document.createElement('i')));
const routeTargets = routeLinks.map(a => document.getElementById(a.dataset.route));
function updateRoute() {
  const mid = scrollY + innerHeight * 0.45;
  const max = document.documentElement.scrollHeight - innerHeight;
  // The gauge ends at the form: everything after it (agencies, footer) counts as arrived
  const end = Math.max(1, Math.min(max, document.getElementById('contact').offsetTop));
  route.style.setProperty('--route', Math.min(1, scrollY / end).toFixed(4));
  let cur = 0;
  routeTargets.forEach((el, i) => { if (el && el.offsetTop <= mid) cur = i; });
  routeLinks.forEach((a, i) => { if (i === cur) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current'); });
  [...ticks.children].forEach((t, i) => {
    const w = workEls[i];
    t.classList.toggle('on', w.offsetTop <= mid && w.offsetTop + w.offsetHeight > mid);
  });
}
let routeQueued = false;
addEventListener('scroll', () => {
  if (routeQueued) return;
  routeQueued = true;
  requestAnimationFrame(() => { routeQueued = false; updateRoute(); });
}, { passive: true });
addEventListener('resize', updateRoute, { passive: true });
updateRoute();

/* ---------- 3. Калькулятор опций + промокод ---------- */
const form = document.getElementById('leadForm');
const optCards = [...document.querySelectorAll('.opt')];
const optField = document.getElementById('f-options');
const calcSummary = document.getElementById('calcSummary');
const promoLine = document.getElementById('optPromoLine');
let promo = null; // { code, label, percent?, amount? } once the server confirms the code

function calc() {
  const picked = optCards.filter(c => c.getAttribute('aria-pressed') === 'true');
  const subtotal = basePrice + picked.reduce((sum, c) => sum + optPrice(c), 0);
  let discount = 0;
  if (promo) discount = Math.min(subtotal, promo.percent ? Math.round(subtotal * promo.percent / 100) : promoAmount(promo));
  return { picked, subtotal, discount, total: subtotal - discount };
}
const promoText = p => p.percent ? '−' + p.percent + '%' : '−' + money(promoAmount(p));

function recalc() {
  const { picked, subtotal, discount, total } = calc();
  const optSum = subtotal - basePrice;
  document.getElementById('optSumLabel').textContent = optSum ? T.optSum(fmt(optSum)) : T.optNone;
  document.getElementById('optTotal').textContent = money(total);
  promoLine.hidden = !promo;
  if (promo) promoLine.textContent = T.promoLine(promo.code, promoText(promo), fmt(discount));

  // The form carries option ids; the summary tells the visitor what will be sent
  optField.value = picked.map(c => c.dataset.opt).join(',');
  calcSummary.hidden = !picked.length && !promo;
  if (!calcSummary.hidden) {
    const names = picked.map(c => c.querySelector('.opt-name').textContent.trim());
    calcSummary.textContent = '';
    const add = (label, value) => {
      const row = document.createElement('div');
      const l = document.createElement('span'), v = document.createElement('b');
      l.textContent = label; v.textContent = value; v.className = 'num';
      row.append(l, v);
      calcSummary.appendChild(row);
    };
    add(T.rowBase, money(basePrice));
    if (names.length) add(T.rowOpts(names.join(', ')), '+ ' + money(subtotal - basePrice));
    if (promo) add(T.rowPromo(promo.code), '− ' + money(discount));
    add(T.rowTotal, money(total));
  }
}
optCards.forEach(card => card.addEventListener('click', () => {
  card.setAttribute('aria-pressed', String(card.getAttribute('aria-pressed') !== 'true'));
  recalc();
}));
// Leaving the calculator for the form: land on the first field
document.getElementById('optCta').addEventListener('click', () => {
  setTimeout(() => form.elements.name.focus({ preventScroll: true }), REDUCED.matches ? 0 : 700);
});

const promoToggle = document.getElementById('promoToggle');
const promoFieldBox = document.getElementById('promoField');
const promoInput = document.getElementById('f-promo');
const promoMsg = document.getElementById('f-promo-msg');
function openPromo() {
  promoFieldBox.hidden = false;
  promoToggle.setAttribute('aria-expanded', 'true');
  promoToggle.hidden = true; // the field has its own label once shown
}
promoToggle.addEventListener('click', () => { openPromo(); promoInput.focus(); });

function setPromoMsg(text, ok) {
  promoMsg.textContent = text;
  promoMsg.className = 'hint ' + (text ? (ok ? 'ok' : 'bad') : '');
}
async function applyPromo() {
  const code = promoInput.value.trim().toUpperCase();
  promo = null;
  if (!code) { setPromoMsg('', true); recalc(); return; }
  setPromoMsg(T.promoChecking, true);
  try {
    const r = await fetch('/api/promo', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const d = await r.json();
    if (d.ok) {
      promo = d;
      setPromoMsg(T.promoOk(promoText(d) + (d.label ? ' · ' + d.label : '')), true);
      track('promo_applied', { code: d.code });
    } else {
      setPromoMsg(d.error === 'expired' ? T.promoExpired : T.promoUnknown, false);
    }
  } catch {
    setPromoMsg(T.promoNetErr, false);
  }
  recalc();
}
document.getElementById('promoApply').addEventListener('click', applyPromo);
promoInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); applyPromo(); } });
promoInput.addEventListener('input', () => { if (promo) { promo = null; setPromoMsg('', true); recalc(); } });

// Ad and stories links carry ?promo=CODE and utm_* — prefill them so the lead shows where it came from
const qs = new URLSearchParams(location.search);
['utm_source', 'utm_medium', 'utm_campaign'].forEach(k => {
  if (qs.get(k)) form.elements[k].value = qs.get(k).slice(0, 100);
});
if (qs.get('promo')) {
  openPromo();
  promoInput.value = qs.get('promo').slice(0, 32).toUpperCase();
  applyPromo();
}

/* ---------- 4. Форма заявки ---------- */
const btn = document.getElementById('leadBtn');
const BTN_TXT = btn.textContent;
// Same rule as functions/api/lead.js: a phone with 10+ digits or a Telegram username
const contactOk = v => v.replace(/\D/g, '').length >= 10 || /^@?[a-zA-Z0-9_]{4,32}$/.test(v.trim());
const REQUIRED = [
  { el: form.elements.name, err: document.getElementById('f-name-err') },
  { el: form.elements.contact, err: document.getElementById('f-contact-err'), ok: contactOk },
  { el: form.elements.message, err: document.getElementById('f-message-err') },
  { el: form.elements.consent, err: document.getElementById('f-consent-err') },
];
const valid = f => f.el.type === 'checkbox' ? f.el.checked : !!f.el.value.trim() && (!f.ok || f.ok(f.el.value));
function setFieldError(f, bad) {
  f.el.setAttribute('aria-invalid', String(bad));
  f.err.hidden = !bad;
}
// Clear a field's error as soon as the user fixes it
REQUIRED.forEach(f => f.el.addEventListener(f.el.type === 'checkbox' ? 'change' : 'input', () => { if (valid(f)) setFieldError(f, false); }));
// A filled contact is checked when the visitor leaves the field, not while typing
form.elements.contact.addEventListener('blur', () => {
  const f = REQUIRED[1];
  if (f.el.value.trim()) setFieldError(f, !valid(f));
});

// "What do you need": the free review explains itself
const goalNote = document.getElementById('goalNote');
form.querySelectorAll('input[name="goal"]').forEach(r => r.addEventListener('change', () => {
  goalNote.hidden = form.elements.goal.value !== 'audit';
}));
// "How to reach you": the hint follows the channel; WhatsApp and calls need a phone number
const contactHint = document.getElementById('f-contact-hint');
form.querySelectorAll('input[name="channel"]').forEach(r => r.addEventListener('change', () => {
  const tg = form.elements.channel.value === 'telegram';
  contactHint.textContent = tg ? T.hintTg : T.hintPhone;
  form.elements.contact.setAttribute('inputmode', tg ? 'text' : 'tel');
}));

function showFormError(text) {
  let err = document.getElementById('leadErr');
  if (!err) {
    err = document.createElement('p');
    err.id = 'leadErr';
    err.className = 'form-error';
    err.setAttribute('role', 'alert');
    btn.before(err);
  }
  // Static markup with our own text only, never user input
  err.innerHTML = text + T.errTail(
    '<a href="' + TG + '" target="_blank" rel="noopener">Telegram</a>',
    '<a href="' + WA + '" target="_blank" rel="noopener">WhatsApp</a>');
}
function clearFormError() {
  const err = document.getElementById('leadErr');
  if (err) err.remove();
}

// Cloudflare Turnstile: loaded only when a site key is configured
let turnstileId = null;
if (TURNSTILE_SITEKEY) {
  window.onTurnstileLoad = () => {
    turnstileId = turnstile.render('#turnstileBox', { sitekey: TURNSTILE_SITEKEY, language: T.turnstileLang });
  };
  const ts = document.createElement('script');
  ts.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit';
  ts.async = true;
  document.head.appendChild(ts);
}

function setSending(on) {
  btn.disabled = on;
  btn.setAttribute('aria-busy', String(on));
  if (on) btn.innerHTML = '<span class="btn-spin" aria-hidden="true"></span>' + T.sending;
  else btn.textContent = BTN_TXT;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  clearFormError();
  const invalid = REQUIRED.filter(f => !valid(f));
  REQUIRED.forEach(f => setFieldError(f, invalid.includes(f)));
  if (invalid.length) { invalid[0].el.focus(); return; }

  setSending(true);
  // An unconfirmed code still travels with the lead; the server re-checks it
  fetch('/api/lead', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    // lang tells the owner which language to reply in
    body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), lang: LANG }),
  })
    .then(r => r.json().catch(() => ({})).then(d => { if (!r.ok || !d.ok) throw new Error(d.error || r.status); }))
    // Success is shown only after the server confirmed the lead reached Telegram
    .then(() => {
      form.hidden = true;
      const ok = document.getElementById('leadOk');
      ok.hidden = false;
      document.getElementById('leadOkTitle').focus();
      document.dispatchEvent(new CustomEvent('lead:sent'));
      track('lead_submit', { promo: promo ? promo.code : '', options: optField.value, goal: form.elements.goal.value, lang: LANG });
    })
    .catch(err => {
      setSending(false);
      // Turnstile tokens are single-use: a new one is needed for the retry
      if (turnstileId !== null && window.turnstile) turnstile.reset(turnstileId);
      const msg = err instanceof TypeError ? T.errNetwork : (T.errors[err.message] || T.errGeneric);
      showFormError(msg);
      // The button was disabled while sending, so focus fell to the page; give it back for the retry
      btn.focus();
    });
});

/* ---------- 5. Портфолио: данные ---------- */
// Every project ships 5 desktop (1416×768) and 5 mobile (585×1266 = 390px viewport @1.5x) WebP shots; 01 = hero, 02–05 = key sections
const shots = id => [1,2,3,4,5].map(n => ROOT + 'screenshots/' + id + '/0' + n + '.webp');
const mshots = id => [1,2,3,4,5].map(n => ROOT + 'screenshots/' + id + '/m/0' + n + '.webp');
// Must match the max-width in the <picture> sources of the work cards
const MOBILE = matchMedia('(max-width: 767px)');
// Figures in case texts are only those visible on the client's live site or in its screenshots
const works = [
  {
    id:'savepoint', name:'Save Point', cat:'Кофейня и коворкинг',
    tagline:'Бронь стола за 30 секунд — эспрессо готов к приходу',
    url:'https://savepoint-1hu.pages.dev/',
    about:'Лендинг спешелти-кофейни и laptop-friendly пространства в центре Алматы для фрилансеров, стартаперов и тех, кто назначает встречи в центре. Их главная боль — кружить по залу в поисках свободного стола с розеткой и ловить косые взгляды персонала из-за ноутбука. Задача — перенести выбор места и заказ в онлайн и привести к брони стола или предзаказу напитка.',
    done:[
      'UX-структура «знакомая ситуация → решение»: четыре боли алматинских кофеен — полная посадка, охота за розеткой, «с ноутбуком нельзя», хаос с бронью — и таблица «что у нас есть → что это даёт тебе».',
      'Интерактивная карта зала: три зоны (у окна, для встреч, тихий угол), статусы «свободен / скоро освободится / занят» и выбор стола в один клик.',
      'Онлайн-предзаказ: меню по категориям, корзина с допами и итоговой суммой — напиток готов к точной минуте прихода.',
      'Брони и заказы уходят в Telegram-бот кофейни через серверную функцию Cloudflare: валидация полей, защита от спама и ограничение частоты заявок.',
      'Триггеры конверсии: welcome-промокод −20%, индикатор загрузки зала в часы пик и отдельный сценарий брони ивент-зоны на 8–12 человек.',
      'Стиль ретро-терминала: неоновый зелёный на тёмном фоне, пиксельный шрифт, собственный пиксельный курсор и печенье с предсказаниями в первом экране.'
    ],
    highlight:'Сайт говорит на языке своей аудитории: интерфейс оформлен как игровой терминал 90-х — окна TABLE_BOOKING.SYS и INVENTORY_MENU.DAT, метка «checkpoint loaded». Название Save Point превращается в обещание: здесь можно «сохраниться» — занять стол заранее и не тратить время на поиск места.'
  },
  {
    id:'elara', name:'ELARA Dental', cat:'Стоматология',
    tagline:'Цена без сюрпризов: осмотр, снимки и план лечения — до кресла',
    url:'https://elara-dental.pages.dev/',
    about:'Лендинг новой стоматологической клиники ELARA Dental в Алматы: лечение, эстетика и протезирование для взрослых и детей. Для тех, кто откладывает визит из-за прошлого неудачного опыта и страха неожиданного счёта. Задача — дать новой клинике без отзывов аргументы доверия и привести к записи на консультацию с планом лечения.',
    done:[
      'UX-структура «от страха к доверию»: блок «Знакомая ситуация?» с четырьмя типичными причинами, по которым откладывают стоматолога.',
      'Сценарий приёма в три шага: диагностика со снимками на месте → план лечения с ценой → лечение только после согласия пациента.',
      'Факты в первом экране: 4 направления лечения, 3 вида снимков, 1 визит до плана лечения, 0 скрытых доплат.',
      'Каталог услуг аккордеоном: диагностика, терапия, эстетика, протезирование — без перегрузки страницы.',
      'Блок «Доверие, которое можно проверить»: оборудование, полный цикл в клинике и письменный план вместо отзывов, которых у новой клиники ещё нет.',
      'Спокойная сине-серая палитра, FAQ с «неудобными» вопросами и сквозные CTA на консультацию.'
    ],
    highlight:'У новой клиники нет отзывов, и сайт не делает вид, что они есть. Вместо социальных доказательств — проверяемые факты: снимки КЛКТ и ОПТГ на месте, план лечения с итоговой суммой на руках и честная плашка «станьте первым, кто оставит отзыв».'
  },
  {
    id:'alba', name:'Alba', cat:'Салон красоты',
    tagline:'Красота за 90 минут — премиум без потери времени',
    url:'https://alba-7wj.pages.dev/',
    about:'Премиальный лендинг салона красоты Alba в Алматы для занятых женщин 25–45 лет. Услуги: сложное окрашивание, ногтевой сервис, брови. Задача — снять три главных страха клиентки: «испортят волосы», «отнимут полдня», «обманут с ценой» — и привести к записи через форму или WhatsApp.',
    done:[
      'UX-структура «проблема — решение»: блок «Знакомо?» с типичными салонными болями — и как Alba их решает.',
      'Блок 5 отличий: параллельное обслуживание в 4 руки (по данным салона — экономия времени до 40%), гарантия, фиксированный прайс, стерильность, локация.',
      'Премиальный визуал: лаконичная тёмная палитра, переключатель светлой темы, плавные микроанимации.',
      'Прозрачные услуги и цены: калькулятор стоимости визита и честный фиксированный чек.',
      'Профили мастеров с прямой записью к конкретному специалисту.',
      'Конверсия: сквозные CTA, WhatsApp в 1 клик и FAQ.'
    ],
    highlight:'Заголовок «Красота за 90 минут» превращает абстрактное «быстро» в конкретный факт, а концепция «время для себя» и сценарий премиального визита делают экономию времени частью ценности бренда Alba.'
  },
  {
    id:'proremont', name:'ProRemont', cat:'Ремонт под ключ',
    tagline:'Ремонт без сюрпризов: цена в договоре — не на словах',
    url:'https://proremont-11k.pages.dev/',
    about:'Лендинг ремонтной компании полного цикла в Алматы — черновая отделка, «под ключ», дизайнерский ремонт. Для тех, кто боится типичных рисков ремонта: цена «поплыла», подрядчик пропал, сроки сорваны. Задача — перевести недоверие в заявку через расчёт, конкретные гарантии и примеры объектов.',
    done:[
      'UX-структура «от страхов к гарантиям»: три гарантии по договору — фиксированная цена, поэтапная оплата, неустойка за просрочку.',
      'Объекты в ЖК «Medeu Park» и RAMS City: слайдер «до/после», площадь, срок и бюджет по каждому объекту.',
      'Интерактивный калькулятор стоимости по м² — снимает барьер «нужно звонить, чтобы узнать цену».',
      'Три пакета с ценой от м²: 35 000 / 65 000 / 95 000 ₸ — сразу понятен порядок бюджета.',
      'Строгий инженерный стиль: тёмная сдержанная палитра серьёзного подрядчика.',
      'Конверсия: CTA на замер и расчёт сметы, форма после калькулятора, WhatsApp и Telegram.'
    ],
    highlight:'Гарантии поданы не декларацией, а списком из трёх пунктов договора — то, чего обычно боятся в ремонте, закрыто конкретикой. А объекты с фото до/после работают как визуальное доказательство опыта, а не обещание.'
  },
  {
    id:'tropinka', name:'Тропинка', cat:'Детский центр',
    tagline:'«Тропинка к школе» — подготовка без родительской тревоги',
    url:'https://tropinka.pages.dev/',
    about:'Конверсионный одностраничный сайт для детского центра в Алматы. Программы для детей 3–6 лет: подготовка к школе, логопедия, студия рисования, казахский и английский языки. Задача — снять родительскую тревогу «не опоздали ли мы», понятно объяснить методику и программы и перевести сомневающегося родителя в запись на пробное занятие.',
    done:[
      'UX/UI и структура: логика от боли к решению — доверие и социальные доказательства, методика, программы, преподаватели, цены.',
      'Социальные доказательства: рейтинг центра на 2ГИС (5.0 по данным карточки центра) и отзывы родителей.',
      'Прозрачные программы и тарифы: 3 формата посещений + отдельные услуги — логопед, студия рисования.',
      'Блок преподавателей: профили специалистов закрывают возражение «кому я доверяю ребёнка».',
      'Адаптивная вёрстка под мобильные, с которых заходит основной трафик родителей.',
      'Техническая оптимизация: AVIF, WebP, WOFF2 — быстрая загрузка; конверсия через форму записи, WhatsApp, прайс и сквозные CTA.'
    ],
    highlight:'Дизайн-блок «Мысль → Движение → Творчество» визуализирует саму методику центра, а не просто описывает её текстом. Родитель считывает подход «Тропинки» ещё до чтения программы, а мягкая природная палитра и образ пути формируют чувство безопасности и заботы с первой секунды.'
  },
  {
    id:'steps', name:'Steps', cat:'Детский развивающий центр',
    tagline:'Прозрачность, которую можно увидеть: камеры и диагностика',
    url:'https://stupenky.pages.dev/',
    about:'Лендинг детского развивающего центра Steps в Алматы для детей 1,5–7 лет (речевое развитие, логика, подготовка к школе). Для родителей, которых пугает неизвестность — «а что там реально происходит с ребёнком». Задача — перевести это в запись на бесплатное пробное занятие через прозрачность.',
    done:[
      'UX-структура, снимающая страхи по одному: адаптация без слёз, видимый прогресс, без скрытых доплат, стабильные педагоги.',
      'Прозрачность как ценность: онлайн-камеры и трансляции с занятий, ежемесячная диагностика, запись без обязательств.',
      'Разворачивающиеся карточки от психолога и логопеда — ответы на конкретные вопросы родителей.',
      'Три тарифа с таблицей «что входит»: 15 900–38 900 ₸.',
      'Короткая форма записи на бесплатное пробное занятие с обещанием ответа в Telegram в течение 15 минут.',
      'Тёплая кремовая палитра и мягкий игровой визуал.'
    ],
    highlight:'Заголовок «Каждый шаг — развитие» подкреплён конкретной функцией: доступ к трансляции с занятий и ежемесячная диагностика. Родитель не просто верит на слово, а видит прогресс и может убедиться в безопасности ребёнка.'
  },
  {
    id:'targetolog', name:'Азамат Жеңісұлы', cat:'Таргетолог',
    tagline:'Системный таргет вместо «настроил и надеялся»: 7 шагов и живой расчёт цели',
    url:'https://azamat-targetolog.pages.dev/v1',
    about:'Персональный сайт таргетолога из Алматы, который запускает рекламу в Instagram, Facebook и TikTok для товарного бизнеса, сферы услуг, экспертов и онлайн-школ. Услуга невидимая, а главный вопрос предпринимателя — «вернутся ли мои деньги». Задача — показать подход и логику работы, назвать результат языком денег (×3) и привести к разговору в WhatsApp.',
    done:[
      'Оффер на первом экране — «Таргетированная реклама, которая окупается ×3» — и четыре цифры доверия: 4+ года практики, ×3 целевой ROI, 5–10 видеокреативов на запуск, 80% успеха рекламы зависит от креатива.',
      'Блок «Обо мне» с принципами работы (аналитика, креативная стратегия, работа на окупаемость, системный подход) и списком ниш: товарный бизнес, услуги, эксперты, онлайн-школы.',
      'Система из 7 шагов — от анализа аудитории и ТЗ для видеокреативов до A/B-тестов, оптимизации и отчётности — карточками «бенто» вместо длинного текста.',
      'Интерактивный расчёт цели: ползунок бюджета показывает целевой возврат и чистую прибыль (вложения 1 000 000 ₸ → 3 000 000 ₸ возврата).',
      'Честный подход к отзывам: вместо выдуманных цитат — контакты действующих клиентов по запросу.',
      'Конверсия: кнопка WhatsApp в шапке и на каждом экране, закреплённая кнопка «Обсудить проект» на телефоне и копирование номера в один клик.'
    ],
    highlight:'Сайт говорит на языке предпринимателя: не охваты и клики, а «1 ₸ → 3 ₸+». Ползунок калькулятора превращает обещание в цифры для бюджета самого клиента, а тёмная палитра с изумрудным акцентом и фото эксперта на первом экране задают тон спокойной профессиональной уверенности.'
  },
  {
    id:'wedding', name:'Айгерим &amp; Тимур', cat:'Свадебное приглашение',
    tagline:'Всё, о чём гость спросил бы в чате, — на одной странице',
    url:'https://azamat-targetolog.pages.dev/v2',
    about:'Сайт-приглашение на свадьбу 12 июня 2027 года в саду «Бес Терек» в предгорьях Алатау. Обычно гостям приходится собирать детали из десятка сообщений: во сколько, куда ехать, что надеть, где сидеть, что дарить. Задача — собрать всё по одному адресу и получить от каждого гостя ответ о присутствии, выборе горячего и трансфере.',
    done:[
      'Первый экран: имена пары, дата, обратный отсчёт до свадьбы и две кнопки — «Подтвердить присутствие» и «Программа дня».',
      '«Как всё началось»: история пары таймлайном из трёх вех — 2019, 2022, 2026 — живым личным тоном вместо шаблонного приглашения.',
      'Программа дня с таймлайном, карточкой места и логистикой: адрес, трансфер в 13:00 от площади Республики с возвратом в 23:30, бесплатная парковка на 60 машин.',
      'Дресс-код через палитру: восемь цветов «летних гор» — гранат, шафран, бирюза, пыльная роза и другие — и понятное предупреждение, что белый и молочный остаются за невестой.',
      'Рассадка с поиском: гость вводит имя или фамилию и находит свой стол среди 6 столов и 33 приглашений; столы названы в честь мест, где пара бывала вдвоём.',
      'Вишлист с кнопкой «Я подарю», чтобы подарки не повторялись, и анкета гостя: присутствие, число гостей, горячее (бешбармак, форель, овощное), трансфер, песня для танцпола и пожелание молодым на общую стену.'
    ],
    highlight:'Сайт говорит голосом пары: «Три года, две вершины и одна очередь на канатку», шутка про три кофемашины в вишлисте и казахское приветствие «Тойымызға қош келдіңіздер!» на первом экране. Практичные блоки — рассадка, трансфер, анкета — поданы через характер пары, поэтому информация не выглядит инструкцией.'
  },
  {
    id:'birthday', name:'Миссия «Мирон-7»', cat:'Детский праздник',
    tagline:'Родители отвечают за минуту, ребёнок ждёт старта',
    url:'https://azamat-targetolog.pages.dev/v3',
    about:'Сайт-приглашение на седьмой день рождения в космической теме: 17 октября 2026, 14:00–18:00, детский центр «Орбита» в Алматы. Родителям приглашённых детей нужно быстро понять, куда и во сколько идти, что надеть и что подарить, а организатору — собрать ответы, аллергии и время забора без десятка личных сообщений. Задача — превратить организационную рассылку в игру, в которую интересно играть и взрослым, и детям.',
    done:[
      'Первый экран: «Мирону — 7!», ракета с подсказками «пуск в 14:00» и «нажми на ракету», дата, время, место, дресс-код и обратный отсчёт до старта.',
      'Программа как «полётный план»: время, этапы и цветные метки (Встреча, Игры, Квест, Еда, Шоу); в день праздника текущий пункт подсвечивается сам.',
      '«Кого мы ждём»: гости карточками членов экипажа с ролями (штурман, бортинженер, пилот) и счётчики «Летят / Ответили / На борту», которые обновляются по мере ответов.',
      'Грузовой отсек вместо вишлиста: кнопка «Я подарю» отмечает подарок, чтобы у именинника не оказалось двух телескопов, и показывает ориентир по цене.',
      'Анкета «Кто летит?»: имя из списка, три статуса (Лечу! / Пока не знаю / Не получится), счётчики детей и взрослых, пожелание Мирону и поле «Что важно знать организаторам».',
      'Посадочный талон после ответа и памятка для экипажа: сменная обувь, блестящая одежда, родители могут остаться, забрать детей можно с 17:50 до 18:15.'
    ],
    highlight:'Вся логистика праздника подана как космический рейс: приглашение — «приглашение на борт», регистрация — «посадочный талон», пожелания — «бортовой журнал». Интерфейс остаётся понятным для родителей, а ребёнку достаются ракета и собственный посадочный талон; плотные контуры и оранжево-розовые акценты на светло-голубом фоне держат настроение детской мультяшной игры.'
  }
];
works.forEach(w => {
  // Translated fields (cat, tagline, about, done, highlight) replace the Russian ones
  Object.assign(w, L10N.works && L10N.works[w.id]);
  w.shots = shots(w.id);
  w.mshots = mshots(w.id);
});

/* ---------- 6. Кейс проекта ---------- */
const modal = document.getElementById('workModal');
const modalBody = document.getElementById('modalBody');
const modalScroll = document.getElementById('modalScroll');
let curWork = null, shotIdx = 0, lastFocus = null;
// Phone users get phone screenshots; the set is picked at open time and re-picked on breakpoint change
const curShots = () => MOBILE.matches ? curWork.mshots : curWork.shots;
const shotAlt = i => T.shotAlt(curWork.name.replace('&amp;', '&'), i + 1, curShots().length);
const ICON = d => '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></svg>';

function renderWork() {
  const list = curShots();
  modalBody.innerHTML =
    '<div class="case-top">' +
      '<p id="shotCnt" class="case-count" aria-live="polite">1 / ' + list.length + '</p>' +
      '<button type="button" class="case-btn" data-close aria-label="' + T.closeCase + '">' + ICON('M18 6L6 18M6 6l12 12') + '</button>' +
    '</div>' +
    '<div class="case-media">' +
      '<img id="shotImg" src="' + list[0] + '" alt="' + shotAlt(0) + '" ' + (MOBILE.matches ? 'width="585" height="1266"' : 'width="1416" height="768"') + '>' +
    '</div>' +
    // Controls sit outside the screenshot so they never cover the project's own interface
    '<div class="case-nav">' +
      '<button type="button" class="case-btn" data-dir="-1" aria-label="' + T.prevShot + '">' + ICON('M15 18l-6-6 6-6') + '</button>' +
      '<div id="thumbs" class="case-thumbs">' +
        list.map((s, i) =>
          '<button type="button" data-thumb="' + i + '" aria-label="' + T.showScreen(i + 1) + '"' + (i === 0 ? ' aria-current="true"' : '') + '><img src="' + s + '" alt="" loading="lazy"></button>'
        ).join('') +
      '</div>' +
      '<button type="button" class="case-btn" data-dir="1" aria-label="' + T.nextShot + '">' + ICON('M9 6l6 6-6 6') + '</button>' +
    '</div>' +
    '<div class="case-body">' +
      '<h3 id="workTitle">' + curWork.name + '</h3>' +
      '<p class="case-meta">' + curWork.cat + ' · ' + T.city + '</p>' +
      '<p class="case-tagline">' + curWork.tagline + '</p>' +
      '<p>' + curWork.about + '</p>' +
      '<h4>' + T.done + '</h4>' +
      '<ul class="case-done">' + curWork.done.map(d => '<li>' + d + '</li>').join('') + '</ul>' +
      '<div class="case-hl"><h4>' + T.highlight + '</h4><p>' + curWork.highlight + '</p></div>' +
      '<div class="case-actions">' +
        '<a href="#contact" data-to-form class="btn btn-primary">' + T.wantSimilar + ' ' + ARR + '</a>' +
        // Live link is optional: projects without a public URL simply don't get the button
        (curWork.url ? '<a href="' + curWork.url + '" target="_blank" rel="noopener" class="link-out">' + T.viewSite + ' ' + EXT + '</a>' : '') +
        '<p class="note">' + T.tellMore('<a href="' + TG + '" target="_blank" rel="noopener">' + T.tellMoreLink + '</a>') + '</p>' +
      '</div>' +
    '</div>';
}
function openWork(id, trigger) {
  curWork = works.find(w => w.id === id);
  if (!curWork) return;
  shotIdx = 0;
  lastFocus = trigger || document.activeElement;
  renderWork();
  modal.hidden = false;
  document.documentElement.style.overflow = 'hidden';
  modalScroll.scrollTop = 0;
  raf2(() => modal.classList.add('open'));
  // Move focus inside the dialog; the title gives screen readers the case name
  modal.querySelector('button[data-close]').focus();
  track('case_open', { case: id });
}
function closeWork(returnFocus = true) {
  if (modal.hidden) return;
  if (!returnFocus) lastFocus = null;
  modal.classList.remove('open');
  later(() => {
    modal.hidden = true;
    document.documentElement.style.overflow = '';
    // Return focus to the control that opened the case; the 3D world has none, so the card's button takes it
    if (lastFocus && lastFocus.isConnected && lastFocus.offsetParent !== null) lastFocus.focus({ preventScroll: true });
  }, 350);
}
function setShot(i) {
  const list = curShots(), n = list.length;
  shotIdx = (i + n) % n;
  const img = document.getElementById('shotImg');
  img.src = list[shotIdx];
  img.alt = shotAlt(shotIdx);
  document.getElementById('shotCnt').textContent = (shotIdx + 1) + ' / ' + n;
  document.querySelectorAll('#thumbs button').forEach((t, k) => {
    if (k === shotIdx) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
  });
}
MOBILE.addEventListener('change', () => {
  if (!curWork || modal.hidden) return;
  const keep = shotIdx;
  renderWork();
  setShot(keep);
});
document.addEventListener('click', e => {
  const opener = e.target.closest('[data-open]');
  if (opener) openWork(opener.dataset.open, opener.closest('.work')?.querySelector('.work-actions [data-open]') || opener);
});
modal.addEventListener('click', e => {
  // "Хочу похожий сайт": close the case first (page scroll is locked while it's open), then go to the form
  const toForm = e.target.closest('[data-to-form]');
  if (toForm) {
    e.preventDefault();
    closeWork(false);
    later(() => {
      document.getElementById('contact').scrollIntoView({ behavior: REDUCED.matches ? 'auto' : 'smooth' });
      form.elements.message.focus({ preventScroll: true });
    }, 380);
    return;
  }
  if (e.target.closest('[data-close]')) return closeWork();
  const nav = e.target.closest('[data-dir]');
  if (nav) return setShot(shotIdx + +nav.dataset.dir);
  const th = e.target.closest('[data-thumb]');
  if (th) return setShot(+th.dataset.thumb);
});
addEventListener('keydown', e => {
  if (modal.hidden) return;
  if (e.key === 'Escape') return closeWork();
  if (e.key === 'ArrowRight') return setShot(shotIdx + 1);
  if (e.key === 'ArrowLeft') return setShot(shotIdx - 1);
  if (e.key === 'Tab') {
    // Focus trap: Tab cycles through the dialog's own controls only
    const f = [...modal.querySelectorAll('a[href], button:not([disabled])')].filter(el => el.offsetParent !== null);
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (document.activeElement === last || !modal.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
  }
});

/* ---------- 7. Год в футере ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- 8. 3D-мир ---------- */
// Three stagings of one world: "full" — desktop camera route with the works hung in 3D;
// "mobile" — a short vertical route behind ordinary cards; "lite" — no WebGL, the static crown drawing.
// ?world=full|mobile|lite forces a staging (for checking).
const html = document.documentElement;
function webglOK() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
}
const WIDE = matchMedia('(min-width: 1100px)');
function pickStaging() {
  const forced = qs.get('world');
  if (['full', 'mobile', 'lite'].includes(forced)) return forced;
  if (REDUCED.matches || !webglOK()) return 'lite';
  const net = navigator.connection;
  if (net && (net.saveData || /(^|-)2g$/.test(net.effectiveType || ''))) return 'lite';
  const weak = (navigator.deviceMemory && navigator.deviceMemory < 3) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);
  if (!WIDE.matches) return weak ? 'lite' : 'mobile';
  return 'full';
}
let staging = pickStaging();
let world = null;
function setStagingClasses() {
  html.classList.toggle('world-on', staging !== 'lite');
  html.classList.toggle('world-full', staging === 'full');
  html.classList.toggle('world-mobile', staging === 'mobile');
  html.classList.toggle('world-lite', staging === 'lite');
}
function goLite() {
  staging = 'lite';
  if (world) { world.dispose(); world = null; }
  html.classList.remove('world-ready');
  setStagingClasses();
  updateRoute();
}
setStagingClasses();
if (staging !== 'lite') {
  // The world loads after the page is usable: text, buttons and the form never wait for it
  const boot = () => import(ROOT + 'dist/world.js')
    .then(m => m.createWorld({
      root: document.getElementById('world'),
      staging,
      assets: ROOT,
      onReady: () => html.classList.add('world-ready'),
      onDegrade: goLite,
      onOpen: id => openWork(id, document.querySelector('#work-' + id + ' .work-actions [data-open]')),
    }))
    .then(w => { world = w; })
    .catch(goLite);
  if (document.readyState === 'complete') setTimeout(boot, 0);
  else addEventListener('load', () => setTimeout(boot, 0), { once: true });
  // Crossing the desktop breakpoint switches between the full and the mobile staging
  WIDE.addEventListener('change', () => {
    if (staging === 'lite') return;
    staging = WIDE.matches ? 'full' : 'mobile';
    setStagingClasses();
    if (world) world.setStaging(staging);
    updateRoute();
  });
  REDUCED.addEventListener('change', () => { if (REDUCED.matches) goLite(); });
}
