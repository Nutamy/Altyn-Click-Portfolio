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
    }
  }
};
