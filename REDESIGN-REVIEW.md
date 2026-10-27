# Redesign review

Branch: redesign/future-3d. The live main branch is unchanged.

## Run

- `npm ci`
- `npm run build` generates RU, KK and EN pages and the lazy 3D bundle.
- `npm run dev` starts a local static preview. `/__preview/mobile` contains a 390 × 844 iframe for layout QA.
- `npm test` checks the real lead handler with an isolated Telegram transport stub.

Cloudflare Pages: retain the existing output root and Functions directory; run `npm run build`. Keep TELEGRAM_BOT_TOKEN, CHAT_ID and the existing Turnstile secret in Cloudflare, never in the browser or Git. Allow the branch-preview hostname in Turnstile if needed.

## Verified

Build completed for all three languages. Six server tests passed: transport confirmation, Telegram application failure despite HTTP 200, network error, missing config, required fields/contact/consent/origin and configured captcha.

Browser QA: desktop 1353 × 929 and a 390 × 844 iframe layout (380px content viewport with scrollbar). No horizontal overflow in the inspected desktop/mobile layouts. Existing project images loaded. Anchor navigation to works and form worked. Invalid contact focused the contact field and displayed an error. An unconfigured preview endpoint displayed an honest send failure and kept the entered text. No production lead was sent.

## Not verified / release blockers

The cloud browser reports WebGL disabled, so it displayed the intended fallback. GPU rendering, reverse-scroll visual continuity, real phone touch and performance require a WebGL-capable browser. Reduced-motion logic is implemented, but OS preference emulation was not available in this browser API.

The static preview returns 503 for /api/lead. Actual Telegram delivery and the production Turnstile configuration must be checked on the Cloudflare branch preview. Tests use a mocked transport and do not prove delivery. No fake success is shown.

Source content comes from the existing repository main at 58f7d22, because altyn-click.com could not be fetched in this environment. Project descriptions are existing portfolio descriptions, not independently verified commercial results.
