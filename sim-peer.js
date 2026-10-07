// Simulateur de téléphone : actif UNIQUEMENT quand joueur.html est ouvert avec ?sim=... (page test).
// Il remplace PeerJS par un pont direct vers la fenêtre « Téléphones » (phones.html) : aucun réseau nécessaire.
(function () {
  const params = new URLSearchParams(location.search);
  if (!params.has('sim')) return;

  const simId = params.get('sim');
  const bridge = () => { try { return window.parent && window.parent.LG_SIM; } catch (e) { return null; } };

  // Stockage propre à chaque téléphone (conservé tant que la fenêtre Téléphones reste ouverte)
  const mem = {};
  const store = () => { const b = bridge(); return b ? b.storage(simId) : mem; };
  Storage.prototype.getItem = function (k) { const v = store()[k]; return v === undefined ? null : v; };
  Storage.prototype.setItem = function (k, v) { store()[k] = String(v); };
  Storage.prototype.removeItem = function (k) { delete store()[k]; };

  class Emitter {
    constructor() { this._h = {}; }
    on(ev, cb) { (this._h[ev] = this._h[ev] || []).push(cb); return this; }
    emit(ev, data) { (this._h[ev] || []).slice().forEach((cb) => cb(data)); }
  }

  class SimConn extends Emitter {
    constructor() { super(); this.open = false; this.peer = 'sim-' + simId; }
    send(msg) { const b = bridge(); if (b && this.open) b.fromPhone(simId, msg); }
    close() { this.open = false; this.emit('close'); }
  }

  class SimPeer extends Emitter {
    constructor() {
      super();
      this.destroyed = false;
      setTimeout(() => this.emit('open', 'sim-' + simId), 0);
    }
    connect() {
      const conn = new SimConn();
      setTimeout(() => {
        const b = bridge();
        if (!b) { this.emit('error', { type: 'peer-unavailable' }); return; }
        if (!b.registerPhone(simId, conn)) { this.emit('error', { type: 'network' }); return; }
        conn.open = true;
        conn.emit('open');
      }, 50);
      return conn;
    }
    destroy() { this.destroyed = true; }
  }

  window.Peer = SimPeer;

  // Pré-remplit le pseudo et rejoint automatiquement (sauf si une session est déjà restaurée)
  window.addEventListener('load', () => {
    if (typeof joinRoom !== 'function') return;
    const room = params.get('room'), name = params.get('name');
    const roomEl = document.getElementById('room-code');
    const nameEl = document.getElementById('player-name');
    const joinCard = document.getElementById('join-card');
    if (roomEl && room) roomEl.value = room.toUpperCase();
    if (name && nameEl && joinCard && joinCard.style.display !== 'none') {
      nameEl.value = name;
      joinRoom();
    }
  });
})();
