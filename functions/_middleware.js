// The repo root is also the Pages output dir, so sources, build configs and internal notes
// would be served as-is. _routes.json sends only these paths (plus /api/*) through Functions.
const PRIVATE = [
  /^\/(src|scripts|Claude outputs|\.claude|\.codex|\.impeccable)(\/|$)/,
  /^\/(package(-lock)?\.json|tailwind\.config\.js|DESIGN\.md|PRODUCT\.md|i18n\/pages\.mjs|\.git\w*)$/,
];

export async function onRequest({ request, next }) {
  let path = new URL(request.url).pathname;
  try { path = decodeURIComponent(path); } catch {}
  return PRIVATE.some(re => re.test(path)) ? new Response('Not found', { status: 404 }) : next();
}
