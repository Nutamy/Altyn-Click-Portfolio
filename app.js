/* ================================================================
   Altyn Click — вся логика страницы
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

const ARR = '<svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const CHK = '<svg aria-hidden="true" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
const fmt = n => n.toLocaleString('ru-RU');
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
});

/* ---------- 1. Шапка, меню, reveal ---------- */
const hdr = document.getElementById('hdr');
const HDR_ON = ['bg-paper/90', 'backdrop-blur-md', 'shadow-sm', 'border-b', 'border-line'];
let hdrScrolled = false;
addEventListener('scroll', () => {
  const on = scrollY > 12;
  if (on === hdrScrolled) return;
  hdrScrolled = on;
  HDR_ON.forEach(c => hdr.classList.toggle(c, on));
}, { passive: true });

const mobMenu = document.getElementById('mobMenu');
const burger = document.getElementById('burger');
function setMenu(open) {
  mobMenu.classList.toggle('hidden', !open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
}
burger.addEventListener('click', () => setMenu(mobMenu.classList.contains('hidden')));
mobMenu.querySelectorAll('.mob-link').forEach(a => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', e => {
  if (e.key === 'Escape' && !mobMenu.classList.contains('hidden')) { setMenu(false); burger.focus(); }
});

const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- 2. FAQ ---------- */
const faqBtns = [...document.querySelectorAll('.faq-q')];
faqBtns.forEach((btn, i) => {
  const panel = btn.nextElementSibling;
  panel.id = 'faq-a-' + i;
  btn.id = 'faq-q-' + i;
  btn.setAttribute('aria-controls', panel.id);
  btn.setAttribute('aria-expanded', 'false');
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-labelledby', btn.id);
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    faqBtns.forEach(b => {
      b.closest('.faq-item').classList.remove('open');
      b.setAttribute('aria-expanded', 'false');
    });
    if (!wasOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
  });
});

/* ---------- 3. Калькулятор опций + промокод ---------- */
const form = document.getElementById('auditForm');
const optCards = [...document.querySelectorAll('.opt')];
const optField = document.getElementById('f-options');
const calcSummary = document.getElementById('calcSummary');
const promoLine = document.getElementById('optPromoLine');
let promo = null; // { code, label, percent?, amount? } once the server confirms the code

function calc() {
  const picked = optCards.filter(c => c.classList.contains('on'));
  const subtotal = BASE_PRICE + picked.reduce((sum, c) => sum + +c.dataset.price, 0);
  let discount = 0;
  if (promo) discount = Math.min(subtotal, promo.percent ? Math.round(subtotal * promo.percent / 100) : promo.amount);
  return { picked, subtotal, discount, total: subtotal - discount };
}
const promoText = p => p.percent ? '−' + p.percent + '%' : '−' + fmt(p.amount) + ' ₸';

function recalc() {
  const { picked, subtotal, discount, total } = calc();
  const optSum = subtotal - BASE_PRICE;
  document.getElementById('optSumLabel').textContent = optSum ? '+ ' + fmt(optSum) + ' ₸ (опции)' : '— пока без опций';
  document.getElementById('optTotal').textContent = fmt(total) + ' ₸';
  promoLine.hidden = !promo;
  if (promo) promoLine.textContent = 'Промокод ' + promo.code + ': ' + promoText(promo) + ' (−' + fmt(discount) + ' ₸)';

  // The form carries option ids; the summary tells the visitor what will be sent
  optField.value = picked.map(c => c.dataset.opt).join(',');
  calcSummary.hidden = !picked.length && !promo;
  if (!calcSummary.hidden) {
    const names = picked.map(c => c.querySelector('h3').textContent.trim());
    calcSummary.innerHTML = ''; // rebuilt from our own strings below, no user input
    const add = (label, value) => {
      const row = document.createElement('div');
      row.className = 'flex justify-between gap-3';
      row.innerHTML = '<span></span><b class="whitespace-nowrap"></b>';
      row.children[0].textContent = label;
      row.children[1].textContent = value;
      calcSummary.appendChild(row);
    };
    add('Лендинг под ключ', fmt(BASE_PRICE) + ' ₸');
    if (names.length) add('Опции: ' + names.join(', '), '+ ' + fmt(subtotal - BASE_PRICE) + ' ₸');
    if (promo) add('Промокод ' + promo.code, '− ' + fmt(discount) + ' ₸');
    add('Предварительный итог', fmt(total) + ' ₸');
  }
}
optCards.forEach(card => card.addEventListener('click', () => {
  card.setAttribute('aria-pressed', String(card.classList.toggle('on')));
  recalc();
}));
// Leaving the calculator for the form: land on the first field
document.getElementById('optCta').addEventListener('click', () => {
  setTimeout(() => form.elements.name.focus({ preventScroll: true }), REDUCED.matches ? 0 : 500);
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
  promoMsg.className = 'text-xs mt-1.5 ' + (ok ? 'text-[#2F7A4A] font-bold' : 'text-red-700');
}
async function applyPromo() {
  const code = promoInput.value.trim().toUpperCase();
  promo = null;
  if (!code) { setPromoMsg('', true); recalc(); return; }
  setPromoMsg('Проверяю…', true);
  try {
    const r = await fetch('/api/promo', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const d = await r.json();
    if (d.ok) {
      promo = d;
      setPromoMsg('Промокод применён: ' + promoText(d) + (d.label ? ' · ' + d.label : '') + '. Итоговую сумму подтвержу в ответе.', true);
      track('promo_applied', { code: d.code });
    } else {
      setPromoMsg(d.error === 'expired' ? 'Срок действия промокода закончился.' : 'Такого промокода нет — проверьте написание.', false);
    }
  } catch {
    setPromoMsg('Не получилось проверить промокод. Отправьте заявку — проверю его сама.', false);
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
const btn = document.getElementById('auditBtn');
const BTN_TXT = btn.textContent;
const REQUIRED = [
  { el: form.elements.name, err: document.getElementById('f-name-err') },
  { el: form.elements.contact, err: document.getElementById('f-contact-err') },
  { el: form.elements.consent, err: document.getElementById('f-consent-err') },
];
const filled = el => el.type === 'checkbox' ? el.checked : !!el.value.trim();
function setFieldError(f, bad) {
  f.el.setAttribute('aria-invalid', String(bad));
  f.err.hidden = !bad;
}
// Clear a field's error as soon as the user fixes it
REQUIRED.forEach(f => f.el.addEventListener(f.el.type === 'checkbox' ? 'change' : 'input', () => { if (filled(f.el)) setFieldError(f, false); }));

function showFormError(text) {
  let err = document.getElementById('auditErr');
  if (!err) {
    err = document.createElement('p');
    err.id = 'auditErr';
    err.setAttribute('role', 'alert');
    err.className = 'text-sm text-center text-red-700';
    form.appendChild(err);
  }
  // Static markup with our own text only, never user input
  err.innerHTML = text + ' Или напишите в <a href="' + TG + '" target="_blank" rel="noopener" class="font-bold underline">Telegram</a> / <a href="' + WA + '" target="_blank" rel="noopener" class="font-bold underline">WhatsApp</a>.';
}
const SERVER_ERRORS = {
  captcha: 'Проверка от спама не прошла — попробуйте ещё раз.',
  contact: 'Проверьте контакт: нужен телефон или ник в Telegram.',
  required: 'Заполните имя и контакт.',
  consent: 'Отметьте согласие на обработку данных.',
};

// Cloudflare Turnstile: loaded only when a site key is configured
let turnstileId = null;
if (TURNSTILE_SITEKEY) {
  window.onTurnstileLoad = () => {
    turnstileId = turnstile.render('#turnstileBox', { sitekey: TURNSTILE_SITEKEY, language: 'ru' });
  };
  const ts = document.createElement('script');
  ts.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit';
  ts.async = true;
  document.head.appendChild(ts);
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const invalid = REQUIRED.filter(f => !filled(f.el));
  REQUIRED.forEach(f => setFieldError(f, invalid.includes(f)));
  if (invalid.length) { invalid[0].el.focus(); return; }

  btn.disabled = true;
  btn.textContent = 'Отправляю…';
  // An unconfirmed code still travels with the lead; the server re-checks it
  fetch('/api/lead', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(new FormData(form))),
  })
    .then(r => r.json().then(d => { if (!r.ok || !d.ok) throw new Error(d.error || r.status); }))
    .then(() => {
      form.classList.add('hidden');
      document.getElementById('auditOk').classList.remove('hidden');
      document.getElementById('auditOkTitle').focus();
      track('lead_submit', { promo: promo ? promo.code : '', options: optField.value });
    })
    .catch(err => {
      btn.disabled = false;
      btn.textContent = BTN_TXT;
      // Turnstile tokens are single-use: a new one is needed for the retry
      if (turnstileId !== null && window.turnstile) turnstile.reset(turnstileId);
      showFormError(SERVER_ERRORS[err.message] || 'Не получилось отправить. Попробуйте ещё раз.');
    });
});

/* ---------- 5. Портфолио: данные ---------- */
// Every project ships 5 desktop (1416×768) and 5 mobile (585×1266 = 390px viewport @1.5x) WebP shots; 01 = hero, 02–05 = key sections
const shots = id => [1,2,3,4,5].map(n => 'screenshots/' + id + '/0' + n + '.webp');
const mshots = id => [1,2,3,4,5].map(n => 'screenshots/' + id + '/m/0' + n + '.webp');
// Must match the Tailwind `sm` breakpoint used in the image classes below
const MOBILE_Q = '(max-width: 639px)';
const MOBILE = matchMedia(MOBILE_Q);
// Figures in case texts are only those visible on the client's live site or in its screenshots
const works = [
  {
    id:'savepoint', name:'Save Point', cat:'Кофейня и коворкинг',
    tag:'Стол с розеткой и кофе к нужной минуте',
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
    tag:'Стоматология с ценой, известной до лечения',
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
    tag:'Красота за 90 минут · время для себя',
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
    tag:'Ремонт квартир без сюрпризов',
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
    tag:'Подготовка к школе и развитие детей 3–6 лет',
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
    tag:'Каждый шаг — развитие, и каждый шаг виден',
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
  }
];
works.forEach(w => {
  w.cover = shots(w.id)[0];
  w.shots = shots(w.id);
  w.mshots = mshots(w.id);
  w.mcover = w.mshots[0];
});

/* ---------- 6. Портфолио: стопка → кейс, сетка по кнопке ---------- */
// Grid cards are static HTML (indexable); the stack is built here from the same data
const pic = (w, cls) =>
  '<picture><source media="' + MOBILE_Q + '" srcset="' + w.mcover + '" width="585" height="1266">' +
  '<img src="' + w.cover + '" alt="" width="1416" height="768" loading="lazy" decoding="async" class="' + cls + '"></picture>';
const stackEl = document.getElementById('workStack');
const gridEl  = document.getElementById('workGrid');
const galToggle = document.getElementById('galToggle');
const galBtnTxt = document.getElementById('galBtnTxt');
let expanded = false;

works.forEach((w, i) => {
  // Stack card: a real button that opens the case directly (no intermediate grid step)
  const sp = document.createElement('button');
  sp.type = 'button';
  sp.className = 'ws-pos text-left';
  sp.dataset.work = w.id;
  sp.setAttribute('aria-haspopup', 'dialog');
  sp.style.zIndex = 10 + i * 10;
  sp.innerHTML =
    // Visible text stays the accessible name; the prefix only adds context for screen readers
    '<span class="sr-only">Открыть кейс: </span>' +
    '<div class="ws-card w-44 sm:w-56 md:w-64 rounded-3xl bg-white border border-line shadow-xl overflow-hidden">' +
      pic(w, 'w-full aspect-[4/5] sm:aspect-[59/32] object-cover object-top pointer-events-none select-none') +
      '<div class="p-3 md:p-4"><div class="text-[10px] font-disp uppercase tracking-[0.2em] text-golddeep">' + w.cat + '</div>' +
      '<div class="font-extrabold text-sm md:text-base leading-tight mt-1">' + w.name + '</div></div></div>';
  // Hovered or focused card comes to the front so it's fully visible
  const front = () => sp.style.zIndex = 100;
  const back = () => sp.style.zIndex = 10 + i * 10;
  sp.addEventListener('mouseenter', front);
  sp.addEventListener('mouseleave', back);
  sp.addEventListener('focus', front);
  sp.addEventListener('blur', back);
  stackEl.appendChild(sp);
});

// Switch from the no-JS grid to the stack view
stackEl.hidden = false;
gridEl.style.display = 'none';
document.getElementById('galControls').hidden = false;

function layoutStack() {
  if (expanded) return;
  const cards = [...stackEl.children];
  // Fan spans a fixed width and ±14° regardless of card count; k is normalized to -1…1
  const half = (cards.length - 1) / 2 || 1;
  const spread = Math.min(stackEl.clientWidth * 0.46, 300);
  cards.forEach((c, i) => {
    const k = (i - half) / half;
    const y = 16 * k * k;
    c.style.transform = 'translate(-50%,-50%) translateX(' + (k * spread) + 'px) translateY(' + y + 'px) rotate(' + (k * 14) + 'deg)';
  });
}
layoutStack();
addEventListener('resize', layoutStack, { passive: true });

function expand() {
  expanded = true;
  stackEl.classList.add('hide');
  galBtnTxt.textContent = 'Свернуть галерею';
  galToggle.setAttribute('aria-expanded', 'true');
  later(() => {
    stackEl.style.display = 'none';
    gridEl.style.display = 'grid';
    gridEl.classList.add('prep');
    raf2(() => gridEl.classList.remove('prep'));
  }, 380);
}
function collapse() {
  expanded = false;
  gridEl.classList.add('prep');
  galBtnTxt.textContent = 'Смотреть все проекты';
  galToggle.setAttribute('aria-expanded', 'false');
  later(() => {
    gridEl.style.display = 'none';
    stackEl.style.display = '';
    layoutStack();
    raf2(() => stackEl.classList.remove('hide'));
  }, 300);
}
galToggle.addEventListener('click', () => expanded ? collapse() : expand());
[stackEl, gridEl].forEach(root => root.addEventListener('click', e => {
  const card = e.target.closest('[data-work]');
  if (card) openWork(card.dataset.work, card);
}));

/* ---------- 7. Модалка проекта ---------- */
const modal = document.getElementById('workModal');
const modalBody = document.getElementById('modalBody');
let curWork = null, shotIdx = 0, lastFocus = null;
// Phone users get phone screenshots; the set is picked at open time and re-picked on breakpoint change
const curShots = () => MOBILE.matches ? curWork.mshots : curWork.shots;
const shotAlt = i => 'Скриншот сайта ' + curWork.name + ', экран ' + (i + 1) + ' из ' + curShots().length;
const thumbCls = on => 'th flex-none w-12 h-20 sm:w-20 sm:h-14 rounded-xl overflow-hidden border-2 ' +
  (on ? 'border-gold' : 'border-transparent opacity-70 hover:opacity-100') + ' transition bg-ink';

const EXT = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
function renderWork() {
  modalBody.innerHTML =
    '<div class="relative bg-ink select-none">' +
      '<img id="shotImg" src="' + curShots()[0] + '" alt="' + shotAlt(0) + '" ' + (MOBILE.matches ? 'width="585" height="1266"' : 'width="1416" height="768"') + ' class="w-full aspect-[585/1266] max-h-[75vh] object-contain sm:aspect-[59/32] sm:max-h-none sm:object-cover object-top bg-ink">' +
      '<button type="button" data-dir="-1" aria-label="Предыдущий скриншот" class="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-gold text-white backdrop-blur flex items-center justify-center transition"><svg aria-hidden="true" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>' +
      '<button type="button" data-dir="1" aria-label="Следующий скриншот" class="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-gold text-white backdrop-blur flex items-center justify-center transition"><svg aria-hidden="true" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>' +
      '<div id="shotCnt" aria-live="polite" class="absolute bottom-3 right-4 text-xs font-bold text-white bg-black/50 backdrop-blur px-3 py-1.5 rounded-full">1 / ' + curShots().length + '</div>' +
      '<button type="button" data-close aria-label="Закрыть кейс" class="absolute top-3 right-3 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur flex items-center justify-center transition"><svg aria-hidden="true" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>' +
    '</div>' +
    '<div id="thumbs" class="flex gap-2 px-5 md:px-8 -mt-6 relative z-10 overflow-x-auto pb-1">' +
      curShots().map((s, i) =>
        '<button type="button" data-thumb="' + i + '" aria-label="Показать экран ' + (i + 1) + '"' + (i === 0 ? ' aria-current="true"' : '') + ' class="' + thumbCls(i === 0) + '"><img src="' + s + '" alt="" loading="lazy" class="w-full h-full object-cover object-top"></button>'
      ).join('') +
    '</div>' +
    '<div class="p-6 md:p-9">' +
      '<div class="flex flex-wrap items-center gap-2">' +
        '<span class="text-[10px] font-disp uppercase tracking-[0.2em] bg-gold/15 text-golddeep px-3 py-1.5 rounded-full">' + curWork.cat + '</span>' +
        '<span class="text-[10px] font-disp uppercase tracking-[0.2em] border border-line text-mut px-3 py-1.5 rounded-full">Алматы</span></div>' +
      '<h3 id="workTitle" class="font-disp font-semibold text-2xl md:text-[1.7rem] mt-4 leading-tight">' + curWork.name + '</h3>' +
      '<p class="text-golddeep font-bold mt-1.5">' + curWork.tagline + '</p>' +
      '<p class="mt-4 text-mut leading-relaxed">' + curWork.about + '</p>' +
      '<h4 class="mt-8 text-[11px] font-disp uppercase tracking-[0.22em] text-mut font-normal">Что сделано</h4>' +
      '<ul class="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-3">' +
        curWork.done.map(d => '<li class="chk"><span class="ic">' + CHK + '</span><p>' + d + '</p></li>').join('') +
      '</ul>' +
      '<div class="mt-8 rounded-2xl bg-gold/10 border-l-4 border-gold p-5">' +
        '<div class="text-[10px] font-disp uppercase tracking-[0.22em] text-golddeep mb-2">Изюминка</div>' +
        '<p class="leading-relaxed text-ink/85">' + curWork.highlight + '</p></div>' +
      '<div class="mt-8 flex flex-wrap items-center gap-4">' +
        '<a href="#audit" data-to-form class="btn btn-gold px-7 py-3.5">Хочу похожий сайт ' + ARR + '</a>' +
        // Live link is optional: projects without a public URL simply don't get the button
        (curWork.url ? '<a href="' + curWork.url + '" target="_blank" rel="noopener" class="btn btn-ghost px-7 py-3.5">Посмотреть сайт ' + EXT + '</a>' : '') +
        '<span class="text-sm text-mut">Расскажу подробнее о решениях по проекту — <a href="' + TG + '" target="_blank" rel="noopener" class="font-bold underline text-golddeep">в Telegram</a>.</span></div>' +
    '</div>';
}
function openWork(id, trigger) {
  curWork = works.find(w => w.id === id);
  shotIdx = 0;
  lastFocus = trigger || document.activeElement;
  renderWork();
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.overflow-y-auto').scrollTop = 0;
  raf2(() => modal.classList.add('open'));
  // Move focus inside the dialog; the title gives screen readers the case name
  modal.querySelector('button[data-close]').focus();
  track('case_open', { case: id });
}
function closeWork(returnFocus = true) {
  if (modal.classList.contains('hidden')) return;
  if (!returnFocus) lastFocus = null;
  modal.classList.remove('open');
  later(() => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    // Return focus to the card that opened the case (it may be hidden if the view switched)
    if (lastFocus && lastFocus.offsetParent !== null) lastFocus.focus();
  }, 300);
}
function setShot(i) {
  const list = curShots(), n = list.length;
  shotIdx = (i + n) % n;
  const img = document.getElementById('shotImg');
  img.src = list[shotIdx];
  img.alt = shotAlt(shotIdx);
  document.getElementById('shotCnt').textContent = (shotIdx + 1) + ' / ' + n;
  document.querySelectorAll('#thumbs .th').forEach((t, k) => {
    t.className = thumbCls(k === shotIdx);
    if (k === shotIdx) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
  });
}
MOBILE.addEventListener('change', () => {
  if (!curWork || modal.classList.contains('hidden')) return;
  const keep = shotIdx;
  renderWork();
  setShot(keep);
});
modal.addEventListener('click', e => {
  // "Хочу похожий сайт": close the case first (body scroll is locked while it's open), then go to the form
  const toForm = e.target.closest('[data-to-form]');
  if (toForm) {
    e.preventDefault();
    closeWork(false);
    later(() => {
      document.getElementById('audit').scrollIntoView({ behavior: REDUCED.matches ? 'auto' : 'smooth' });
      form.elements.name.focus({ preventScroll: true });
    }, 320);
    return;
  }
  if (e.target.closest('[data-close]') || e.target.dataset.close !== undefined) return closeWork();
  const nav = e.target.closest('[data-dir]');
  if (nav) return setShot(shotIdx + +nav.dataset.dir);
  const th = e.target.closest('[data-thumb]');
  if (th) return setShot(+th.dataset.thumb);
});
addEventListener('keydown', e => {
  if (modal.classList.contains('hidden')) return;
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

/* ---------- 8. Год в футере ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
