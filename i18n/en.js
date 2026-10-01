/* English strings for app.js (dynamic UI and case studies). Loaded only on /en/ before app.js. */
window.I18N = {
  ui: {
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    optNone: '— no add-ons yet',
    optSum: sum => '+ ' + sum + ' ₸ (add-ons)',
    promoLine: (code, size, disc) => 'Promo code ' + code + ': ' + size + ' (−' + disc + ' ₸)',
    rowBase: 'Turnkey landing page',
    rowOpts: names => 'Add-ons: ' + names,
    rowPromo: code => 'Promo code ' + code,
    rowTotal: 'Estimated total',
    promoChecking: 'Checking…',
    promoOk: size => 'Promo code applied: ' + size + '. I’ll confirm the final amount in my reply.',
    promoExpired: 'This promo code has expired.',
    promoUnknown: 'That promo code doesn’t exist — please check the spelling.',
    promoNetErr: 'Couldn’t check the code. Send your request anyway — I’ll check it myself.',
    sending: 'Sending…',
    errTail: (tg, wa) => ' Or message me on ' + tg + ' / ' + wa + '.',
    errors: {
      captcha: 'The spam check didn’t go through — please try again.',
      contact: 'Please check your contact: I need a phone number or a Telegram username.',
      required: 'Please fill in your name and contact.',
      consent: 'Please tick the consent box.',
    },
    errGeneric: 'Couldn’t send your request. Please try again.',
    turnstileLang: 'en',
    openCase: 'Open case study: ',
    galExpand: 'See all projects',
    galCollapse: 'Collapse gallery',
    city: 'Almaty',
    done: 'What I did',
    highlight: 'Signature touch',
    wantSimilar: 'I want a site like this',
    viewSite: 'View live site',
    tellMore: tg => 'Happy to walk you through the decisions behind it ' + tg + '.',
    tellMoreLink: 'on Telegram',
    prevShot: 'Previous screenshot',
    nextShot: 'Next screenshot',
    closeCase: 'Close case study',
    showScreen: i => 'Show screen ' + i,
    shotAlt: (name, i, n) => 'Screenshot of the ' + name + ' website, screen ' + i + ' of ' + n,
  },
  works: {
    savepoint: {
      cat: 'Café & coworking',
      tag: 'A desk with a socket and coffee ready on the minute',
      tagline: 'Book a desk in 30 seconds — your espresso is ready when you arrive',
      about: 'Landing page for a specialty café and laptop-friendly space in central Almaty, aimed at freelancers, startup founders and anyone who meets people downtown. Their main frustration: circling the room looking for a free table with a socket and catching disapproving looks from staff because of the laptop. The goal was to move choosing a seat and ordering online, and lead visitors to book a desk or pre-order a drink.',
      done: [
        'A “familiar situation → solution” UX structure: four pain points of Almaty cafés — no free seats, hunting for a socket, “no laptops”, chaotic bookings — plus a “what we have → what you get” table.',
        'An interactive floor plan: three zones (by the window, for meetings, quiet corner), “free / freeing up soon / taken” statuses and one-tap table selection.',
        'Online pre-ordering: a menu by category and a basket with extras and a running total — the drink is ready at the exact minute you arrive.',
        'Bookings and orders go to the café’s Telegram bot via a Cloudflare server function, with field validation, spam protection and rate limiting.',
        'Conversion triggers: a −20% welcome promo code, a live occupancy indicator for peak hours and a separate booking flow for the 8–12-person event area.',
        'A retro-terminal style: neon green on a dark background, a pixel font, a custom pixel cursor and a fortune cookie on the first screen.'
      ],
      highlight: 'The site speaks its audience’s language: the interface is styled as a 90s gaming terminal, with TABLE_BOOKING.SYS and INVENTORY_MENU.DAT windows and a “checkpoint loaded” tag. The name Save Point becomes a promise: here you can “save your game” — grab a desk in advance instead of wasting time looking for a seat.'
    },
    elara: {
      cat: 'Dental clinic',
      tag: 'Dentistry where you know the price before treatment',
      tagline: 'No surprise bills: exam, X-rays and a treatment plan before you’re in the chair',
      about: 'Landing page for ELARA Dental, a new clinic in Almaty offering treatment, cosmetic dentistry and prosthetics for adults and children. It’s aimed at people who keep putting off the dentist because of a bad past experience and fear of an unexpected bill. The goal was to give a new clinic with no reviews real reasons to be trusted, and lead visitors to book a consultation with a treatment plan.',
      done: [
        'A “from fear to trust” UX structure: a “Sound familiar?” block with the four typical reasons people put off seeing a dentist.',
        'A three-step visit: on-site diagnostics with X-rays → a treatment plan with prices → treatment only once the patient agrees.',
        'Facts on the first screen: 4 treatment areas, 3 types of imaging, 1 visit before the treatment plan, 0 hidden charges.',
        'A service catalogue in an accordion: diagnostics, general dentistry, cosmetic, prosthetics — without overloading the page.',
        'A “Trust you can verify” block: equipment, the full cycle in-house and a written plan instead of reviews a new clinic doesn’t have yet.',
        'A calm blue-grey palette, an FAQ that tackles awkward questions and consultation CTAs throughout.'
      ],
      highlight: 'A new clinic has no reviews, and the site doesn’t pretend otherwise. Instead of social proof it offers verifiable facts: CBCT and panoramic X-rays on site, a treatment plan with the total in your hands, and an honest “be the first to leave a review” badge.'
    },
    alba: {
      cat: 'Beauty salon',
      tag: 'Beauty in 90 minutes · time for yourself',
      tagline: 'Beauty in 90 minutes — premium without the waiting',
      about: 'Premium landing page for Alba, a beauty salon in Almaty for busy women aged 25–45. Services: complex hair colouring, nails and brows. The goal was to ease a client’s three biggest fears — “they’ll ruin my hair”, “it’ll take half my day”, “the price will change” — and lead her to book via a form or WhatsApp.',
      done: [
        'A “problem — solution” UX structure: a “Sound familiar?” block with typical salon frustrations — and how Alba solves them.',
        'Five differentiators: two stylists working in parallel (the salon says this saves up to 40% of your time), a guarantee, fixed prices, sterile tools and location.',
        'Premium visuals: a restrained dark palette, a light-theme switch and smooth micro-animations.',
        'Transparent services and prices: a visit cost calculator and an honest fixed bill.',
        'Stylist profiles with direct booking to a specific specialist.',
        'Conversion: CTAs throughout, one-tap WhatsApp and an FAQ.'
      ],
      highlight: 'The headline “Beauty in 90 minutes” turns a vague “quick” into a concrete fact, while the “time for yourself” concept and the premium visit scenario make saving time part of the Alba brand’s value.'
    },
    proremont: {
      cat: 'Renovation',
      tag: 'Apartment renovation without surprises',
      tagline: 'Renovation without surprises: the price is in the contract, not just in words',
      about: 'Landing page for a full-cycle renovation company in Almaty — rough finishing, turnkey and designer renovations. It’s aimed at people afraid of the classic renovation risks: the price creeps up, the contractor disappears, deadlines slip. The goal was to turn distrust into enquiries through a cost estimate, concrete guarantees and real project examples.',
      done: [
        'A “from fears to guarantees” UX structure: three contractual guarantees — a fixed price, staged payments and a penalty for delays.',
        'Projects in the Medeu Park and RAMS City residential complexes: a before/after slider with the area, timeline and budget for each.',
        'An interactive per-m² cost calculator that removes the “you have to call to find out the price” barrier.',
        'Three packages priced per m²: 35,000 / 65,000 / 95,000 ₸ — the budget range is clear right away.',
        'A strict engineering style: a dark, restrained palette that fits a serious contractor.',
        'Conversion: CTAs for a site measurement and estimate, a form after the calculator, WhatsApp and Telegram.'
      ],
      highlight: 'The guarantees aren’t a vague declaration but three clauses from the contract — the usual renovation fears are answered with specifics. And projects with before/after photos work as visual proof of experience rather than a promise.'
    },
    tropinka: {
      name: 'Tropinka',
      cat: 'Kids’ center',
      tag: 'School readiness and development for ages 3–6',
      tagline: '“The path to school” — preparation without parental anxiety',
      about: 'A conversion-focused one-page site for a children’s center in Almaty. Programs for ages 3–6: school readiness, speech therapy, an art studio, Kazakh and English. The goal was to calm the parental worry of “are we already too late?”, explain the teaching approach and programs clearly, and move hesitant parents to book a trial class.',
      done: [
        'UX/UI and structure: logic that moves from the problem to the solution — trust and social proof, teaching approach, programs, teachers, prices.',
        'Social proof: the center’s 2GIS rating (5.0, according to the center’s listing) and parents’ reviews.',
        'Transparent programs and pricing: 3 attendance formats plus individual services — speech therapist and art studio.',
        'A teachers block: specialist profiles answer the “who am I trusting my child with?” objection.',
        'A mobile-first responsive build, since most parents visit from their phones.',
        'Technical optimisation: AVIF, WebP and WOFF2 for fast loading; conversion via a sign-up form, WhatsApp, a price list and CTAs throughout.'
      ],
      highlight: 'The “Thought → Movement → Creativity” design block visualises the center’s method instead of just describing it. Parents grasp Tropinka’s approach before reading the program, while the soft natural palette and the image of a path create a sense of safety and care from the very first second.'
    },
    steps: {
      cat: 'Child development center',
      tag: 'Every step is growth — and every step is visible',
      tagline: 'Transparency you can see: live cameras and progress checks',
      about: 'Landing page for Steps, a child development center in Almaty for ages 1.5–7 (speech development, logic, school readiness). It’s aimed at parents who worry about the unknown — “what actually happens with my child there?” The goal was to turn that worry into a free trial-class booking through transparency.',
      done: [
        'A UX structure that addresses fears one by one: settling in without tears, visible progress, no hidden extras, a stable team of teachers.',
        'Transparency as a core value: online cameras and class streams, monthly progress checks and sign-up with no commitment.',
        'Expandable cards from the psychologist and speech therapist that answer parents’ specific questions.',
        'Three plans with a “what’s included” table: 15,900–38,900 ₸.',
        'A short sign-up form for a free trial class, with a promise of a Telegram reply within 15 minutes.',
        'A warm cream palette and soft, playful visuals.'
      ],
      highlight: 'The headline “Every step is growth” is backed by a concrete feature: access to class streams and monthly progress checks. Parents don’t just take it on trust — they see the progress and can make sure their child is safe.'
    },
    targetolog: {
      name: 'Azamat Zhenisuly',
      cat: 'Paid social specialist',
      tag: 'Targeted ads that pay back ×3 — and you can calculate it',
      tagline: 'A system instead of “set it up and hope”: 7 steps and a live goal calculation',
      about: 'Personal website for an Almaty paid-social specialist who runs ads on Instagram, Facebook and TikTok for product businesses, service companies, experts and online schools. The service is invisible, and the business owner’s main question is “will my money come back?” The goal was to show the approach and the logic of the work, name the result in the language of money (×3) and lead visitors to a conversation on WhatsApp.',
      done: [
        'The offer on the first screen — “Paid ads that pay back ×3” — and four trust figures: 4+ years of practice, ×3 target ROI, 5–10 video creatives per launch, and 80% of ad success coming from the creative.',
        'An “About me” block with working principles (analytics, creative strategy, payback focus, a systematic approach) and the niches served: product businesses, services, experts and online schools.',
        'A 7-step system — from audience analysis and video-creative briefs to A/B tests, optimisation and reporting — shown as “bento” cards instead of a wall of text.',
        'An interactive goal calculation: a budget slider shows the target return and net profit (a 1,000,000 ₸ investment → 3,000,000 ₸ target return).',
        'An honest take on reviews: instead of invented quotes, contacts of current clients are available on request.',
        'Conversion: a WhatsApp button in the header and on every screen, a sticky “Discuss the project” bar on phones and one-tap copying of the phone number.'
      ],
      highlight: 'The site speaks the business owner’s language: not reach and clicks, but “1 ₸ → 3 ₸+”. The calculator slider turns the promise into numbers for the client’s own budget, while the dark palette with an emerald accent and the expert’s photo on the first screen set a tone of calm, professional confidence.'
    },
    wedding: {
      name: 'Aigerim &amp; Timur',
      cat: 'Wedding invitation',
      tag: 'A wedding where every guest knows their table and their ride',
      tagline: 'Everything a guest would ask in the group chat — on one page',
      about: 'Invitation website for a wedding on 12 June 2027 at the Bes Terek garden in the Alatau foothills. Guests usually piece the details together from dozens of messages: what time, where to go, what to wear, where to sit, what to give. The goal was to gather everything at one address and get an answer from every guest about attendance, the hot dish and transfer.',
      done: [
        'A first screen with the couple’s names, the date, a countdown to the wedding and two buttons — “Confirm attendance” and “Day program”.',
        '“How it all began”: the couple’s story as a three-milestone timeline — 2019, 2022, 2026 — in a personal, warm tone instead of a template invitation.',
        'A day program with a timeline, a venue card and logistics: the address, a 13:00 transfer from Republic Square with a return at 23:30 and free parking for 60 cars.',
        'A dress code through colour: eight “summer mountains” shades — pomegranate, saffron, turquoise, dusty rose and more — and a friendly note that white and cream are reserved for the bride.',
        'Seating with search: a guest types a first or last name and finds their table among 6 tables and 33 invitations; the tables are named after places the couple visited together.',
        'A wishlist with an “I’ll give this” button so gifts don’t overlap, and a guest form: attendance, party size, hot dish (beshbarmak, trout, vegetarian), transfer, a dance-floor song and a wish for the couple on a shared wall.'
      ],
      highlight: 'The site speaks in the couple’s voice: “Three years, two peaks and one cable-car queue”, a joke about three coffee machines in the wishlist and a Kazakh greeting, “Тойымызға қош келдіңіздер!”, on the first screen. Practical blocks — seating, transfer, the form — come through the couple’s character, so the information never reads like instructions.'
    },
    birthday: {
      name: 'Mission “Miron-7”',
      cat: 'Kids’ birthday party',
      tag: 'A birthday as a space flight with a boarding pass',
      tagline: 'Parents reply in a minute while the kids wait for liftoff',
      about: 'Invitation website for a seventh birthday with a space theme: 17 October 2026, 14:00–18:00, at the Orbita kids’ center in Almaty. Parents of the invited children need to quickly see where to go, when, what to wear and what to give, while the host needs to collect replies, allergies and pick-up times without dozens of private messages. The goal was to turn an organisational mailing into a game that adults and kids both enjoy.',
      done: [
        'A first screen with “Miron is 7!”, a rocket with “launch at 14:00” and “tap the rocket” hints, the date, time, venue, dress code and a countdown to liftoff.',
        'The program as a “flight plan”: times, stages and colour tags (Meet-up, Games, Quest, Food, Show); on the day itself the current item highlights automatically.',
        '“Who we’re expecting”: guests as crew cards with roles (navigator, flight engineer, pilot) and “Flying / Replied / On board” counters that update as replies arrive.',
        'A cargo bay instead of a wishlist: an “I’ll give this” button marks the gift so the birthday boy doesn’t end up with two telescopes, and shows a price guide.',
        'A “Who’s flying?” form: a name from the list, three statuses (I’m in! / Not sure yet / Can’t make it), adult and child counters, a wish for Miron and a “What the hosts should know” field.',
        'A boarding pass after replying and a crew memo: indoor shoes, sparkly clothes, parents may stay, and kids can be picked up from 17:50 to 18:15.'
      ],
      highlight: 'All the party logistics are presented as a space flight: the invitation is an “invitation on board”, registration is a “boarding pass” and wishes go into a “ship’s log”. The interface stays clear for parents, while the child gets a rocket and a boarding pass of their own; thick outlines and orange-pink accents on pale blue keep the mood of a cartoon game.'
    }
  }
};
