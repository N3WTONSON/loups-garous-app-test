/* Démarrage commun : service worker, préchargement des médias, indicateur de réseau. */
(function () {
  var LG = window.LG = window.LG || {};

  // ---- Service worker (HTTPS ou localhost uniquement) ----
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }

  // ---- Préchargement en arrière-plan (copie en mémoire du navigateur, servie ensuite par sw.js) ----
  var queue = [];
  var running = 0;
  var seen = {};
  function saveData() { var c = navigator.connection; return !!(c && c.saveData); }

  function pump() {
    if (!('caches' in window)) return;
    while (running < (LG.prefetchConcurrency || 1) && queue.length) {
      if (navigator.onLine === false) { setTimeout(pump, 5000); return; }
      running++;
      (function (url) {
        caches.open('lg-media-v1').then(function (cache) {
          return cache.match(url).then(function (hit) {
            if (hit) return;
            return fetch(url, { mode: 'cors' }).then(function (res) {
              if (res.ok && res.status === 200) return cache.put(url, res);
            });
          });
        }).catch(function () {}).then(function () {
          running--;
          setTimeout(pump, 150);
        });
      })(queue.shift());
    }
  }

  LG.prefetch = function (urls, opts) {
    if (!('caches' in window) || saveData()) return;
    opts = opts || {};
    if (opts.concurrency) LG.prefetchConcurrency = opts.concurrency;
    urls.forEach(function (u) { if (u && !seen[u]) { seen[u] = 1; queue.push(u); } });
    setTimeout(pump, opts.delay || 1500);
  };

  // ---- Indicateur de réseau (coupé / lent) ----
  var pill = null;
  function ensurePill() {
    if (pill || !document.body) return pill;
    pill = document.createElement('div');
    pill.id = 'net-pill';
    pill.style.cssText = 'position:fixed;left:50%;bottom:10px;transform:translateX(-50%);z-index:5000;padding:6px 14px;border-radius:16px;font:600 13px system-ui,sans-serif;color:#fff;background:rgba(180,40,40,.92);box-shadow:0 2px 10px rgba(0,0,0,.5);display:none;pointer-events:none;';
    document.body.appendChild(pill);
    return pill;
  }
  function refreshNet() {
    var p = ensurePill(); if (!p) return;
    var c = navigator.connection;
    if (navigator.onLine === false) {
      p.textContent = '📴 Pas de connexion — la partie reprendra dès le retour du réseau';
      p.style.background = 'rgba(180,40,40,.92)'; p.style.display = 'block';
    } else if (c && /^(slow-2g|2g|3g)$/.test(c.effectiveType || '')) {
      p.textContent = '🐢 Réseau lent — chargement plus long que d\'habitude';
      p.style.background = 'rgba(160,110,10,.92)'; p.style.display = 'block';
    } else {
      p.style.display = 'none';
    }
  }
  window.addEventListener('online', function () { refreshNet(); if (LG.onOnline) LG.onOnline(); });
  window.addEventListener('offline', refreshNet);
  if (navigator.connection && navigator.connection.addEventListener) navigator.connection.addEventListener('change', refreshNet);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refreshNet); else refreshNet();

  // ---- Options communes PeerJS (plusieurs serveurs STUN pour traverser les box / le partage 4G) ----
  LG.peerOptions = {
    debug: 0,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun.cloudflare.com:3478' },
        { urls: 'stun:global.stun.twilio.com:3478' }
      ],
      iceCandidatePoolSize: 4
    }
  };
})();
