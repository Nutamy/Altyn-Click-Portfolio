# Аудит сайта Altyn Click — 24.09.2026

**Источник:** репозиторий `Altyn Click Portfolio` (`index.html`, `functions/api/lead.js`, ассеты). Рендер: Playwright + Chromium с локально собранным Tailwind и реальными шрифтами Manrope/Unbounded, ширины 1440/1280/768/390/375/360. Контраст считается по формуле WCAG из цветов в CSS.
**Не проверялось:** продакшен-домен и его HTTP-заголовки, реальные CWV (CrUX/PSI), существуют ли @altynclick и @altyn.click, какие кейсы — реальные заказы, а какие — концепты.

---

## Краткий вывод

**Что хорошо.** Позиционирование и тон сильные: блок «Проблема» с 5 вопросами клиента описывает настоящую боль, цена и сроки видны прямо в hero, есть условия оплаты (50/50), правки и 30 дней поддержки. Кейсы написаны по схеме «аудитория → страх → задача → решения». Бэкенд формы собран грамотно: токен лежит в env, HTML экранируется, есть honeypot, успех засчитывается только после ответа сервера. Скриншоты в WebP с размерами и lazy.

**Что мешает.**
1. Все 9 Telegram-CTA ведут на @altynclick, а этот аккаунт не ваш. Номер WhatsApp — заглушка.
2. На сайте есть проверяемая неправда: «5.0 · 2ГИС · 57 отзывов», «свободно 1–2 места», которые считаются по чётности месяца, и таймер до конца месяца.
3. Форма собирает телефон без согласия на обработку ПД.
4. Портфолио — главное доказательство — нельзя открыть с клавиатуры, у модалки нет семантики диалога.
5. Белый текст на золотых кнопках даёт контраст 2.2–3.2:1.

**Больший всего эффекта дадут:** починить контакты, убрать фейки, поднять портфолио выше и сразу показывать сетку, добавить блок «кто делает сайт», оставить один основной CTA.

---

## Сводная таблица

| Приоритет | Проблема | Где | Почему важно | Рекомендация |
|---|---|---|---|---|
| **P0** | 9 CTA ведут на чужой/несуществующий @altynclick; WhatsApp `+7 700 000 00 00` | строки 338, 425, 450, 500, 583, 634, 702, 733–735, 759 | Лиды уходят в пустоту | Реальный контакт; убрать заглушку |
| **P0** | Фейк «5.0 · 2ГИС · 57 отзывов» | hero, 216–222 | Проверяемая неправда разрушает доверие | Удалить |
| **P0** | Места по чётности месяца + таймер «до конца месяца» | 116, 387–406, 459–464, 771–801 | Fake urgency, спорит с блоком «Всё честно» | Удалить, оставить честный текст |
| **P0** | Нет согласия на обработку ПД | `#auditForm` | Закон РК о ПД | Строка согласия + /privacy |
| **P0** | Портфолио и модалка не работают с клавиатуры | 1002–1026, 748, 1086 | Доказательства недоступны части людей | `<button>`, `role=dialog`, фокус |
| **P1** | Контраст CTA 2.2–3.2:1, eyebrow 2.4:1, golddeep 3.5:1 | `.btn-gold`, `.eyebrow`, `.text-golddeep` | WCAG AA, читаемость главных кнопок | Текст CTA `#181410`, golddeep `#7E5B1C` |
| **P1** | Горизонтальный скролл на 390/375/360 | кнопка в `#process` (396px) | Страница ездит вбок | Перенос текста в `.btn` < 640px |
| **P1** | Tailwind Play CDN в проде | 19–31 | Блокирует рендер, FOUC, сторонний JS | Сборка CLI → 24 КБ CSS |
| **P1** | H1 (LCP на мобиле) скрыт `reveal` | 145 | Задерживает LCP; без JS пустая страница | Убрать reveal с hero, JS-гейт |
| **P1** | Противоречия цены/сроков/состава | 162, 448, 567, 665, 673 | Сомнение в честности | Одна формулировка |
| **P1** | Портфолио — 7-й блок, веер требует лишний тап, у 3 кейсов нет ссылок | `#works` | Доказательство идёт после цены | Переставить, сетка сразу, добавить url |
| **P1** | Нет блока «кто делает сайт» | — | Возражение «один специалист» | Имя, фото, 3 факта |
| **P1** | 9 CTA, 9 формулировок, 2 канала | по всей странице | Распыление | Один основной шаг |
| **P1** | Нет rate limit и security headers | `lead.js`, корень | Спам в Telegram, нет CSP | WAF rule, Origin check, `_headers` |
| **P1** | Нет canonical, OG, JSON-LD, robots, sitemap; кейсы только в JS | `<head>`, 879–985 | Превью в мессенджерах, AI/поиск | Фрагменты ниже |
| **P2** | Нет `prefers-reduced-motion`, 4 бесконечные анимации | CSS 58–68 | Доступность, шум | Медиазапрос, убрать циклы |
| **P2** | Форма: нет label/autocomplete, опции не передаются | 620–628, 541–586 | Трение, калькулятор ни на что не влияет | Код ниже |
| **P2** | FAQ/бургер/опции без `aria-expanded`/`aria-pressed` | 118, 653, 541 | Скринридеры | 10 строк JS |
| **P2** | Нет аналитики и событий | — | Эффект правок не измерить | Cloudflare Web Analytics |
| **P2** | Лишние начертания шрифтов (500) | 17 | −2 файла шрифтов | Сократить URL |

### DON'T CHANGE — работает, не трогать

- **Бэкенд `functions/api/lead.js`**: env-секреты, `esc()`, лимиты длины, honeypot, код 502 при ошибке Telegram.
- **Клиентская логика формы**: `r.ok && d.ok` перед показом успеха; при ошибке форма возвращается в рабочее состояние и показывает запасной канал (нужно лишь заменить в нём ссылку). Так и должно быть.
- **Блок «Проблема»**: 5 вопросов клиента и строка «иногда он просто откладывает решение» — сильный и честный текст.
- **Цена и сроки в hero, условия 50/50, «правки на этапе черновика бесплатно», 30 дней поддержки** — снимают главные возражения.
- **Структура кейсов** «аудитория → страх → задача → что сделано → изюминка». Особенно кейс ELARA: там прямо сказано, что сайт не выдумывает отзывы — это правильная позиция.
- **Изображения**: WebP 28–84 КБ, `width/height`, `loading="lazy"`, `<picture>` с мобильными скриншотами.
- **Иконки**: favicon.ico + svg, apple-touch-icon, manifest.
- **FAQ-анимация через `grid-template-rows`**, анимация модалки через opacity+transform.
- **Палитра и типографика** (ink/paper/gold, Unbounded + Manrope) — узнаваемо, по бренду. Поменять нужно только оттенки, которые проваливают контраст.
- **Пустой `.dots`-фон и крупные отступы** — дают воздух, ничего лишнего.

---

## 1. Business / Offer

**Тест «5–10 секунд» (мобильный первый экран, 390px, проверено скриншотом):**

| Вопрос | Ответ на экране | Оценка |
|---|---|---|
| Что делает? | eyebrow «Продающие сайты для малого бизнеса» + H1 «Упаковываю сильные стороны бизнеса в сайт» | ✅ понятно, хотя слово «лендинг» появляется только в оффере |
| Для кого? | «малого бизнеса» | ✅ |
| Какую проблему решает? | подзаголовок «объясняет… что делать дальше» | ✅ |
| Что получает? | чипы: сроки, цена, заявки в Telegram | ✅ |
| Стоимость | 120 000 ₸ | ✅ сильная сторона |
| Сроки | 5–12 дней | ✅ |
| Почему доверять? | на мобиле — ничего; на десктопе — фейковый рейтинг | ❌ |
| Чем отличается? | не видно до блока 05 | ⚠️ |
| Что делать дальше? | «Получить бесплатный аудит сайта» | ✅, но это не основная услуга |

**1.1 Фейковые доказательства и дефицит (P0).**
*Доказательство:* строки 216–222 (`5.0 · 2ГИС · 57 отзывов`), строка 772 `const spots = (NOW.getMonth() + 1) % 2 === 0 ? 2 : 1;`, таймер `tick()` до 1-го числа следующего месяца.
*Решение:* удалить. Ограничение «3 проекта в месяц» можно оставить, если это ваше реальное правило, но показывать его текстом без «живых слотов».
*Эффект:* исчезает главный риск «поймать на неправде». Для студии, которая продаёт доверие, это важнее любого прироста от срочности.

**1.2 Противоречия в оффере (P1).**
*Доказательство:*
- hero: «Фиксированная цена»;
- FAQ-3: «Доплата возможна только за две опции»;
- блок 08: опций три, калькулятор +15 000 и экспресс +25 000;
- «Экспресс — до 5 рабочих дней» при базовом сроке «от 5»;
- блок 05: «запустимся через 10 дней»;
- FAQ-2: «оформить аккуратный логотип» — непонятно, входит ли он в цену.

*Решение:* см. тексты в разделе 3.
*Эффект:* клиент не находит расхождений, когда перечитывает перед оплатой.

**1.3 Два оффера конкурируют (P1).** Основная услуга — лендинг за 120 000 ₸. А основной CTA hero и формы — «бесплатный аудит», причём блок аудита адресован только тем, «у кого уже есть сайт», хотя hero обещает помочь и без сайта. К тому же аудит одновременно бесплатный для всех и «бонус к заказу до конца месяца».
*Решение:* форма «Обсудить сайт / получить разбор». Поле «ссылка» необязательное — подходит и тем, у кого сайт есть, и тем, у кого нет. Бонус-блок удалить: аудит и так бесплатный.

**1.4 Возражения — что закрыто, что нет:**

| Возражение | Статус |
|---|---|
| Дорого / дёшево | ⚠️ цена есть, но нет сравнения «что входит у студии за 300–500к vs здесь» — можно не добавлять, «без наценок за офис» достаточно |
| «Мне и Instagram хватает» | ❌ не закрыто. Добавить FAQ: «Зачем сайт, если есть Instagram?» — сайт отвечает на вопросы до переписки, находится в поиске и 2ГИС, заявка приходит в Telegram |
| «У меня уже есть сайт» | ✅ аудит |
| «Будет ли результат?» | ⚠️ нет честного ответа. Добавить в FAQ: «Гарантировать количество заявок не могу — оно зависит от трафика и услуги. Отвечаю за то, чтобы человек, который зашёл, быстро понял предложение и мог оставить заявку в 2 касания» |
| Сроки | ✅ |
| Безопасность | ✅ (форма, архив файлов) |
| Процесс | ✅ (но дублируется) |
| Правки | ✅ |
| Поддержка | ✅ 30 дней |
| Один специалист | ⚠️ только декларация «лично» → блок «Кто делает сайт» |

---

## 2. CRO / UX

**Путь:** первый экран → проблема → процесс → оффер → ограничения → условия → **портфолио (7-й)** → опции → форма → FAQ.

| # | Барьер | Где | Критичность | Исправление |
|---|---|---|---|---|
| 1 | Клик по CTA → чужой Telegram | 8 кнопок | P0 | реальный контакт |
| 2 | Доказательства после цены | порядок секций | P1 | Hero → Проблема → **Портфолио** → Процесс → Оффер+Опции → Кто делает → Условия → FAQ → Форма |
| 3 | Портфолио: веер → тап → сетка → тап → модалка | `#workStack` | P1 | сразу сетка |
| 4 | Процесс описан дважды (4 и 5 шагов) | `#process`, `#terms` | P1 | один список из 5 шагов с «на выходе» |
| 5 | 9 разных CTA | вся страница | P1 | основной: «Обсудить мой сайт» → форма; вторичный: текстовая ссылка «или напишите в Telegram» |
| 6 | Калькулятор опций ничего не передаёт | `#addons` | P2 | выбранные опции подставляются в форму (код ниже) |
| 7 | Форма после FAQ-подобного блока, FAQ после формы | `#audit`, `#faq` | P2 | FAQ перед формой: вопросы снимаются до решения |
| 8 | Мобильный: горизонтальный скролл | `#process` | P1 | см. раздел 7 |

**Форма (lead flow):**
- поля: имя*, контакт*, ссылка — минимально, **оставить**;
- неясно, почему нужен телефон → добавить подпись «Отвечу в Telegram или WhatsApp — как удобнее»;
- нет согласия на ПД → P0;
- ошибка: сообщение и запасной канал есть ✅ (только ссылку заменить);
- success: «пришлю аудит в течение дня» — хорошо, но если человек пришёл без сайта, обещание не подходит → «Отвечу в течение рабочего дня»;
- спам: honeypot есть, rate limit нет → раздел 11.

---

## 3. Copy

Менять только то, что ниже; остальной текст хороший.

| Где | Было | Стало | Почему |
|---|---|---|---|
| H1 | Упаковываю сильные стороны бизнеса в сайт | **оставить**. Подзаголовок: «Лендинг под ключ для малого бизнеса: объясняет клиенту, что вы предлагаете, почему это ему подходит и как оставить заявку.» | в первом экране появляется слово «лендинг» (и для поиска тоже) |
| Hero CTA | Получить бесплатный аудит сайта | **Обсудить мой сайт** + подпись «Бесплатно разберу текущий сайт или Instagram. Если сайта нет — скажу, с чего начать.» | один CTA на оба сценария |
| Чип | Фиксированная цена — 120 000 ₸ | Лендинг под ключ — 120 000 ₸ | «фиксированная» спорит с опциями |
| #process CTA | Показать решение для моего бизнеса | Обсудить мой сайт | короче (фикс overflow), единый CTA |
| #limits | Если начнём на этой неделе — запустимся уже через 10 дней. | удалить | спорит с «5–12 дней» |
| #limits CTA | Узнать, свободна ли эта неделя | Узнать ближайшую дату старта | без давления |
| #terms «Договор» | Работаем официально, все этапы и обязательства зафиксированы | *если статус оформлен* — оставить; иначе: «Этапы, сроки и цену фиксируем письменно до старта» | не обещать того, чего нет |
| Addons Экспресс | Весь проект — до 5 рабочих дней. | Гарантированный запуск за 5 рабочих дней — работаю над вашим проектом в первую очередь. | объясняет, за что доплата |
| FAQ-2 | Это нормальная ситуация для 90% малого бизнеса. … оформить аккуратный логотип | Это частая ситуация. Тексты беру на себя … *логотип: уточните, входит ли — «Простой текстовый логотип — входит; фирменный стиль — отдельно»* | цифра без источника; неясный состав |
| FAQ-3 | Доплата возможна только за две опции: второй язык … | «Базовый лендинг закрывает запуск целиком. Доплата — только за опции, которые вы выберете сами (второй язык, калькулятор/квиз, экспресс-срок), и за домен (~3 000–5 000 ₸ в год, платите напрямую регистратору).» | снимает противоречие |
| Bonus-блок | Аудит … бонусом к заказу · до конца месяца | удалить | аудит и так бесплатный |
| Audit «Для кого» | для бизнеса, у которого уже есть сайт | «Если сайт есть — разберу его. Если нет — посмотрю Instagram или 2ГИС и скажу, что важно показать на сайте.» | совпадает с hero |
| Форма, подпись | Никакого спама — свяжусь только по делу. | «Нажимая кнопку, вы соглашаетесь на обработку данных для ответа на заявку. [Политика](/privacy)» | ПД |
| Футер | Сайт, который продаёт, пока вы занимаетесь делом. | оставить | — |

**Новые FAQ** (закрывают незакрытые возражения):
- *Зачем сайт, если есть Instagram?* — Instagram хорош для тех, кто уже подписан. Сайт отвечает на вопросы до переписки: цена, как проходит работа, почему вам можно доверять. Его находят в поиске и по ссылке из 2ГИС, а заявка сразу приходит в Telegram.
- *Гарантируете ли вы заявки?* — Количество заявок зависит от трафика и услуги, поэтому обещать цифры я не буду. Отвечаю за то, чтобы человек, который зашёл на сайт, быстро понял предложение и оставил заявку за пару касаний.
- *Кому принадлежит сайт?* — Вам: домен регистрируется на вас, архив файлов передаю после запуска.

---

## 4. Portfolio / Trust

| Кейс | Тип | Задача | Роль | Решения | Живая ссылка | Визуал | Статус |
|---|---|---|---|---|---|---|---|
| Save Point | ✅ | ✅ | ⚠️ неявно | ✅ | ✅ | ✅ 5+5 | ❓ |
| ELARA Dental | ✅ | ✅ | ⚠️ | ✅ | ❌ **нет url** (есть elara-dental.pages.dev) | ✅ | ❓ |
| Alba | ✅ | ✅ | ⚠️ | ✅ | ❌ **нет url** (есть alba-7wj.pages.dev) | ✅ | ❓ |
| ProRemont | ✅ | ✅ | ⚠️ | ✅ | ❌ **нет url** (есть proremont-11k.pages.dev) | ✅ | ❓ |
| Тропинка | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ | ❓ |
| Steps | ✅ | ✅ | ⚠️ | ✅ | ✅ stupenki.pages.dev | ✅ | ❓ |

**Проблемы:**
1. **У 3 кейсов нет ссылки на живой сайт**, хотя сайты опубликованы. Живая ссылка — самое сильное доказательство, сильнее скриншотов. P1, три строки кода.
2. **Не указан статус и роль.** Нет пометки «заказ клиента» или «концепт для ниши», нет списка того, что именно сделали вы (исследование / тексты / дизайн / код). Если часть кейсов — концепты, это нужно написать прямо («Концепт: как я бы сделала сайт для стоматологии»). Честная пометка вызывает больше доверия, чем умолчание, которое вскроется на первом созвоне. Результатов и метрик не придумывать.
3. **Тропинка и Steps** — два детских центра, причём ссылки tropinka/stupenki связаны с одним проектом. Если это одна клиентка, лучше один кейс «две итерации», иначе похоже на добивку количества.
4. В кейсах ProRemont и Тропинка упомянуты «реальные объекты» и «рейтинг 5.0 на 2ГИС» — это допустимо **только если это настоящие данные заказчика**.
5. Тексты кейсов рендерит только JS — поисковики и AI-краулеры их не видят (раздел 9).

**Предлагаемые поля карточки** (в объекте `works`): `status: 'Заказ клиента' | 'Концепт'`, `role: ['Исследование','Тексты','Дизайн','Вёрстка','Telegram-бот']`, `url`.

---

## 5. UI

- **Контраст (посчитано):**

| Пара | Контраст | WCAG AA | Фикс |
|---|---|---|---|
| белый на `#D6A84B` (верх градиента CTA) | 2.20 | ❌ | текст `#181410` → 8.34 |
| белый на `#B9862C` (низ градиента) | 3.23 | ❌ | текст `#181410` → 5.68 |
| eyebrow `#C89A3C` на `#FAF6EE`, 11px | 2.39 | ❌ | `#7E5B1C` → 5.73 |
| `golddeep #A67C28` на белом/paper (цены, tagline) | 3.79 / 3.52 | ❌ | `#7E5B1C` → 5.73 / 5.16 на cream |
| зелёный чип `#3E9B5F` на paper | 2.90 | ❌ | удаляется вместе с фейком |
| цифры шагов `gold/40` на белом | 1.42 | декоративно | допустимо, если это не единственный носитель смысла (рядом есть h3) |
| граница инпута `#E6DEC9` на белом | 1.34 | ❌ (1.4.11 — 3:1) | `#8F7F62` → 3.90 |
| `mut #6F6553` на paper | 5.32 | ✅ | — |
| `mutd #A99F8C` на ink | 7.00 | ✅ | — |

- **Визуальный шум:** в hero 3 декоративных объекта (мокап, toast, рейтинг) + 3 размытых пятна. После удаления рейтинга мокап и toast (без цикла) остаются — этого достаточно.
- **Иерархия:** eyebrow «02 · Проблема … 10 · Вопросы» — хорошая навигация, но после перестановки блоков нумерацию нужно обновить или убрать.
- **Micro-типографика:** 26 мест с `text-[10px]`/`text-[11px]`. Для uppercase-лейблов 11px допустимо, для подписи к форме (`text-[11px]`, строка 627) — поднять до 13px, там будет юридический текст.
- **Консистентность:** кнопки/карточки/скругления единообразны ✅.

---

## 6. Motion

| Анимация | UX-задача | Вердикт |
|---|---|---|
| `reveal` секций | мягкое появление | оставить, но **не в hero**, только при `html.js` и без reduced-motion |
| `toast-loop` «Новая заявка» каждые 6.5 с | показывает «заявки → Telegram» | **1 раз** при загрузке (иллюстрирует обещание), без цикла |
| `floaty` рейтинг | — | удалить вместе с фейком |
| `marquee` | перечисляет состав, который и так есть в оффере | сделать статичной строкой или удалить; при reduced-motion — стоп |
| `pulse-dot` | — | удалить вместе со «слотами» |
| таймер | fake urgency | удалить |
| веер карточек + hover-подъём | декор, +1 тап | удалить веер, hover карточек сетки оставить |
| FAQ, модалка, hover кнопок | обратная связь | оставить |

`prefers-reduced-motion` отсутствует полностью → код ниже.

---

## 7. Responsive

Проверено рендером (реальные шрифты):

| Ширина | scrollWidth | Проблема |
|---|---|---|
| 1440 / 1280 / 768 | = ширине ✅ | — |
| 390 | **412** ❌ | кнопка «Показать решение для моего бизнеса» 396px (`white-space:nowrap`) |
| 375 | **412** ❌ | то же |
| 360 | **412** ❌ | то же |

Остальное:
- шапка на 360–390 помещается впритык (логотип + «Бесплатный аудит» 170px + бургер) ✅;
- ссылки футера и мобильного меню 20px высотой → `py-2`;
- мобильное меню открывается без анимации и без `aria-expanded`, по Esc не закрывается;
- `h-[400px]` у веера — фиксированная высота, уйдёт вместе с веером;
- zoom не заблокирован ✅; `scroll-padding-top:96px` под fixed-шапку ✅.

---

## 8. Performance

- **LCP:** на мобильном — H1/абзац hero (визуал скрыт `hidden lg:block`), на десктопе — H1 или мокап. Его задерживают:
  1. синхронный `cdn.tailwindcss.com` в `<head>` компилирует CSS в браузере; до этого страница без стилей или пустая;
  2. Google Fonts CSS блокирует рендер (`display=swap` смягчает);
  3. `.reveal` на hero: `opacity:0` до IntersectionObserver + 0.7s transition.
- **Самые тяжёлые ресурсы:** скрипт Tailwind CDN (сторонний, размер не зафиксирован — из песочницы CDN недоступен, поэтому число не называю); шрифты — 9 начертаний в запросе, 2 из них (500) не используются. Скриншоты 28–84 КБ — в норме.
- **Сборка этого же `index.html` через tailwindcss CLI даёт 24 КБ минифицированного CSS.**
- **Лишняя работа:** `setInterval` каждую секунду (таймер), бесконечные CSS-анимации.
- **Preload** не нужен после отказа от CDN: CSS — один маленький файл, картинок в hero нет.

---

## 9. SEO / GEO / AEO

| Элемент | Статус |
|---|---|
| `lang="ru"`, `<title>`, `description` | ✅ (title можно точнее: «Лендинг под ключ для малого бизнеса — Altyn Click, Алматы») |
| canonical | ❌ |
| robots.txt / sitemap.xml | ❌ файлов нет |
| Open Graph / Twitter | ❌ |
| favicon, manifest | ✅ |
| H1 один, H2 по секциям | ✅ |
| `<header>/<nav>/<main>/<section>/<footer>` | ✅ |
| JSON-LD | ❌ |
| Контент кейсов в HTML | ❌ только в JS |
| Сущность | «Altyn Click», «Алматы · работаю удалённо со всем Казахстаном», цена, срок — есть в тексте ✅ |

Разметку добавлять только по тому, что реально есть на странице: ProfessionalService, Offer 120 000 KZT, FAQPage по реальным вопросам. **Никаких AggregateRating/Review** — отзывов нет. Гарантировать индексацию или цитирование AI-системами нельзя; разметка только снижает неоднозначность.

---

## 10. Accessibility

- **P0:** портфолио — `div`/`article` с onclick, без фокуса; модалка без `role="dialog"`, `aria-modal`, управления фокусом; кнопки ←/→/× без подписи.
- **P1:** контраст (раздел 5).
- **P2:**
  - форма без `<label>`, без `autocomplete`;
  - у FAQ, бургера и карточек опций нет состояний (`aria-expanded` / `aria-pressed`);
  - декоративные SVG без `aria-hidden`;
  - мокап в hero читается скринридером как набор пустых `span` → `aria-hidden="true"` на весь визуал;
  - honeypot сделан правильно (`tabindex=-1`, `aria-hidden`) ✅;
  - фокус-кольцо: на кнопках — браузерное по умолчанию, у `.input` — своё. Добавить единый `:focus-visible`.

---

## 11. Security

Сайт статический + одна Pages Function. Что применимо:

| Механизм | Нужен? | Статус |
|---|---|---|
| Секреты вне клиента | да | ✅ токен в env |
| Экранирование в Telegram HTML | да | ✅ `esc()` |
| Серверная валидация | да | ✅ обязательные поля + длина; можно добавить проверку формата контакта |
| Honeypot | да | ✅ |
| Rate limiting | да | ❌ → WAF rule (Security → WAF → Rate limiting rules, путь `/api/lead`, POST); по документации в бесплатном плане доступно одно такое правило |
| Проверка Origin | да, дёшево | ❌ |
| CSP + security headers | да | ❌ нет `_headers` |
| XSS через innerHTML | проверено | ✅ только статичные данные |
| CORS | **не нужен**: форма и функция на одном origin | — |
| HTTPS | Cloudflare по умолчанию | не проверялось на проде |
| Сторонний JS | Tailwind CDN | ❌ → убрать |

---

## 12. Code

- **HTML:** семантика ✅. Дубли: SVG Telegram ×3, SVG-галочка ×15 (терпимо для статики, в `<symbol>` выносить не обязательно). Мокап hero без `aria-hidden`.
- **CSS:** небольшой, читаемый ✅. `transition:all` на `.btn`/`.input` → лучше `transform, box-shadow, border-color`.
- **JS:**
  - мёртвая строка 769;
  - scroll-обработчик на каждом событии трогает 5 классов → переключать один класс по порогу (`classList.toggle('scrolled', y>12)`);
  - после удаления таймера и веера файл сократится примерно на 90 строк;
  - вынести JS в `/app.js` — это нужно для CSP.
- **Архитектуру не усложнять:** один HTML + один CSS + один JS + функция — правильный масштаб. Сборщики и фреймворки не нужны.

---

## 10 главных изменений (по влиянию)

1. Реальный Telegram во все CTA, удалить WhatsApp-заглушку.
2. Удалить «5.0 · 57 отзывов», «места» и таймер.
3. Согласие на обработку ПД + `/privacy`.
4. Портфолио — сразу сеткой, сразу после блока «Проблема», + живые ссылки ProRemont/Alba/ELARA + пометка статуса и роли.
5. Контраст CTA: тёмный текст на золоте.
6. Блок «Кто делает сайт».
7. Один основной CTA «Обсудить мой сайт» → форма; Telegram вторичный.
8. Убрать противоречия в цене/сроках, объединить процесс в 5 шагов, 3 новых FAQ.
9. Tailwind CLI вместо CDN + reveal не на hero + фикс горизонтального скролла.
10. Доступность портфолио/модалки + OG/JSON-LD/canonical + `_headers` + rate limit.

## Что НЕ нужно делать

- **Custom cursor, card tilt, parallax, горизонтальный скролл, sticky storytelling** — задачи для них нет, а скорость и доступность пострадают.
- **Scroll-driven видео в hero** — тяжёлый LCP ради эффекта; оффер и так понятен.
- **Отзывы-заглушки, «+N довольных клиентов», AggregateRating в JSON-LD** — пока нет реальных отзывов.
- **Новые таймеры, «осталось N мест», pop-up с выходом** — манипуляция.
- **Квиз вместо формы** — форма из 3 полей уже минимальна.
- **Чат-виджеты и сторонние CRM-скрипты** — Telegram-бот решает задачу.
- **Переход на React/Next/Astro** — одностраничнику это не нужно.
- **Больше анимаций в портфолио** — лучше живые ссылки.
- **Preload шрифтов «на всякий случай»** — без замеров не нужен.
- **Переделка палитры/шрифтов** — брендинг работает, править только контрастные оттенки.

---

## Готовый код

> Пометки `ВАШ_ДОМЕН` и `ВАШ_TELEGRAM` — подставьте реальные значения; я их не знаю.

### A. Контакты (P0)

Заменить все `https://t.me/altynclick` (9 мест, включая `const TG`) и подпись `@altynclick`:

```bash
# run in repo root
sed -i 's#https://t.me/altynclick#https://t.me/ВАШ_TELEGRAM#g; s#>@altynclick<#>@ВАШ_TELEGRAM<#g' index.html
```

Удалить из футера строку с `wa.me/77000000000` целиком (строка 734). Номер телефона текстом на сайт не выносить — ссылка на мессенджер защищает от парсеров.

### B. Удалить фейки (P0)

1. Hero: удалить блок `<!-- рейтинг --> … </div>` (строки 215–222).
2. Шапка: удалить `<span id="spotsChip" …></span>` (строка 116).
3. Оффер: удалить весь блок `<!-- бонус + счётчик -->` (строки 387–406).
4. `#limits`: заменить правую карточку (строки 453–466) на:

```html
<div class="reveal rounded-3xl bg-white/[.04] border border-white/10 p-8 md:p-10">
  <div class="flex items-end gap-4">
    <span class="font-disp font-bold text-[96px] md:text-[120px] leading-none text-gold2">3</span>
    <span class="text-mutd font-semibold pb-3 leading-snug">проекта<br>в месяц —<br>не больше</span>
  </div>
  <p class="mt-8 pt-8 border-t border-white/10 text-mutd leading-relaxed">
    Ближайшую свободную дату старта назову в ответе на заявку.
  </p>
</div>
```

5. Удалить абзац «Если начнём на этой неделе…» (строки 447–449).
6. JS: удалить блок `/* ---------- 1. Месяц, места, счётчик ---------- */` целиком (строки 767–801), константы `MON_GEN`, `MON_NOM`, `NOW`.

### C. CSS: контраст, перенос кнопок, reduced motion, reveal-гейт (P1/P2)

В `<head>` **первой строкой после `<meta charset>`**:

```html
<script>document.documentElement.classList.add('js')</script>
```

Заменить/добавить в `<style>`:

```css
/* Dark text on gold keeps the brand color and passes AA (8.3:1 / 5.7:1) */
.btn-gold{background:linear-gradient(135deg,#D6A84B,#B9862C);color:#181410;box-shadow:0 12px 26px -10px rgba(200,154,60,.6)}
.btn{transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease,color .25s ease}
.btn:focus-visible,.input:focus-visible,a:focus-visible,button:focus-visible{outline:3px solid #7E5B1C;outline-offset:3px}

/* Long CTA labels must wrap on phones instead of forcing horizontal scroll */
@media (max-width:639px){.btn{white-space:normal;text-align:center}}

/* Light-background eyebrow needs a darker gold; dark sections keep gold2 */
.eyebrow{color:#7E5B1C}
.bg-ink .eyebrow{color:#E2B75C}

/* Visible field boundary: 3.9:1 against white (WCAG 1.4.11) */
.input{border-color:#8F7F62;transition:border-color .2s,box-shadow .2s}

/* Content stays visible if JS fails; reveal only runs when JS is on */
.reveal{opacity:1;transform:none}
.js .reveal{opacity:0;transform:translateY(26px);transition:opacity .7s ease,transform .7s cubic-bezier(.22,.61,.36,1)}
.js .reveal.in{opacity:1;transform:none}

/* Toast plays once to illustrate "lead → Telegram", then stays */
.toast-once{animation:toastIn .6s .8s both cubic-bezier(.22,.61,.36,1)}
@keyframes toastIn{from{opacity:0;transform:translateY(12px) scale(.95)}to{opacity:1;transform:none}}

@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{animation:none!important;transition:none!important}
  .js .reveal{opacity:1;transform:none}
}
```

В Tailwind-конфиге: `golddeep:'#7E5B1C'`.
Hero: снять `reveal` с `<div class="reveal">` текстового блока (строка 145); у toast заменить `toast-loop` на `toast-once`; на визуал hero (строка 168) добавить `aria-hidden="true"`.

### D. Tailwind без CDN (P1)

```bash
npm i -D tailwindcss@3
```

`tailwind.config.js`:

```js
module.exports = {
  content: ['./index.html', './app.js'],
  theme: { extend: {
    colors: {
      paper:'#FAF6EE', cream:'#F1EADB', ink:'#181410', ink2:'#221D16',
      line:'#E6DEC9', gold:'#C89A3C', gold2:'#E2B75C', golddeep:'#7E5B1C',
      mut:'#6F6553', mutd:'#A99F8C', green:'#3E9B5F'
    },
    fontFamily: { disp:['Unbounded','sans-serif'], sans:['Manrope','sans-serif'] }
  }}
};
```

`src/input.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`package.json` → `"scripts": { "build": "tailwindcss -i src/input.css -o assets/tw.css --minify" }`.
Cloudflare Pages: Build command `npm run build`, output directory `/`. Можно и без сборки на стороне Cloudflare: запускать `npm run build` локально и коммитить `assets/tw.css`.

В `<head>` заменить строки 17–31:

```html
<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700&family=Manrope:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/tw.css">
```

Весь `<script>` в конце страницы перенести в `/app.js` и подключить `<script src="/app.js" defer></script>` — это нужно для строгого CSP.

### E. Портфолио: сетка сразу, доступные карточки, ссылки (P0/P1)

HTML — заменить строки 515–527:

```html
<div id="workGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14"></div>
<p class="text-sm text-mut mt-6 text-center">Нажмите на проект — откроются скриншоты и логика решений.</p>
```

Данные — добавить в объекты `works`:

```js
// elara
url:'https://elara-dental.pages.dev/',
// alba
url:'https://alba-7wj.pages.dev/',
// proremont
url:'https://proremont-11k.pages.dev/',
// every project: honest status and your actual scope
status:'Заказ клиента', // or 'Концепт' — fill in per project
role:['Исследование','Тексты','Дизайн','Вёрстка'],
```

JS — заменить весь блок 7 (строки 987–1071):

```js
/* ---------- 7. Portfolio grid ---------- */
works.forEach(w => { w.mshots = mshots(w.id); w.mcover = w.mshots[0]; });
const pic = (w, cls) =>
  '<picture><source media="' + MOBILE_Q + '" srcset="' + w.mcover + '" width="585" height="1266">' +
  '<img src="' + w.cover + '" alt="" width="1416" height="768" loading="lazy" decoding="async" class="' + cls + '"></picture>';
const gridEl = document.getElementById('workGrid');
// Still used by the modal to start its CSS transition on the next frame
const raf2 = fn => requestAnimationFrame(() => requestAnimationFrame(fn));

gridEl.innerHTML = works.map(w =>
  '<article class="group bg-white rounded-3xl border border-line overflow-hidden shadow-sm hover:shadow-xl transition-shadow">' +
    // Whole card is one real button: keyboard, screen reader and touch get the same action
    '<button type="button" data-work="' + w.id + '" class="block w-full text-left" aria-haspopup="dialog">' +
      '<div class="relative aspect-[4/5] sm:aspect-[59/32] overflow-hidden">' +
        pic(w, 'w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105') +
        '<span class="absolute top-3 left-3 text-[10px] font-disp uppercase tracking-[0.18em] bg-ink/70 text-cream px-3 py-1.5 rounded-full">' + w.cat + '</span></div>' +
      '<div class="p-5 flex items-center justify-between gap-4">' +
        '<div><h3 class="font-extrabold text-lg leading-tight">' + w.name + '</h3>' +
        '<p class="text-sm text-mut mt-1 leading-snug">' + w.tag + '</p>' +
        (w.status ? '<p class="text-xs text-mut mt-2">' + w.status + '</p>' : '') + '</div>' +
        '<span aria-hidden="true" class="flex-none w-10 h-10 rounded-full border border-line flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-colors">' + ARR + '</span>' +
      '</div>' +
    '</button>' +
  '</article>'
).join('');

gridEl.addEventListener('click', e => {
  const btn = e.target.closest('[data-work]');
  if (btn) openWork(btn.dataset.work, btn);
});
```

Удалить CSS `.work-stack`, `.ws-pos`, `.ws-card`, `.work-grid`.

### F. Модалка как диалог (P0)

HTML (строка 748):

```html
<div id="workModal" class="fixed inset-0 z-[90] hidden" role="dialog" aria-modal="true" aria-labelledby="workTitle">
```

JS — изменения в блоке 8:

```js
let lastFocus = null;

function openWork(id, trigger) {
  curWork = works.find(w => w.id === id);
  shotIdx = 0;
  lastFocus = trigger || document.activeElement;
  modalBody.innerHTML = /* same markup as now, with these edits:
     - <h3 id="workTitle" ...>
     - prev:  <button data-dir="-1" aria-label="Предыдущий скриншот" ...>
     - next:  <button data-dir="1"  aria-label="Следующий скриншот" ...>
     - close: <button data-close aria-label="Закрыть" ...>
     - thumbs: <button data-thumb="i" aria-label="Скриншот i+1" ...><img alt="" loading="lazy" ...>
     - main img alt: 'Скриншот сайта ' + curWork.name + ', экран 1'
     - role chips: curWork.role.map(r => '<span ...>' + r + '</span>')  */ '';
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  raf2(() => { modal.classList.add('open'); modal.querySelector('[data-close]').focus(); });
}

function closeWork() {
  modal.classList.remove('open');
  setTimeout(() => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    lastFocus && lastFocus.focus(); // return focus to the card that opened the dialog
  }, 300);
}

// Keep Tab inside the open dialog
modal.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const f = [...modal.querySelectorAll('a[href],button:not([disabled])')];
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
```

Кроме того, в `setShot()` обновлять `alt`: `img.alt = 'Скриншот сайта ' + curWork.name + ', экран ' + (shotIdx + 1);`.

### G. FAQ, бургер, опции — состояния (P2)

```js
const burger = document.getElementById('burger');
burger.setAttribute('aria-controls', 'mobMenu');
burger.setAttribute('aria-expanded', 'false');
burger.onclick = () => {
  const open = mobMenu.classList.toggle('hidden') === false;
  burger.setAttribute('aria-expanded', String(open));
};
document.querySelectorAll('.mob-link').forEach(a => a.onclick = () => {
  mobMenu.classList.add('hidden'); burger.setAttribute('aria-expanded', 'false');
});

document.querySelectorAll('.faq-q').forEach((btn, i) => {
  const panel = btn.nextElementSibling;
  panel.id = 'faq-a-' + i;
  btn.setAttribute('aria-controls', panel.id);
  btn.setAttribute('aria-expanded', 'false');
  btn.onclick = () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(x => {
      x.classList.remove('open'); x.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!wasOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
  };
});

document.querySelectorAll('.opt').forEach(card => {
  card.type = 'button';
  card.setAttribute('aria-pressed', 'false');
  card.onclick = () => {
    card.setAttribute('aria-pressed', String(card.classList.toggle('on')));
    recalc();
  };
});
```

### H. Форма: label, согласие, передача опций (P0/P2)

```html
<form id="auditForm" class="mt-6 space-y-3.5" novalidate>
  <label class="block">
    <span class="block text-sm font-bold mb-1.5">Имя</span>
    <input class="input" name="name" required autocomplete="name" maxlength="80">
  </label>
  <label class="block">
    <span class="block text-sm font-bold mb-1.5">Телефон или @telegram</span>
    <input class="input" name="contact" required autocomplete="tel" inputmode="text" maxlength="120"
           placeholder="+7 7__ ___ __ __ или @username">
  </label>
  <label class="block">
    <span class="block text-sm font-bold mb-1.5">Сайт или Instagram <span class="font-normal text-mut">— если есть</span></span>
    <input class="input" name="link" type="text" inputmode="url" maxlength="300">
  </label>
  <!-- Filled by the options calculator so the lead arrives with the chosen scope -->
  <input type="hidden" name="options" id="optField">
  <input name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">
  <button type="submit" id="auditBtn" class="btn btn-gold w-full py-4">Обсудить мой сайт</button>
  <p class="text-[13px] text-mut text-center leading-relaxed">
    Нажимая кнопку, вы соглашаетесь на обработку данных для ответа на заявку.
    <a href="/privacy" class="underline">Политика конфиденциальности</a>
  </p>
</form>
```

В `recalc()` добавить:

```js
const picked = [...document.querySelectorAll('.opt.on h3')].map(h => h.textContent.trim());
document.getElementById('optField').value = picked.join(', ');
```

CTA «Собрать мой сайт с опциями» → `href="#audit"`.

В `lead.js` — лимит и строка сообщения:

```js
const LIMITS = { name: 80, contact: 120, link: 300, options: 200 };
// ...
f.options && `<b>Опции:</b> ${esc(f.options)}`,
```

### I. lead.js: Origin и формат контакта (P1)

В начало `onRequestPost` после проверки env:

```js
// Same-origin form only; blocks naive cross-site posting from scripts
const origin = request.headers.get('origin');
if (origin && new URL(origin).host !== new URL(request.url).host) return json({ ok: false, error: 'origin' }, 403);
if (!(request.headers.get('content-type') || '').includes('application/json')) return json({ ok: false, error: 'type' }, 415);
```

После сборки `f`:

```js
// Contact must look like a phone (≥10 digits) or a Telegram username
const digits = f.contact.replace(/\D/g, '');
if (digits.length < 10 && !/^@?[a-zA-Z0-9_]{5,32}$/.test(f.contact)) return json({ ok: false, error: 'contact' }, 400);
```

Rate limit — в Cloudflare Dashboard: **Security → WAF → Rate limiting rules** → URI Path equals `/api/lead`, Method POST, 5 запросов / 10 минут / IP → Block. Кодом в Pages Function это надёжно не сделать без KV/Durable Objects — для такого масштаба правила WAF достаточно.

### J. `_headers` (корень репозитория) (P1, после шагов D и E)

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'sha256-HASH_ИНЛАЙН_СКРИПТА_JS'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

- `'unsafe-inline'` в style-src нужен из-за атрибутов `style="transition-delay:…"`; это низкий риск.
- Хэш однострочного `<script>` с `classList.add('js')` посчитайте, например, `echo -n "document.documentElement.classList.add('js')" | openssl dgst -sha256 -binary | base64`. Можно обойтись и без хэша: перенести строку в начало `app.js`, но тогда reveal-гейт сработает чуть позже.
- **Проверьте консоль после деплоя** — любая заблокированная ссылка сразу будет видна.
- Если подключите Cloudflare Web Analytics, добавьте `https://static.cloudflareinsights.com` в script-src и `https://cloudflareinsights.com` в connect-src.

### K. `<head>`: canonical, OG, JSON-LD (P1)

```html
<title>Лендинг под ключ для малого бизнеса — Altyn Click, Алматы</title>
<link rel="canonical" href="https://ВАШ_ДОМЕН/">
<meta property="og:type" content="website">
<meta property="og:locale" content="ru_RU">
<meta property="og:url" content="https://ВАШ_ДОМЕН/">
<meta property="og:title" content="Altyn Click — лендинг под ключ для малого бизнеса">
<meta property="og:description" content="Исследование, тексты, дизайн, вёрстка и заявки в Telegram. 120 000 ₸, 5–12 рабочих дней.">
<meta property="og:image" content="https://ВАШ_ДОМЕН/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Altyn Click",
  "url": "https://ВАШ_ДОМЕН/",
  "description": "Продающие лендинги для малого бизнеса: исследование ниши, тексты, дизайн, адаптивная вёрстка, заявки в Telegram.",
  "areaServed": { "@type": "Country", "name": "Казахстан" },
  "address": { "@type": "PostalAddress", "addressLocality": "Алматы", "addressCountry": "KZ" },
  "sameAs": ["https://t.me/ВАШ_TELEGRAM"],
  "makesOffer": {
    "@type": "Offer",
    "name": "Лендинг под ключ",
    "price": "120000",
    "priceCurrency": "KZT",
    "description": "Исследование, структура, тексты, индивидуальный дизайн, адаптивная вёрстка, подключение домена, заявки в Telegram, 30 дней правок после запуска."
  }
}
</script>
```

FAQPage — отдельным блоком `@type: FAQPage`, `mainEntity` = вопросы/ответы **дословно** из итогового FAQ (после правок из раздела 3).

`robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://ВАШ_ДОМЕН/sitemap.xml
```

`sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://ВАШ_ДОМЕН/</loc></url>
  <url><loc>https://ВАШ_ДОМЕН/privacy</loc></url>
</urlset>
```

Для AI/поиска: под сеткой портфолио вывести в HTML короткий статичный список кейсов (название, ниша, 1 строка задачи, ссылка). Тогда смысл доступен без JS.

### L. Блок «Кто делает сайт» (P1) — каркас

```html
<section id="about" class="py-20 md:py-28">
  <div class="max-w-5xl mx-auto px-4 md:px-8 grid md:grid-cols-[280px_1fr] gap-10 items-center">
    <img src="/assets/natasha.webp" alt="Наташа — разработчик Altyn Click" width="560" height="700"
         loading="lazy" class="w-full rounded-3xl object-cover">
    <div>
      <div class="eyebrow">Кто делает сайт</div>
      <h2 class="font-extrabold text-3xl md:text-[2.4rem] leading-[1.15] tracking-tight mt-5">Наташа, Алматы</h2>
      <p class="mt-5 text-mut leading-relaxed">
        <!-- 2–3 sentences in your own words: background, why you do this -->
      </p>
      <ul class="mt-6 space-y-3">
        <!-- Only verifiable facts you are comfortable publishing -->
        <li class="chk"><span class="ic" aria-hidden="true">✓</span><p>ФАКТ 1</p></li>
        <li class="chk"><span class="ic" aria-hidden="true">✓</span><p>ФАКТ 2</p></li>
        <li class="chk"><span class="ic" aria-hidden="true">✓</span><p>ФАКТ 3</p></li>
      </ul>
      <a href="#audit" class="btn btn-gold mt-8 px-8 py-4">Обсудить мой сайт</a>
    </div>
  </div>
</section>
```

Факты выбираете вы. Опыт в геймдеве, образовательном VR и технический бэкграунд (C#, Python, SQL, веб) подходят, если вы готовы их показывать.

---

## Финальная проверка (checklist)

**Контакты и честность**
- [ ] Поиск по `altynclick` в `index.html` → 0 совпадений (или аккаунт зарегистрирован на вас)
- [ ] Каждая ссылка Telegram/Instagram открыта вручную с телефона
- [ ] Поиск `2ГИС · 57`, `spots`, `countdown`, `cdD`, `month-gen` → 0
- [ ] Цена, сроки и состав совпадают в hero, оффере, опциях, условиях и FAQ
- [ ] У каждого кейса указан статус (заказ / концепт) и есть ссылка на живой сайт, если он опубликован

**Форма**
- [ ] Реальная отправка → сообщение в Telegram, в нём есть «Опции»
- [ ] Отключить env-переменную на preview → форма показывает ошибку и рабочую ссылку на Telegram
- [ ] Заполненный honeypot → ответ ok, в Telegram ничего не пришло
- [ ] 6 отправок подряд → WAF блокирует
- [ ] `curl -X POST` с чужим `Origin` → 403
- [ ] `/privacy` открывается

**Вёрстка**
- [ ] 1440 / 1280 / 768 / 390 / 375 / 360: в консоли `document.documentElement.scrollWidth === innerWidth`
- [ ] Мобильное меню: открыть, перейти по якорю, меню закрылось, `aria-expanded` обновился
- [ ] Zoom 200% — текст не обрезается

**Доступность**
- [ ] Tab по всей странице: фокус виден везде, порядок логичен
- [ ] Карточка портфолио → Enter → модалка; Tab не выходит из неё; Esc закрывает; фокус возвращается на карточку
- [ ] DevTools / axe: 0 ошибок контраста
- [ ] Включить «уменьшить движение» в ОС → ничего не анимируется

**Производительность**
- [ ] В Network нет `cdn.tailwindcss.com`; `tw.css` ≈ 24 КБ
- [ ] PageSpeed Insights (mobile): LCP, CLS, INP в зелёной зоне; записать исходные и новые значения
- [ ] Отключить JS → контент видим

**SEO / шаринг**
- [ ] Ссылку отправить себе в Telegram → превью с картинкой и описанием
- [ ] Rich Results Test / validator.schema.org → JSON-LD без ошибок
- [ ] `/robots.txt`, `/sitemap.xml` отдаются 200
- [ ] securityheaders.com → заголовки на месте; в консоли нет CSP-ошибок

**Аналитика**
- [ ] Событие `lead_submit` пишется только после ответа `ok:true`
