// Outils de la page test (test.html) : joueurs ajoutés à la main + pont vers les téléphones simulés.
// Charge-le APRÈS script.js (il réutilise les fonctions et variables de la régie).
(function () {
  // Prénoms tirés au hasard par « Ajouter ce nombre de joueurs »
  const NAMES = [
    'Alice', 'Bastien', 'Camille', 'David', 'Emma', 'Félix', 'Gaëlle', 'Hugo', 'Inès', 'Jules',
    'Karim', 'Léa', 'Marc', 'Nina', 'Oscar', 'Pauline', 'Quentin', 'Rose', 'Sacha', 'Théo',
    'Ulysse', 'Victor', 'Wendy', 'Xavier', 'Yasmine', 'Zoé', 'Adrien', 'Barbara', 'Cédric', 'Delphine',
    'Étienne', 'Fanny', 'Gaspard', 'Héloïse', 'Ibrahim', 'Jeanne', 'Kévin', 'Louise', 'Mathis', 'Noémie',
    'Olivier', 'Pierre', 'Romane', 'Samuel', 'Tiphaine', 'Valentin', 'Yann', 'Capucine', 'Dorian', 'Elsa',
    'Florian', 'Gabrielle', 'Hector', 'Iris', 'Jonas', 'Lina', 'Maxime', 'Nolan', 'Océane', 'Paul'
  ];

  let phonesWin = null;            // fenêtre des téléphones (dès son ouverture, même avant qu'elle soit chargée)
  let phonesLoaded = false;        // vrai quand phones.html a fini de se charger
  let seq = 0;
  let autoOn = false;
  const pendingAdds = [];          // téléphones à créer dès que la fenêtre est chargée
  const requested = new Set();     // noms déjà demandés (même si le téléphone n'a pas encore rejoint)
  const connByPhone = new Map();   // id du téléphone -> faux « conn » vu par la régie

  const phonesOpen = () => !!phonesWin && !phonesWin.closed;
  const phonesReady = () => phonesOpen() && phonesLoaded && !!phonesWin.LG_SIM;
  const clone = (o) => JSON.parse(JSON.stringify(o));

  // ----- pont appelé par la fenêtre des téléphones -----
  window.LG_TEST = {
    phonesReady(win) {
      // la fenêtre (re)vient de se charger : les anciens téléphones n'existent plus
      [...connByPhone.keys()].forEach((id) => window.LG_TEST.detach(id));
      phonesWin = win;
      phonesLoaded = true;
      while (pendingAdds.length) {
        const p = pendingAdds.shift();
        win.LG_SIM.addPhone(p.id, p.name);
      }
    },

    // un téléphone vient de se connecter : on crée sa « connexion » côté régie
    attach(id) {
      const old = connByPhone.get(id);
      if (old) old.open = false;
      const conn = {
        peer: 'sim-' + id,
        open: true,
        send(msg) {
          if (conn.open && phonesReady()) phonesWin.LG_SIM.toPhone(id, clone(msg));
        }
      };
      connByPhone.set(id, conn);
    },

    // coupure de réseau d'un téléphone
    detach(id) {
      const conn = connByPhone.get(id);
      if (!conn || !conn.open) return;
      conn.open = false;
      handlePlayerConnClose(conn);
    },

    // message envoyé par un téléphone : même traitement qu'avec PeerJS
    fromPhone(id, msg) {
      const conn = connByPhone.get(id);
      if (conn && conn.open) routePlayerMessage(conn, msg);
    },

    info(name) {
      const p = players.find((x) => x.name === name);
      return p ? { exists: true, connected: p.connected, alive: p.alive } : { exists: false };
    },

    removePlayer(id, name) {
      requested.delete(String(name).toLowerCase());
      window.LG_TEST.detach(id);
      if (!distributed) {
        const i = players.findIndex((p) => p.name === name);
        if (i >= 0) players.splice(i, 1);
        refreshPlayerViews();
      }
    },

    autoChanged(on) { autoOn = on; updateAutoButton(); }
  };

  // si la fenêtre des téléphones est fermée, tous les joueurs simulés passent hors ligne
  setInterval(() => {
    if (phonesWin && phonesWin.closed) {
      phonesWin = null;
      phonesLoaded = false;
      autoOn = false;
      updateAutoButton();
      [...connByPhone.keys()].forEach((id) => window.LG_TEST.detach(id));
    }
  }, 1000);

  function updateAutoButton() {
    const b = document.getElementById('test-auto-btn');
    if (b) b.textContent = '🤖 Tout en auto : ' + (autoOn ? 'OUI' : 'NON');
  }

  // ----- fenêtre des téléphones (une seule ouverture, jamais rouverte pendant son chargement) -----
  function openPhonesWindow() {
    if (phonesOpen()) {
      try { phonesWin.focus(); } catch (e) { /* ignoré */ }
      return true;
    }
    phonesLoaded = false;
    const w = window.open('phones.html?v=' + VERSION_APP, 'LGPhones', 'width=1320,height=920');
    if (!w) {
      alert("La fenêtre des téléphones a été bloquée par le navigateur.\nAutorisez les pop-ups pour ce site (icône dans la barre d'adresse), puis recommencez.");
      return false;
    }
    phonesWin = w;
    return true;
  }
  window.testOpenPhones = openPhonesWindow;

  // ----- ajout de joueurs -----
  function nameTaken(name) {
    const n = name.toLowerCase();
    return requested.has(n) || players.some((p) => p.name.toLowerCase() === n);
  }

  // nom aléatoire encore libre (« Joueur N » si tous les prénoms sont pris)
  function randomName() {
    const free = NAMES.filter((n) => !nameTaken(n));
    if (free.length) return free[Math.floor(Math.random() * free.length)];
    let k = 1;
    while (nameTaken('Joueur ' + k)) k++;
    return 'Joueur ' + k;
  }

  function addSimPlayer(name) {
    name = String(name || '').trim().slice(0, 20);
    if (!name) return false;
    if (distributed) {
      showToast("Les rôles sont déjà distribués : rechargez la page test pour recommencer une partie.", 'info');
      return false;
    }
    if (nameTaken(name)) {
      showToast(`Le nom « ${name} » est déjà pris.`, 'info');
      return false;
    }
    const id = String(++seq);
    requested.add(name.toLowerCase());
    if (phonesReady()) {
      phonesWin.LG_SIM.addPhone(id, name);
      return true;
    }
    // la fenêtre n'est pas encore chargée : on met en attente, sans la rouvrir
    pendingAdds.push({ id, name });
    if (!phonesOpen() && !openPhonesWindow()) {
      pendingAdds.pop();
      requested.delete(name.toLowerCase());
      return false;
    }
    return true;
  }

  window.testAddPlayer = function () {
    const input = document.getElementById('test-name');
    if (addSimPlayer(input.value)) input.value = '';
    input.focus();
  };

  // « Ajouter ce nombre de joueurs » : noms aléatoires
  window.testAddMany = function () {
    const n = Math.max(1, Math.min(16, parseInt(document.getElementById('test-count').value, 10) || 1));
    if (distributed) { showToast("Les rôles sont déjà distribués : rechargez la page test pour recommencer une partie.", 'info'); return; }
    if (!phonesOpen() && !openPhonesWindow()) return;
    for (let i = 0; i < n; i++) {
      if (!addSimPlayer(randomName())) break;
    }
  };

  window.testToggleAuto = function () {
    if (!phonesReady()) { showToast("Ouvrez d'abord la fenêtre des téléphones.", 'info'); return; }
    phonesWin.LG_SIM.setAllAuto(!autoOn);
  };

  // ----- rôles automatiques (sans aucune contrainte) -----
  window.testFillRoles = function () {
    const n = players.length;
    if (!n) { showToast("Ajoutez d'abord des joueurs (ils doivent être connectés).", 'info'); return; }
    // tous les non-loups comptent comme villageois : loups < n/2, rôles spéciaux d'abord, villageois pour compléter
    const wolves = Math.max(1, Math.min(Math.round(n / 4), Math.ceil(n / 2) - 1));
    const specials = ['Voyante', 'Sorcière', 'Cupidon', 'Chasseur', 'Voleur', 'Renard', 'Petite Fille'].slice(0, Math.max(0, n - wolves));
    const villagers = Math.max(0, n - wolves - specials.length);
    roles.length = 0;
    for (let i = 0; i < wolves; i++) roles.push('Loup-Garou');
    specials.forEach((r) => roles.push(r));
    for (let i = 0; i < villagers; i++) roles.push('Villageois');
    updateMJRoleList();
  };

  // ----- initialisation : salon simulé -----
  let inited = false;
  document.addEventListener('DOMContentLoaded', init);
  if (document.readyState !== 'loading') init();
  function init() {
    if (inited) return;
    inited = true;
    roomCode = 'TEST';
    document.getElementById('host-ui').style.display = 'block';
    document.getElementById('room-code-display').innerText = 'TEST';
    document.getElementById('join-url').textContent = '🧪 Salon simulé : aucun réseau nécessaire pour les téléphones de test.';
    document.getElementById('mj-setup-card').style.display = 'block';
    updateMJRoleList();
    if (typeof startLobbyMusic === 'function') startLobbyMusic();
    const input = document.getElementById('test-name');
    if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') window.testAddPlayer(); });
  }
})();