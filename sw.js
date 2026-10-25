/* Service worker : le site reste utilisable quand le réseau est lent ou coupé.
   - pages : réseau d'abord (4 s max), sinon la copie en mémoire ;
   - scripts / styles / polices / bibliothèques : copie en mémoire d'abord ;
   - médias Supabase (sons, vidéos, images) : copie en mémoire d'abord (préchargés par boot.js), lecture partielle (Range) comprise. */
const SHELL = 'lg-shell-v1';
const MEDIA = 'lg-media-v1';
const LIBS = 'lg-libs-v1';
const SUPABASE = 'ifjiysdhxmidiswcsiuq.supabase.co';
const CDN_HOSTS = ['unpkg.com', 'cdnjs.cloudflare.com', 'cdn.jsdelivr.net'];
const MAX_CACHED_BYTES = 120 * 1024 * 1024;

self.addEventListener('install', (e) => { self.skipWaiting(); });

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keep = [SHELL, MEDIA, LIBS];
    const names = await caches.keys();
    await Promise.all(names.filter((n) => !keep.includes(n)).map((n) => caches.delete(n)));
    // on garde dans SHELL uniquement les fichiers de la version courante (nettoyage des anciens ?v=)
    await self.clients.claim();
  })());
});

function timeout(ms) { return new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms)); }

async function networkFirst(req, ms) {
  const cache = await caches.open(SHELL);
  try {
    const res = await Promise.race([fetch(req), timeout(ms)]);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (e) {
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    return fetch(req);
  }
}

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
  return res;
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  const net = fetch(req).then((res) => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => null);
  return hit || (await net) || fetch(req);
}

async function serveRange(resp, range) {
  const m = /bytes=(\d*)-(\d*)/.exec(range || '');
  const blob = await resp.clone().blob();
  const size = blob.size;
  let s = 0, e = size - 1;
  if (m) {
    if (m[1] !== '') { s = parseInt(m[1], 10); if (m[2] !== '') e = parseInt(m[2], 10); }
    else if (m[2] !== '') { s = Math.max(0, size - parseInt(m[2], 10)); }
  }
  e = Math.min(e, size - 1);
  if (s > e) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + size } });
  return new Response(blob.slice(s, e + 1), {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': resp.headers.get('Content-Type') || 'application/octet-stream',
      'Content-Range': 'bytes ' + s + '-' + e + '/' + size,
      'Content-Length': String(e - s + 1),
      'Accept-Ranges': 'bytes'
    }
  });
}

async function media(req) {
  const cache = await caches.open(MEDIA);
  const hit = await cache.match(req.url);
  const range = req.headers.get('range');
  if (hit) return range ? serveRange(hit, range) : hit;
  if (range) return fetch(req);                       // pas encore en mémoire : lecture normale (le préchargement s'en occupe)
  try {
    const res = await fetch(req.url, { mode: 'cors' });   // réponse « cors » : on peut la garder en mémoire proprement
    const len = parseInt(res.headers.get('content-length') || '0', 10);
    if (res.ok && res.status === 200 && len < MAX_CACHED_BYTES) cache.put(req.url, res.clone());
    return res;
  } catch (e) {
    return fetch(req);
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  if (url.hostname === SUPABASE) { event.respondWith(media(req)); return; }
  if (CDN_HOSTS.includes(url.hostname)) { event.respondWith(cacheFirst(req, LIBS)); return; }
  if (url.origin !== self.location.origin) return;                // YouTube, PeerJS… : on ne touche pas
  if (url.pathname.endsWith('/sw.js')) return;

  if (req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    event.respondWith(networkFirst(req, 4000));
    return;
  }
  if (url.search.includes('v=')) event.respondWith(cacheFirst(req, SHELL));   // fichier versionné : jamais périmé
  else event.respondWith(staleWhileRevalidate(req, SHELL));
});
