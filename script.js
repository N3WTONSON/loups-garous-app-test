const VERSION_APP = "63";
console.info("Loup-Garou régie - version " + VERSION_APP);
let foxPowerLost = false;      // le MJ a répondu « non » : le Renard perd définitivement son pouvoir
let mayorCalled = false;       // le bouton « Le Maire » a déjà servi (bloqué ensuite)

// Mode test (page test.html uniquement) : rôles uniques et ratio non contrôlés
const TEST_MODE = !!window.LG_TEST_MODE;

const SUPABASE_BASE = "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets";

const ASSETS = {
  images: {
    "Chasseur.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Chasseur.png",
    "Cupidon.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Cupidon.png",
    "Loup-Garou.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Loup-Garou.png",
    "Maire.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Maire%201.png",
    "Voyante.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Voyante%201.png",
    "Voleur.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Voleur%201.png",
    "Villageois.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Villageois.png",
    "Renard.jpg": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Renard%201.png",
    "Petite Fille.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Petite%20Fille.png?v=2",
    "Sorciere.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Sorciere.png",
    "Titre.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Titre.png?v=2",
    "fond-village.jpg": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/fond-village.jpg",
  },
  audio: {
    "0 mort.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/0%20mort.mp3",
    "1 mort.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/1%20mort.mp3",
    "2 morts.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/2%20morts.mp3",
    "3 morts.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/3%20morts.mp3",
    "Appel Cupidon V2.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20Cupidon%20V2.mp3",
    "Appel jour V2.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20jour%20V2.mp3",
    "Appel Loups-Garous V2.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20Loups-Garous%20V2.mp3",
    "Appel nuit V2.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20nuit%20V2.mp3",
    "Appel Renard non.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20Renard%20non.mp3",
    "Appel Renard oui.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20Renard%20oui.mp3",
    "Appel renard V2.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20renard%20V2.mp3",
    "Appel voleur V3.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20voleur%20V3.mp3",
    "Appel voyante V2.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Appel%20voyante%20V2.mp3",
    "Fermer les yeux.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Fermer%20les%20yeux.mp3",
    "Voter.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Voter.mp3",
    "Le hurlement du loup 1.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Le%20hurlement%20du%20loup%201.mp3",
    "Le hurlement du loup 2.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Le%20hurlement%20du%20loup%202.mp3",
    "Le hurlement du loup 3.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Le%20hurlement%20du%20loup%203.mp3",
    "Applaudissements.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Applaudissements.mp3",
    "Effet sorciere.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Effet%20sorciere.mp3",
    "Maire.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Maire.mp3",
    "Sorciere.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Sorciere.mp3",
    "Sorciere 2 potions.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Sorciere%202%20potions.mp3",
    "Sorciere potion de vie.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Sorciere%20potion%20de%20vie.mp3",
    "Sorciere potion de mort.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/audio/Sorciere%20potion%20de%20mort.mp3",
  },
  music: {
    "Feast Circle 1.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/musique/Feast%20Circle%201.mp3",
    "Dusk in the Tavern 1.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/musique/Dusk%20in%20the%20Tavern%201.mp3",
    "Dusk in the Tavern 2.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/musique/Dusk%20in%20the%20Tavern%202.mp3",
    "Tavern at Dusk 1.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/musique/Tavern%20at%20Dusk%201.mp3",
    "Tavern at Dusk 2.mp3": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/musique/Tavern%20at%20Dusk%202.mp3",
  },
  video: {
    "Mort Loup.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Mort%20Loup.mp4",
    "Elimination 2.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Elimination%202.mp4",
    "Empoisoner.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Empoisoner.mp4",
    "Mort tire.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Mort%20tire.mp4",
    "Chasseur.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Chasseur.mp4",
    "Cupidon.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Cupidon.mp4",
    "La voyante.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/La%20voyante.mp4",
    "Loup-Garou.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Loup-Garou.mp4",
    "Maire.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Maire.mp4",
    "Renard.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Renard.mp4",
    "Voleur.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Voleur.mp4",
    "Sorciere.mp4": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/mj/video/Sorciere.mp4",
  }
};

const ASSET_FOLDERS = { images: "images", audio: "mj/audio", video: "mj/video", music: "mj/musique" };

function assetUrl(path) {
  return SUPABASE_BASE + "/" + path.split("/").map(encodeURIComponent).join("/");
}

function mediaUrl(kind, name) {
  return (ASSETS[kind] && ASSETS[kind][name]) || assetUrl(ASSET_FOLDERS[kind] + "/" + name);
}

// --- CONFIGURATION ---
const YT_ID_NUIT = "FDHc4qUNMTQ";
const YT_ID_JOUR = "bNyXbxpWiok";
const YT_ID_PRESENTATION = "VSfS9oM630s";

let peer = null;
let roomCode = "";
let players = [];
let roles = [];
let calledOnce = new Set();
let thiefOffers = new Map();
let distributed = false;
let afterAudio = null;         // son à enchaîner dès que la voix en cours est terminée
let END_TURN_DELAY = 2500;     // délai (ms) entre la fin d'un tour et « Fermez les yeux »
const CLOSE_EYES_AUDIO = 'Fermer les yeux.mp3';
let gameStarted = false;       // vrai après le premier appel du Maire : la carte du rôle passe en petit sur les téléphones
let reviewMode = false;         // phase de jour après le vol du Voleur : les joueurs revoient leur rôle
let allSeenShown = false;      // vrai quand tous les joueurs ont pris connaissance de leur rôle
let nightCalled = new Set();   // appels déjà faits cette nuit (pour proposer le prochain rôle)
let nextCallKey = null;       // bouton à utiliser ensuite (mis en évidence)
let currentTurnRole = null;   // rôle actuellement appelé (surbrillance du joueur dans le tableau de bord du MJ)
const TURN_ROLE_BY_CALL = { voleur: 'Voleur', cupidon: 'Cupidon', voyante: 'Voyante', renard: 'Renard', loups: 'Loup-Garou', sorciere: 'Sorcière', chasseur: 'Chasseur' };
let activeCallRoles = new Set();
let hostOpened = false;

let currentAudio = null;
let projectorWindow = null;
let overlayMode = null;
let currentOverlayFile = null;

// --- UTILITAIRES ---
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

const PROJECTOR_TARGET = window.location.origin === 'null' ? '*' : window.location.origin;

function projectorOpen() {
  return projectorWindow && !projectorWindow.closed;
}

function sendToProjector(msg) {
  if (!projectorOpen()) return false;
  projectorWindow.postMessage(msg, PROJECTOR_TARGET);
  return true;
}

function syncLobbyToProjector() {
  if (!projectorOpen() || !roomCode) return;
  const basePath = window.location.pathname.replace(/[^/]*$/, '');
  const joinUrl = `${window.location.origin}${basePath}joueur.html?room=${roomCode}`;
  
  sendToProjector({
    action: 'updateLobby',
    roomCode: roomCode,
    joinUrl: joinUrl,
    players: players.map(p => ({ name: p.name, connected: p.connected }))
  });
}

function openProjectorWindow() {
  if (!projectorOpen()) {
    projectorWindow = window.open('projecteur.html?v=63', 'ProjecteurLoupGarou', 'width=1280,height=720');
  } else {
    projectorWindow.focus();
  }
}

window.addEventListener('message', (event) => {
  const data = event.data;
  if (!data) return;
  if (data.action === 'projectorReady') {
    syncLobbyToProjector();
  } else if (data.action === 'eventEnded') {
    // l'annonce de mort vient de se terminer : victoire éventuelle d'abord, sinon l'annonce suivante, puis le lever du jour
    if (dayPause && !hunterState && !hunterWaiting()) resumePauseMusic();   // fin de l'élimination : la musique reprend pendant la pause
    if (hunterState) { onHunterEventEnded(); return; }
    if (victoryPending && currentWinner()) { dayQueue = null; showVictory(); }
    else {
      victoryPending = false;
      if (dayQueue) nextDayStep();
      else if (successionPending && gateSuccession(() => { if (hunterWaiting()) startHunterSequence(false); else resumePauseMusic(); })) { /* passation du Maire d'abord */ }
      else if (hunterWaiting()) startHunterSequence(false);   // mort pendant la journée (vote) : le Chasseur tire ensuite
    }
  } else if (data.action === 'overlayEnded') {
    // une vidéo lue une seule fois vient de se terminer : l'incrustation n'est plus à l'écran
    if (String(data.url || '').includes('Maire.mp4') && waitMusicWanted ) startWaitMusic();
    if (currentOverlayFile && mediaUrl('video', currentOverlayFile) === data.url) {
      overlayMode = null;
      currentOverlayFile = null;
    }
  }
});

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

function initHost(attempt = 0) {
  startLobbyMusic();                // lancée dans le clic « Créer un Salon » : le navigateur autorise la lecture
  if (peer && !peer.destroyed) peer.destroy();
  roomCode = generateRoomCode();
  peer = new Peer("LG-" + roomCode);

  peer.on('open', () => {
    hostOpened = true;
    startLobbyMusic();                // musique du lobby, en boucle jusqu'au début de la partie
    document.getElementById('host-ui').style.display = 'block';
    document.getElementById('room-code-display').innerText = roomCode;
    document.getElementById('mj-setup-card').style.display = 'block';

    const basePath = window.location.pathname.replace(/[^/]*$/, '');
    const joinUrl = `${window.location.origin}${basePath}joueur.html?room=${roomCode}`;
    document.getElementById('qrcode').innerHTML = "";
    new QRCode(document.getElementById("qrcode"), { text: joinUrl, width: 140, height: 140 });

    const urlEl = document.getElementById('join-url');
    if (window.location.origin === 'null') {
      urlEl.textContent = "⚠️ Page ouverte en file:// : le QR code ne fonctionnera pas. Hébergez le site (http/https).";
    } else {
      urlEl.textContent = joinUrl;
    }

    syncLobbyToProjector();
  });

  peer.on('connection', (conn) => {
    conn.on('data', (data) => routePlayerMessage(conn, data));
    conn.on('close', () => handlePlayerConnClose(conn));
  });

  peer.on('error', (err) => {
    if (err.type === 'unavailable-id' && attempt < 3) {
      initHost(attempt + 1);
    } else if (err.type === 'unavailable-id') {
      alert("Impossible de réserver un code de salon. Réessayez.");
    } else if (!hostOpened) {
      alert("Impossible de créer le salon (" + err.type + "). Vérifiez votre connexion.");
    } else {
      console.warn("Erreur PeerJS :", err);
    }
  });
}

// Message reçu d'un téléphone (PeerJS ou téléphone simulé de la page test)
function routePlayerMessage(conn, data) {
  if (!data) return;
  if (data.type === 'join') handleJoin(conn, data);
  else if (data.type === 'thiefSteal') handleThiefSteal(conn, data);
  else if (data.type === 'cupidChoice') handleCupidChoice(conn, data);
  else if (data.type === 'wolfVote') handleWolfVote(conn, data);
  else if (data.type === 'wolfFinal') handleWolfFinal(conn);
  else if (data.type === 'witchAction') handleWitchAction(conn, data);
  else if (data.type === 'villageVote') handleVillageVote(conn, data);
  else if (data.type === 'seerChoice') handleSeerChoice(conn, data);
  else if (data.type === 'seerClosed') handleSeerClosed(conn);
  else if (data.type === 'foxChoice') handleFoxChoice(conn, data);
  else if (data.type === 'foxClosed') handleFoxClosed(conn);
  else if (data.type === 'hunterShoot') handleHunterShot(conn, data);
  else if (data.type === 'mayorVote') handleMayorVote(conn, data);
  else if (data.type === 'mayorCandidacy') handleMayorCandidacy(conn, data);
  else if (data.type === 'rpsPick') handleRpsPick(conn, data);
  else if (data.type === 'roleSeen') handleRoleSeen(conn);
  else if (data.type === 'mayorSuccessor') handleMayorSuccessor(conn, data);
}

function handlePlayerConnClose(conn) {
  const p = players.find((pl) => pl.conn === conn);
  if (p) {
    p.connected = false;
    refreshPlayerViews();
  }
}

function handleJoin(conn, data) {
  const name = String(data.playerName || '').trim().slice(0, 20);
  const token = String(data.token || '');

  if (!name) {
    conn.send({ type: 'rejected', message: "Pseudo vide." });
    return;
  }

  let player = players.find((p) => p.name.toLowerCase() === name.toLowerCase());

  if (player) {
    const sameToken = token && player.token === token;
    if (!sameToken && player.connected) {
      conn.send({ type: 'rejected', message: "Ce pseudo est déjà pris dans la partie." });
      return;
    }
    if (!sameToken && !player.connected) {
      player.token = token || player.token;
    }
    player.conn = conn;
    player.connected = true;
  } else {
    if (distributed) {
      conn.send({ type: 'rejected', message: "La partie a déjà commencé." });
      return;
    }
    player = { name, token, role: "", alive: true, inLove: false, conn, connected: true };
    players.push(player);
  }

  conn.send({ type: 'joined' });
  if (player.role) conn.send({ type: 'assignRole', role: player.role });
  resyncPlayer(player);
  refreshPlayerViews();
}

function refreshPlayerViews() {
  updateMJPlayerList();
  syncLobbyToProjector();
  if (distributed) renderMJDashboard();
}

function addRole(roleName) {
  if (!TEST_MODE && UNIQUE_ROLES.includes(roleName) && roles.includes(roleName)) {
    showToast(`« ${roleName} » ne peut être présent qu'une seule fois dans la partie.`, 'info');
    return;
  }
  roles.push(roleName);
  updateMJRoleList();
}

// Remplit les rôles selon le nombre de joueurs : loups < moitié, rôles spéciaux d'abord, villageois pour compléter
function autoFillRoles(thenDistribute) {
  const n = players.length;
  if (n < 3) { showToast('Il faut au moins 3 joueurs connectés.', 'info'); return; }
  const wolves = Math.max(1, Math.min(Math.round(n / 4), Math.ceil(n / 2) - 1));
  const specials = ['Voyante', 'Sorcière', 'Cupidon', 'Chasseur', 'Voleur', 'Renard', 'Petite Fille'].slice(0, Math.max(0, n - wolves));
  roles.length = 0;
  for (let i = 0; i < wolves; i++) roles.push('Loup-Garou');
  specials.forEach((r) => roles.push(r));
  while (roles.length < n) roles.push('Villageois');
  updateMJRoleList();
  if (thenDistribute) distributeRolesNetwork();
}

function removeRole(index) {
  roles.splice(index, 1);
  updateMJRoleList();
}

function updateMJPlayerList() {
  document.getElementById('player-list').innerHTML = players
    .map((p) => `<li>${p.connected ? '🟢' : '📴'} <span class="nom-joueur">${escapeHtml(p.name)}</span></li>`)
    .join('');
  document.getElementById('player-count').innerText = players.length;
}

function updateMJRoleList() {
  document.getElementById('role-list').innerHTML = roles
    .map((r, i) => `<li>${escapeHtml(r)} <span class="remove" onclick="removeRole(${i})">&times;</span></li>`)
    .join('');
  document.getElementById('role-count').innerText = roles.length;

  // rôles à exemplaire unique : le bouton se grise une fois ajouté
  document.querySelectorAll('[data-pick]').forEach((btn) => {
    const taken = !TEST_MODE && UNIQUE_ROLES.includes(btn.dataset.pick) && roles.includes(btn.dataset.pick);
    btn.disabled = taken;
    btn.classList.toggle('used', taken);
  });

  // ratio : plus de Villageois que de Loups-Garous
  const ratio = document.getElementById('role-ratio');
  if (ratio) {
    // tout rôle autre que Loup-Garou compte comme villageois pour le ratio
    const w = roles.filter((r) => r === 'Loup-Garou').length;
    const v = roles.length - w;
    const simple = roles.filter((r) => r === 'Villageois').length;
    const spec = v - simple;
    const ok = w >= 1 && v > w;
    ratio.className = 'hint role-ratio ' + (TEST_MODE ? 'ok' : (ok ? 'ok' : (roles.length ? 'bad' : '')));
    const distBtn = document.getElementById('distribute-btn');
    if (distBtn) {
      distBtn.disabled = !TEST_MODE && roles.length > 0 && !ok;
      distBtn.title = distBtn.disabled ? 'Il faut au moins 1 Loup-Garou et plus de villageois (rôles spéciaux inclus) que de Loups-Garous.' : '';
    }
    ratio.textContent = TEST_MODE
      ? `🧪 Mode test : rôles uniques et ratio non contrôlés — Villageois (rôles spéciaux inclus) : ${v} · Loups-Garous : ${w}`
      : roles.length
      ? `Villageois : ${v} (dont ${spec} rôle(s) spécial(aux)) · Loups-Garous : ${w} — ${ok ? '✅ ratio valide' : '⚠️ il faut au moins 1 Loup-Garou et plus de villageois (rôles spéciaux inclus) que de Loups-Garous'}`
      : "Rôle unique : Voyante, Sorcière, Chasseur, Cupidon, Voleur, Renard, Petite Fille. Ratio : tous les rôles autres que Loup-Garou comptent comme villageois et doivent être plus nombreux que les Loups-Garous.";
  }
}

// ---- Début de partie : fenêtre quand tous les joueurs ont pris connaissance de leur rôle ----

function closeAllSeenModal() {
  const m = document.getElementById('all-seen-modal');
  if (m) m.remove();
}

function showAllSeenModal() {
  closeAllSeenModal();
  const m = document.createElement('div');
  m.id = 'all-seen-modal';
  m.style.cssText = 'position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.72);';
  m.innerHTML = '<div style="background:#1a1d2b;border:2px solid #fcd34d;border-radius:16px;padding:28px 34px;max-width:480px;text-align:center;color:#f4dcdc;box-shadow:0 0 30px rgba(0,0,0,0.8);">' +
    '<div style="font-size:3rem;">✅</div>' +
    '<h2 class="titre-wolf" style="margin:10px 0;color:#fcd34d;">Tous les joueurs sont prêts</h2>' +
    '<p style="margin:0 0 18px;">Tous les joueurs ont pris connaissance de leur rôle. Vous pouvez commencer la partie.</p>' +
    '<button type="button" class="btn btn-day" onclick="closeAllSeenModal()">OK, on commence</button></div>';
  document.body.appendChild(m);
}

// Tant que tous les joueurs n'ont pas pris connaissance de leur rôle, la partie ne peut pas commencer
function startBlocked() {
  if (!distributed) { showToast("Distribuez d'abord les rôles : la partie ne peut pas commencer.", 'info'); return true; }
  if (allSeenShown) return false;
  const waiting = players.filter((p) => !p.seenRole).map((p) => p.name);
  showToast(`⏳ La partie ne peut pas commencer : ${waiting.join(', ')} n'${waiting.length > 1 ? 'ont' : 'a'} pas encore pris connaissance de ${waiting.length > 1 ? 'leur rôle' : 'son rôle'}.`, 'info');
  return true;
}

function checkAllSeen() {
  if (!distributed || (gameStarted && !reviewMode) || allSeenShown || !players.length) return;
  if (!players.every((p) => p.seenRole)) return;
  allSeenShown = true;
  if (reviewMode) { endRoleReview(); return; }
  showAllSeenModal();
}

// ---- Après le vol du Voleur : phase de jour, tous les joueurs reprennent connaissance de leur rôle ----
function startRoleReview() {
  if (reviewMode) return;
  reviewMode = true;
  allSeenShown = false;
  players.forEach((p) => { p.seenRole = false; });
  stopRoleVideo();
  stopMusic(300);
  waitMusicWanted = false;
  players.forEach((p) => sendTo(p, { type: 'roleReview', on: true }));
  sendToProjector({ action: 'dayVote', show: true, mode: 'roles' });
  startDayMusic();
  setNextCall(null);
  showToast('🌞 Phase de jour : les joueurs reprennent connaissance de leur rôle sur leur téléphone.', 'info');
  updateCallButtons();
  renderMJDashboard();
}

function endRoleReview() {
  reviewMode = false;
  stopDayMusic();
  sendToProjector({ action: 'dayVote', show: false });
  players.forEach((p) => { sendTo(p, { type: 'roleReview', on: false }); sendTo(p, { type: 'gameStarted', started: true }); });
  showToast('✅ Tous les joueurs ont repris connaissance de leur rôle : la nuit peut tomber.', 'info');
  setNextCall('nuit');
  renderMJDashboard();
}

function handleRoleSeen(conn) {
  const p = senderOf(conn);
  if (!p || !distributed) return;
  p.seenRole = true;
  checkAllSeen();
  updateCallButtons();
  renderMJDashboard();
}

function distributeRolesNetwork() {
  if (players.length === 0 || roles.length !== players.length) {
    alert("Vérifiez que le nombre de joueurs équivaut au nombre de rôles.");
    return;
  }
  if (!TEST_MODE) {
    const dup = UNIQUE_ROLES.find((r) => roles.filter((x) => x === r).length > 1);
    if (dup) {
      alert(`Le rôle « ${dup} » ne peut être présent qu'une seule fois.`);
      return;
    }
    const nbWolves = roles.filter((r) => r === 'Loup-Garou').length;
    const nbVillagers = roles.length - nbWolves; // rôles spéciaux = villageois
    if (nbWolves < 1) {
      alert("Ajoutez au moins un Loup-Garou.");
      return;
    }
    if (nbVillagers <= nbWolves) {
      alert(`Il faut plus de villageois (rôles spéciaux inclus) que de Loups-Garous (actuellement ${nbVillagers} pour ${nbWolves} Loup(s)-Garou(s)).`);
      return;
    }
  }

  const shuffled = [...roles];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  players.forEach((player, i) => {
    player.role = shuffled[i];
    player.alive = true;
    player.inLove = false;
    player.diedOfLove = false;
    player.seenRole = false;
    if (player.conn && player.conn.open) {
      player.conn.send({ type: 'assignRole', role: player.role });
      player.conn.send({ type: 'status', alive: true });
      player.conn.send({ type: 'lover', partner: null });
      player.conn.send({ type: 'gameStarted', started: false });
    }
  });
  distributed = true;
  allSeenShown = false;
  closeAllSeenModal();
  activeCallRoles = new Set(roles);
  calledOnce = new Set();
  thiefOffers = new Map();
  resetGameAutomation();
  updateCallButtons();

  renderMJDashboard();
}

function updateCallButtons() {
  const locked = !distributed || !allSeenShown;   // tant que tous les joueurs n'ont pas vu leur rôle : tout est bloqué
  const mayorBtn = document.getElementById('mayor-call-btn');
  if (mayorBtn) {
    const used = mayorCalled || locked;
    mayorBtn.disabled = used;
    mayorBtn.classList.toggle('used', used);
  }
  ['night-call-btn', 'day-call-btn'].forEach((id) => {
    const b = document.getElementById(id);
    if (b) { b.disabled = locked; b.classList.toggle('used', locked); }
  });
  const grid = document.getElementById('calls-grid');
  const hint = document.getElementById('calls-hint');
  if (!grid || !hint) return;

  let visible = 0;
  grid.querySelectorAll('[data-role]').forEach((btn) => {
    const show = distributed && activeCallRoles.has(btn.dataset.role);
    btn.style.display = show ? '' : 'none';
    if (show) visible++;

    const once = btn.dataset.call;
    const used = !!once && calledOnce.has(once);
    // rôle sans joueur en vie (mort, ou tous les Loups-Garous morts) : bouton grisé et inutilisable
    const noneAlive = distributed && !players.some((p) => p.alive && p.role === btn.dataset.role);
    // Sorcière sans aucune potion : on passe son tour, bouton grisé et bloqué
    const noPotion = btn.dataset.role === 'Sorcière' && witchState.lifeUsed && witchState.deathUsed;
    const foxLost = btn.dataset.role === 'Renard' && foxPowerLost;
    btn.disabled = used || noneAlive || noPotion || foxLost || locked;
    btn.classList.toggle('used', used || noneAlive || noPotion || foxLost || locked);
  });
  document.querySelectorAll('#calls-grid [data-key]').forEach((b) => b.classList.toggle('next-call', !locked && !!nextCallKey && b.dataset.key === nextCallKey));

  if (!distributed) {
    hint.textContent = "Distribuez les rôles : seuls les personnages en jeu apparaîtront ici.";
    hint.style.display = 'block';
  } else if (!allSeenShown) {
    hint.textContent = reviewMode ? "🌞 Le Voleur a agi : tous les joueurs doivent reprendre connaissance de leur rôle sur leur téléphone. Les boutons sont bloqués." : "⏳ En attente : tous les joueurs doivent d'abord prendre connaissance de leur rôle sur leur téléphone. Les boutons sont bloqués.";
    hint.style.display = 'block';
  } else if (visible === 0) {
    hint.textContent = "Aucun personnage à appeler dans cette partie.";
    hint.style.display = 'block';
  } else {
    hint.style.display = 'none';
  }
}

const ROLE_EMOJI = {
  'Loup-Garou': '🐺', 'Villageois': '👨‍🌾', 'Voyante': '🔮', 'Sorcière': '🧪', 'Chasseur': '🏹',
  'Cupidon': '💘', 'Voleur': '🕵️', 'Renard': '🦊', 'Petite Fille': '👧'
};

// Joueur dont c'est le tour pendant la nuit : null si ce n'est pas lui
function turnStatusOf(p) {
  if (!p.alive || !currentTurnRole || p.role !== currentTurnRole) return null;
  switch (currentTurnRole) {
    case 'Voleur': return thiefOffers.has(p.name) ? 'wait' : 'done';
    case 'Cupidon': return cupidWaiting.has(p.name) ? 'wait' : 'done';
    case 'Voyante': return seerWaiting.has(p.name) ? 'wait' : ((seerResults.has(p.name) && !seerAcked.has(p.name)) ? 'view' : 'done');
    case 'Sorcière': return witchWaiting.has(p.name) ? 'wait' : 'done';
    case 'Loup-Garou': return (wolvesOpen && !night.wolfFinal.has(p.name)) ? 'wait' : 'done';
    case 'Renard':
      if (foxWaiting.has(p.name) || !foxChoices.has(p.name)) return 'wait';        // il choisit un joueur
      if (!foxAnswered.has(p.name)) return 'answer';                               // le MJ doit répondre Oui / Non
      return foxAcked.has(p.name) ? 'done' : 'view';                               // il consulte la réponse
    default: return 'oral';          // Chasseur : répond à l'oral
  }
}

const TURN_BADGES = {
  wait: '⏳ À son tour : il choisit…',
  view: '👀 Consulte sa vision',
  answer: '❓ A désigné un joueur : répondez Oui / Non',
  done: '✅ A joué',
  oral: '🎙️ À son tour'
};

function renderMJDashboard() {
  const tbody = document.getElementById('mj-table-body');
  let html = players.map((item, index) => {
    const turn = turnStatusOf(item);
    return `
    <tr class="${[item.alive ? '' : 'dead', turn ? 'turn turn-' + turn : ''].join(' ').trim()}">
      <td><strong class="nom-joueur">${escapeHtml(item.name)}</strong>${item.name === mayor ? ' 👑' : ''} ${item.connected ? '' : '📴'}${turn ? `<span class="turn-badge">${TURN_BADGES[turn]}</span>` : ''}</td>
      <td>${ROLE_EMOJI[item.role] || '🎭'} ${escapeHtml(item.role)}</td>
      <td>
        <label style="cursor: pointer; display: flex; align-items: center; gap: 6px;">
          <input type="checkbox" ${item.inLove ? 'checked' : ''} onchange="togglePlayerLove(${index})">
          💘 Amoureux
        </label>
      </td>
      <td>
        <button class="status-btn ${item.alive ? 'status-alive' : 'status-dead'}" onclick="togglePlayerStatus(${index})">
          ${item.alive ? '🟢 En vie' : '💀 Mort'}
        </button>
      </td>
    </tr>`;
  }).join('');

  tbody.innerHTML = html;
  document.getElementById('mj-dashboard').style.display = 'block';
  renderAutomation();
  renderMayorControls();
}

// Amoureux : cochés automatiquement par Cupidon (téléphone), corrigeables à la main
function togglePlayerLove(index) {
  const p = players[index];
  if (!p.inLove && players.filter((x) => x.inLove).length >= 2) {
    showToast("Cupidon ne désigne que 2 amoureux : décochez-en un d'abord.", 'info');
    renderMJDashboard();
    return;
  }
  p.inLove = !p.inLove;
  notifyLovers();
  renderMJDashboard();
}

function notifyLovers() {
  const pair = players.filter((p) => p.inLove);
  players.forEach((p) => {
    const partner = p.inLove && pair.length === 2 ? pair.find((x) => x !== p) : null;
    sendTo(p, { type: 'lover', partner: partner ? partner.name : null });
  });
}

// Mort manuelle (bouton du tableau) : annonce plein écran avec griffures
function togglePlayerStatus(index) {
  const p = players[index];
  if (p.alive) {
    const deaths = killPlayers([p.name]);
    renderMJDashboard();
    announceDeaths(deaths);
    checkVictory('delay');
    if (hunterWaiting()) setTimeout(() => { if (hunterWaiting() && !hunterState && !dayQueue) startHunterSequence(false); }, 8500);
  } else {
    setAlive(p, true);
    p.diedOfLove = false;
    if (successionPending === p.name) cancelMayorSuccession();
    // correction d'erreur : l'amoureux mort uniquement de chagrin revient aussi
    const partner = p.inLove ? players.find((x) => x !== p && x.inLove) : null;
    if (partner && !partner.alive && partner.diedOfLove) {
      setAlive(partner, true);
      partner.diedOfLove = false;
      showToast(`💘 ${partner.name} revient à la vie avec ${p.name}.`, 'info');
    }
    renderMJDashboard();
  }
}

function announceDeaths(deaths) {
  if (!deaths.length) return;
  sendToProjector({ action: 'announceDeath', deaths });
  const text = deaths
    .map((d) => (d.love ? `💔 ${d.name} meurt de chagrin` : `💀 ${d.name} est mort`))
    .join(' — ');
  showToast(text, 'info');
}

// --- MÉDIAS ---
const DAY_SCENE_FACTOR = 25 / 80;   // 25 % du volume YouTube (le plafond de l'écran secondaire est 80)
let sceneBase = 1;
function setProjectorVideoVolume(vol, duration = 600) {
  sendToProjector({ action: 'setVolume', volume: vol * sceneBase, duration });
}

// ---- Limite du niveau audio : aucun son ne dépasse MAX_VOLUME, et chaque son démarre en fondu (jamais « d'un seul coup ») ----
const MAX_VOLUME = 0.8;          // plafond du volume (1 = maximum) pour tous les sons de la régie
const FADE_IN_MS = 500;
const LOUD_AUDIO = { "Fermer les yeux.mp3": 1.0, "Appel Cupidon V2.mp3": 1.0 };   // sons un peu plus forts que le plafond habituel          // durée du fondu d'entrée

function fadeInAudio(audio, ms = FADE_IN_MS, max = MAX_VOLUME) {
  const steps = 10;
  let i = 0;
  audio.volume = 0;
  const tick = () => {
    i++;
    audio.volume = Math.min(max, max * i / steps);
    if (i < steps && !audio.ended) setTimeout(tick, ms / steps);
  };
  setTimeout(tick, ms / steps);
}

// loop = false : la vidéo est lue une seule fois, puis disparaît (ex. vidéo du Maire)
function playRoleVideo(fileName, mode = 'center', loop = true) {
  if (fileName !== 'Maire.mp4') { waitMusicWanted = false; stopWaitMusic(); }
  overlayMode = mode;
  currentOverlayFile = fileName;
  sendToProjector({ action: 'playOverlayVideo', url: mediaUrl('video', fileName), mode, loop });
}

function stopRoleVideo() {
  overlayMode = null;
  currentOverlayFile = null;
  sendToProjector({ action: 'stopOverlayVideo' });
}

function isCenteredVideo(fileName) {
  return (overlayMode === 'center' || overlayMode === 'full') && currentOverlayFile === fileName;
}

function resumePauseMusic() {
  if (!dayPause || gameOver) return;
  if (!hunterState && !successionPending && projectorOpen()) sendToProjector({ action: 'dayVote', show: true, mode: 'night' });   // tout est annoncé : en attente de la nuit
  waitMusicWanted = true;
  startWaitMusic();
}

function playScene(videoId, loop = true) {
  dayPause = false;
  waitMusicWanted = false;
  stopWaitMusic();
  stopDayMusic();
  if (!sendToProjector({ action: 'playYTVideo', videoId, loop })) {
    alert("Veuillez d'abord cliquer sur 'Ouvrir l'Écran Secondaire' !");
  } else {
    overlayMode = null;
    currentOverlayFile = null;
    // scène de jour : volume à 25 % (YouTube 0-100) ; les autres scènes au niveau normal
    sceneBase = videoId === YT_ID_JOUR ? DAY_SCENE_FACTOR : 1;
    setProjectorVideoVolume(1.0, 300);
  }
}


// ---------------------------- MUSIQUE D'AMBIANCE ----------------------------
// - Lobby (avant le début de la partie) : « Feast Circle 1 » en boucle.
// - Temps d'attente (élection du Maire) : les autres morceaux, au hasard, sans jamais rejouer le même deux fois de suite, à 50 %.
const MUSIC_LOBBY = "Feast Circle 1.mp3";
const MUSIC_WAIT_TRACKS = ["Dusk in the Tavern 1.mp3", "Dusk in the Tavern 2.mp3", "Tavern at Dusk 1.mp3", "Tavern at Dusk 2.mp3"];
const MUSIC_WAIT_VOLUME = 0.5;
const MUSIC_DAY_VOLUME = 0.3;   // débat du village (jour) : « Feast Circle 1 » à 30 %
const MUSIC_DUCK_VOLUME = 0.12;
const MUSIC_SPEECH_VOLUME = 0.06;  // niveau pendant les discours des candidats (musique très discrète)
let musicQuiet = false;   // niveau pendant que le MJ parle (voix enregistrées)

let musicAudio = null;
let musicMode = null;        // 'lobby' | 'wait' | null
let musicDuck = false;
let musicPaused = false;
let musicLastTrack = null;
let musicToken = 0;
let musicRetryBound = false;
let mayorMusicTimer = null;
let waitMusicWanted = false;   // la musique d'attente est autorisée entre l'appel du Maire et le début de la nuit

function musicLevel() {
  const base = musicMode === 'lobby' ? MAX_VOLUME : (musicMode === 'day' ? MUSIC_DAY_VOLUME : MUSIC_WAIT_VOLUME);
  let v = base;
  if (musicQuiet && musicMode === 'wait') v = Math.min(v, MUSIC_SPEECH_VOLUME);
  if (musicDuck) v = Math.min(v, MUSIC_DUCK_VOLUME);
  return v;
}

function setMusicVolume(ms = 300) {
  const a = musicAudio;
  if (!a) return;
  const from = a.volume, to = musicLevel(), steps = 8;
  let i = 0;
  (function tick() {
    if (musicAudio !== a) return;
    i++;
    a.volume = Math.max(0, Math.min(1, from + (to - from) * i / steps));
    if (i < steps) setTimeout(tick, ms / steps);
  })();
}

function duckMusic(on) {
  if (musicDuck === on) return;
  musicDuck = on;
  setMusicVolume(on ? 250 : 700);
}

function bindMusicRetry() {
  if (musicRetryBound) return;
  musicRetryBound = true;
  document.addEventListener('click', () => {      // lecture refusée (pas encore de clic) : on réessaie au premier clic
    musicRetryBound = false;
    if (musicAudio && musicAudio.paused && !musicPaused && musicMode) musicAudio.play().then(() => setMusicVolume(1500)).catch(() => {});
  }, { once: true });
}

function launchMusic(name, loop, onEnd) {
  const token = musicToken;
  const audio = new Audio(mediaUrl('music', name));
  audio.loop = loop;
  audio.volume = 0;
  musicAudio = audio;
  if (onEnd) audio.addEventListener('ended', () => { if (token === musicToken && musicAudio === audio) onEnd(); });
  audio.addEventListener('error', () => {
    if (token !== musicToken || musicAudio !== audio) return;
    console.warn('Musique introuvable :', audio.src);
    if (!onEnd) showToast('🎵 Musique introuvable sur Supabase : ' + name + ' (vérifiez assets/mj/musique et test-assets.html).', 'info');
    if (onEnd) onEnd(true);
  });
  if (!musicPaused) {
    audio.play().then(() => setMusicVolume(1500)).catch((err) => {
      if (err && err.name === 'NotAllowedError') {
        bindMusicRetry();
        showToast('🎵 Le navigateur a bloqué la musique : cliquez n\'importe où sur la page pour la lancer.', 'info');
      } else console.warn('Lecture de la musique impossible :', err);
    });
  }
}

function stopMusic(ms = 800) {
  musicToken++;
  musicQuiet = false;
  musicMode = null;
  musicPaused = false;
  clearTimeout(mayorMusicTimer);
  const a = musicAudio;
  musicAudio = null;
  if (!a) return;
  const from = a.volume, steps = 8;
  let i = 0;
  (function tick() {
    i++;
    a.volume = Math.max(0, from * (1 - i / steps));
    if (i < steps) setTimeout(tick, ms / steps);
    else a.pause();
  })();
}

function startLobbyMusic() {
  if (musicMode === 'lobby') return;
  stopMusic(300);
  musicMode = 'lobby';
  launchMusic(MUSIC_LOBBY, true, null);
}

function startDayMusic() {
  if (musicMode === 'day') return;
  stopMusic(300);
  musicMode = 'day';
  launchMusic(MUSIC_LOBBY, true, null);
}

function stopDayMusic() { if (musicMode === 'day') stopMusic(); }

function stopLobbyMusic() { if (musicMode === 'lobby') stopMusic(); }

function pickWaitTrack() {
  const pool = MUSIC_WAIT_TRACKS.filter((t) => t !== musicLastTrack);
  const list = pool.length ? pool : MUSIC_WAIT_TRACKS;
  return list[Math.floor(Math.random() * list.length)];
}

function playNextWaitTrack(failed) {
  if (musicMode !== 'wait') return;
  const track = pickWaitTrack();
  musicLastTrack = track;
  if (failed) { musicFailCount = (musicFailCount || 0) + 1; if (musicFailCount > MUSIC_WAIT_TRACKS.length * 2) return; }
  launchMusic(track, false, playNextWaitTrack);
}
let musicFailCount = 0;

function startWaitMusic() {
  if (musicMode === 'wait' || !waitMusicWanted) return;
  stopMusic(500);
  musicMode = 'wait';
  musicFailCount = 0;
  playNextWaitTrack(false);
}

function stopWaitMusic() { if (musicMode === 'wait') stopMusic(); }

function setWaitMusicQuiet(on) {
  musicQuiet = on;
  setMusicVolume(700);
}

function setWaitMusicPaused(paused) {
  if (musicMode !== 'wait') return;
  musicPaused = paused;
  if (!musicAudio) return;
  if (paused) musicAudio.pause();
  else musicAudio.play().then(() => setMusicVolume(800)).catch(() => bindMusicRetry());
}

function presentCharacters() {
  if (startBlocked()) return;
  stopLobbyMusic();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  window.speechSynthesis.cancel();
  playScene(YT_ID_PRESENTATION, false);
}

function playNightPhase() {
  if (startBlocked()) return;
  nightCalled = new Set();
  setNextCall(null);
  stopLobbyMusic();
  nightDeaths = 0;
  currentTurnRole = null;
  closeVillageVote(true);
  playScene(YT_ID_NUIT);
  playAudioFile("Appel nuit V2.mp3");
}

// Joueurs (en vie) déjà désignés pour une annonce, pas encore annoncés : 'wolves' ou 'poison'
function pendingNames(kind) {
  return [...selection[kind]].filter((n) => { const p = findPlayer(n); return p && p.alive; });
}

let dayPause = false;   // pause de jour après une élimination par le village : musique d'attente (jusqu'à la nuit)
let nightDeaths = 0;   // morts de la nuit (loups, poison, Chasseur, chagrin) : choisit l'audio du lever du jour
let dayQueue = null;   // annonces restantes avant le lever du jour (null = aucune annonce en cours)

function startDayScene() {
  if (successionPending && gateSuccession(startDayScene)) return;
  dayQueue = null;
  hunterState = null;
  hunterThenDay = false;
  // le jour se lève : plus de vidéo YouTube, écran « le village débat » + musique Feast Circle 1 à 30 %
  dayPause = false;
  waitMusicWanted = false;
  stopWaitMusic();
  if (!sendToProjector({ action: 'dayVote', show: true })) {
    alert("Veuillez d'abord cliquer sur 'Ouvrir l'Écran Secondaire' !");
  } else {
    overlayMode = null;
    currentOverlayFile = null;
  }
  startDayMusic();
  openVillageVote();
  playAudioFile(["0 mort.mp3", "1 mort.mp3", "2 morts.mp3", "3 morts.mp3"][Math.min(nightDeaths, 3)]);
}

// Enchaîne les annonces de mort une par une ; la scène de jour démarre quand la dernière est terminée
function nextDayStep() {
  while (dayQueue && dayQueue.length) {
    const kind = dayQueue.shift();
    if (pendingNames(kind).length && announceKillEvent(kind, { auto: true })) return;   // on attend « eventEnded »
  }
  // la passation du Maire (s'il est mort) passe avant le Chasseur et le débat
  if (successionPending && gateSuccession(nextDayStep)) return;
  // plus d'annonce : si le Chasseur est mort, il tire juste avant le lever du jour
  if (hunterWaiting() && projectorOpen() && startHunterSequence(true)) return;
  startDayScene();
}

// « Le jour se lève » : s'il y a eu des morts par les loups, puis un empoisonnement par la Sorcière,
// leurs annonces (vidéo + noms) sont lues AVANT le lever du jour.
function playDayPhase() {
  if (startBlocked()) return;
  setNextCall(null);
  stopLobbyMusic();
  currentTurnRole = null;
  if (dayQueue) { startDayScene(); return; }              // 2e clic : on n'attend plus les annonces
  if (projectorOpen()) {
    const kinds = ['wolves', 'poison'].filter((k) => pendingNames(k).length);
    if (kinds.length || hunterWaiting()) {
      dayQueue = kinds;
      showToast("☀️ Annonces de la nuit en cours : le jour se lèvera juste après (recliquez pour passer directement au jour).", 'info');
      nextDayStep();
      return;
    }
  }
  startDayScene();
}

function playCommand(cmd) {
  if (cmd === 'fermer_yeux') {
    playAudioFile("Fermer les yeux.mp3");
  } else if (cmd === 'voter_maire') {
    // Vidéo du Maire en plein écran (sans recadrage), sans diffuser l'audio Maire.mp3
    if (startBlocked()) return;
    if (mayorCalled) { showToast('👑 Le Maire a déjà été appelé : le bouton est bloqué.', 'info'); return; }
    playRoleVideo("Maire.mp4", 'full', false);   // lue une seule fois, sans boucle
    stopLobbyMusic();
    mayorCalled = true;
    setNextCall(activeCallRoles.has('Voleur') && !calledOnce.has('voleur') ? 'voleur' : 'nuit');
    waitMusicWanted = true;
    openMayorVote(true);                              // les joueurs votent depuis leur téléphone
    if (!gameStarted) {                           // premier appel du Maire : la partie commence
      gameStarted = true;
      closeAllSeenModal();
      players.forEach((p) => sendTo(p, { type: 'gameStarted', started: true }));
    }
  } else if (cmd === 'voter') {
    playAudioFile("Voter.mp3");
    if (!villageVote.open) openVillageVote();
  }
}

function playRenardResponse(isPositive) {
  if (!isCenteredVideo("Renard.mp4")) playRoleVideo("Renard.mp4");

  // la réponse s'affiche sur le téléphone du Renard ; quand l'audio de la réponse est fini, son tour est terminé
  // (sa fenêtre se referme toute seule) puis « Fermez les yeux » est lu
  deliverFoxAnswer(isPositive);
  if (!isPositive) {
    foxPowerLost = true;   // trois innocents d'un coup : le Renard perd son pouvoir pour le reste de la partie
    updateCallButtons();
    showToast('🦊 Réponse « Non » : le Renard perd définitivement son pouvoir (bouton grisé).', 'info');
  }
  playAudioFile(isPositive ? "Appel Renard oui.mp3" : "Appel Renard non.mp3", { then: CLOSE_EYES_AUDIO, done: finishFoxTurns });
}

function playDeaths(count) {
  const files = ["0 mort.mp3", "1 mort.mp3", "2 morts.mp3", "3 morts.mp3"];
  if (files[count]) playAudioFile(files[count]);
}

// --- AUDIO ---
const FALLBACK_TEXTS = {
  "Le hurlement du loup 1.mp3": "Awouuuu !",
  "Le hurlement du loup 2.mp3": "Awouuuu !",
  "Le hurlement du loup 3.mp3": "Awouuuu !",
  "Effet sorciere.mp3": "Hi hi hi hi hi !",
  "Fermer les yeux.mp3": "Tout le monde ferme les yeux !",
  "Maire.mp3": "Le village va maintenant élire son maire !",
  "Voter.mp3": "Le village va maintenant délibérer et voter !",
  "Appel Renard oui.mp3": "Oui, il y a au moins un Loup-Garou parmi ces trois personnes.",
  "Appel Renard non.mp3": "Non, il n'y a aucun Loup-Garou parmi ces trois personnes.",
  "Sorciere 2 potions.mp3": "Sorcière, vous possédez encore vos deux potions : la potion de vie et la potion de mort.",
  "Sorciere potion de vie.mp3": "Sorcière, il ne vous reste plus que votre potion de vie.",
  "Sorciere potion de mort.mp3": "Sorcière, il ne vous reste plus que votre potion de mort.",
  "0 mort.mp3": "Bonne nouvelle ! Aucun mort n'est à déplorer ce matin !",
  "1 mort.mp3": "Le village déplore un mort ce matin.",
  "2 morts.mp3": "Cette nuit a été tragique, nous avons deux morts.",
  "3 morts.mp3": "Carnage au village, trois victimes sont à déplorer ce matin.",
  "Sorciere.mp3": "Sorcière, réveille-toi.",
  "Appel voleur V3.mp3": "Voleur, réveille-toi. Tu peux voler l'un des deux rôles qui te sont proposés.",
  "Appel Cupidon V2.mp3": "Cupidon, réveille-toi et désigne deux amoureux.",
  "Appel voyante V2.mp3": "Voyante, réveille-toi et désigne un joueur dont tu veux connaître le rôle.",
  "Appel renard V2.mp3": "Renard, réveille-toi et désigne un groupe de trois joueurs.",
  "Appel Loups-Garous V2.mp3": "Loups-Garous, réveillez-vous et désignez votre victime.",
  "Appel nuit V2.mp3": "La nuit tombe sur le village.",
  "Appel jour V2.mp3": "Le jour se lève sur le village."
};

function onAudioFinished() {
  const doneFn = audioDone;
  audioDone = null;
  if (doneFn) doneFn();
  if (!afterAudio) duckMusic(false);
  setProjectorVideoVolume(1.0, 800);
  if (overlayMode === 'corner') stopRoleVideo();
  const next = afterAudio;
  afterAudio = null;
  if (next) playAudioFile(next);          // enchaînement (ex. « Fermez les yeux » après la voix du Renard)
}

// Fin d'un tour de nuit (Voleur, Cupidon, Voyante, Loups, Sorcière) : « Fermez les yeux » est lu
// automatiquement, après la voix en cours s'il y en a une.
const CALL_ORDER = [
  { key: 'cupidon', role: 'Cupidon', label: 'Cupidon' },
  { key: 'voyante', role: 'Voyante', label: 'La Voyante' },
  { key: 'renard', role: 'Renard', label: 'Le Renard' },
  { key: 'loups', role: 'Loup-Garou', label: 'Les Loups-Garous' },
  { key: 'sorciere', role: 'Sorcière', label: 'La Sorcière' }
];

function setNextCall(key) {
  nextCallKey = key;
  const b = document.getElementById('next-call-banner');
  if (b && !key) b.style.display = 'none';
  updateCallButtons();
}

// Prochain rôle à appeler cette nuit (null = la nuit est finie)
function nextRoleToCall() {
  return CALL_ORDER.find((c) => {
    if (nightCalled.has(c.key) || calledOnce.has(c.key)) return false;
    if (!activeCallRoles.has(c.role)) return false;
    if (!players.some((p) => p.alive && p.role === c.role)) return false;
    if (c.key === 'renard' && foxPowerLost) return false;
    if (c.key === 'sorciere' && witchState.lifeUsed && witchState.deathUsed) return false;
    return true;
  }) || null;
}

// Fin d'un tour : message pour le MJ qui indique le prochain rôle à appeler
function announceNextCall(doneRole) {
  const next = nextRoleToCall();
  const b = document.getElementById('next-call-banner');
  setNextCall(next ? next.key : 'jour');
  if (!b) return;
  const done = doneRole ? `✅ Tour terminé (${escapeHtml(doneRole)}). ` : '✅ Tour terminé. ';
  b.innerHTML = next
    ? `${done}Passez au prochain rôle : <strong>${escapeHtml(next.label)}</strong>`
    : `${done}Plus aucun rôle à appeler : <strong>Le jour se lève</strong>`;
  b.style.display = '';
  b.onclick = () => { b.style.display = 'none'; };
}

function scheduleCloseEyes(delay = END_TURN_DELAY) {
  const doneRole = currentTurnRole;
  if (doneRole) announceNextCall(doneRole);
  setTimeout(() => {
    const speaking = window.speechSynthesis && window.speechSynthesis.speaking;
    const busy = currentAudio && !currentAudio.paused && !currentAudio.ended;
    if (busy || speaking) afterAudio = CLOSE_EYES_AUDIO;
    else playAudioFile(CLOSE_EYES_AUDIO);
  }, delay);
}

function audioCandidates(filename) {
  const ascii = filename.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return [...new Set([filename, ascii, ascii.toLowerCase(), filename.toLowerCase()])];
}

let toastTimer = null;
function showToast(msg, kind = 'error') {
  let el = document.getElementById('mj-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'mj-toast';
    document.body.appendChild(el);
  }
  el.className = 'toast' + (kind === 'info' ? ' info' : '');
  el.textContent = msg;
  el.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.style.display = 'none'; }, kind === 'info' ? 12000 : 7000);
}

function diagnoseAudio(url, filename) {
  const base = `Audio « ${filename} » : `;
  fetch(url, { method: 'HEAD' })
    .then((r) => {
      const type = r.headers.get('content-type') || 'inconnu';
      if (r.status === 404 || r.status === 400) {
        showToast(base + `fichier introuvable (HTTP ${r.status}). Vérifiez le nom exact dans mj/audio et que le bucket est public.`);
      } else if (r.ok) {
        showToast(base + `le fichier existe mais n'est pas lisible (type « ${type} »). Ré-exportez-le en vrai MP3 et ré-uploadez-le.`);
      } else {
        showToast(base + `erreur HTTP ${r.status}.`);
      }
      console.warn(base, r.status, type, url);
    })
    .catch(() => showToast(base + "impossible de joindre Supabase (réseau ou CORS)."));
}

let audioDone = null;
function playAudioFile(filename, opts = {}) {
  afterAudio = opts.then || null;
  audioDone = opts.done || null;
  window.speechSynthesis.cancel();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  setProjectorVideoVolume(0.25, 400);
  duckMusic(true);

  const candidates = audioCandidates(filename);

  const tryPlay = (i) => {
    const url = mediaUrl('audio', candidates[i]);
    const audio = new Audio(url);
    currentAudio = audio;
    fadeInAudio(audio, FADE_IN_MS, LOUD_AUDIO[filename] || MAX_VOLUME);   // niveau plafonné + fondu d'entrée

    audio.addEventListener('ended', () => {
      if (currentAudio === audio) onAudioFinished();
    });

    audio.addEventListener('error', () => {
      if (currentAudio !== audio) return;
      console.warn("Audio introuvable :", url);
      if (i + 1 < candidates.length) {
        tryPlay(i + 1);
      } else {
        diagnoseAudio(mediaUrl('audio', candidates[0]), filename);
        fallbackSpeech(filename);
      }
    });

    audio.play().catch((err) => {
      if (currentAudio !== audio) return;
      if (err.name === 'NotAllowedError') {
        showToast("Lecture bloquée par le navigateur : cliquez sur la page puis réessayez.");
        fallbackSpeech(filename);
      }
    });
  };

  tryPlay(0);
}

function fallbackSpeech(filename) {
  const text = FALLBACK_TEXTS[filename];
  if (!text) { onAudioFinished(); return; }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.rate = 0.85;
  utterance.onend = onAudioFinished;
  window.speechSynthesis.speak(utterance);
}

function stopAllMedia() {
  dayQueue = null;
  afterAudio = null;
  hunterState = null;
  hunterThenDay = false;
  sendToProjector({ action: 'stop' });
  overlayMode = null;
  currentOverlayFile = null;
  if (currentAudio) {
    currentAudio.onended = null;
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  window.speechSynthesis.cancel();
  setProjectorVideoVolume(1.0, 300);
  musicDuck = false;
  stopMusic();
}

function togglePauseAllMedia() {
  sendToProjector({ action: 'togglePause' });
  if (currentAudio && !currentAudio.ended) {
    if (currentAudio.paused) currentAudio.play().catch((err) => console.log(err));
    else currentAudio.pause();
  }
}

// --- APPELS RÔLES & EFFETS ---
// Audio de l'appel de la Sorcière : il annonce les potions qu'il lui reste
//   2 potions -> « vous possédez encore vos deux potions » ; plus que la vie -> « potion de vie » ;
//   plus que la mort -> « potion de mort » ; aucune potion -> appel simple
function witchCallAudio() {
  const life = !witchState.lifeUsed;
  const death = !witchState.deathUsed;
  if (life && death) return "Sorciere 2 potions.mp3";
  if (life) return "Sorciere potion de vie.mp3";
  if (death) return "Sorciere potion de mort.mp3";
  return "Sorciere.mp3";
}

function playRole(role) {
  if (startBlocked()) return;
  const roleFiles = {
    voleur: { audio: "Appel voleur V3.mp3", video: "Voleur.mp4", mode: 'full' },
    cupidon: { audio: "Appel Cupidon V2.mp3", video: "Cupidon.mp4" },
    voyante: { audio: "Appel voyante V2.mp3", video: "La voyante.mp4" },
    renard: { audio: "Appel renard V2.mp3", video: "Renard.mp4" },
    loups: { audio: "Appel Loups-Garous V2.mp3", video: "Loup-Garou.mp4" },
    sorciere: { audio: "Sorciere.mp3", video: "Sorciere.mp4" }
  };

  const item = roleFiles[role];
  if (!item) return;
  if (calledOnce.has(role)) return;
  if (role === 'renard' && foxPowerLost) return;   // le Renard n'a plus de pouvoir
  if (role === 'sorciere' && witchState.lifeUsed && witchState.deathUsed) return;   // plus de potion : on passe son tour
  currentTurnRole = TURN_ROLE_BY_CALL[role] || null;
  nightCalled.add(role);
  setNextCall(null);

  playAudioFile(role === 'sorciere' ? witchCallAudio() : item.audio);
  if (item.video) playRoleVideo(item.video, item.mode || 'center');

  if (role === 'voleur' || role === 'cupidon') {
    calledOnce.add(role);
    updateCallButtons();
  }
  if (role === 'voleur') startThiefTurn();
  if (role === 'cupidon') startCupidTurn();
  if (role === 'loups') startWolfTurn();
  if (role === 'sorciere') startWitchTurn();
  if (role === 'voyante') startSeerTurn();
  if (role === 'renard') startFoxTurn();
  renderMJDashboard();
}

// --- VOL DE RÔLE ---
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildThiefOffers(thief) {
  const byRole = new Map();
  players
    .filter((p) => p !== thief && p.role && p.role !== 'Voleur')
    .forEach((p) => {
      if (!byRole.has(p.role)) byRole.set(p.role, []);
      byRole.get(p.role).push(p);
    });
  return shuffleArray([...byRole.keys()]).slice(0, 2).map((role) => {
    const holders = byRole.get(role);
    return { role, holder: holders[Math.floor(Math.random() * holders.length)].name };
  });
}

function sendThiefTurn(thief) {
  const offers = thiefOffers.get(thief.name);
  if (offers && thief.conn && thief.conn.open) {
    thief.conn.send({ type: 'thiefTurn', options: offers.map((o) => o.role) });
  }
}

function startThiefTurn() {
  const thieves = players.filter((p) => p.role === 'Voleur');
  if (thieves.length === 0) {
    showToast("Aucun joueur n'a le rôle de Voleur.", 'info');
    return;
  }
  thieves.forEach((t) => {
    const offers = buildThiefOffers(t);
    if (offers.length === 0) {
      showToast(`Aucun rôle à voler pour ${t.name}.`, 'info');
      return;
    }
    thiefOffers.set(t.name, offers);
    if (t.connected) sendThiefTurn(t);
    else showToast(`Le Voleur (${t.name}) est déconnecté : le choix lui sera proposé à sa reconnexion.`, 'info');
  });
}

function handleThiefSteal(conn, data) {
  const thief = players.find((p) => p.conn === conn);
  if (!thief || thief.role !== 'Voleur' || !thiefOffers.has(thief.name)) return;
  const offers = thiefOffers.get(thief.name);

  if (data.skip) { sendThiefTurn(thief); return; }   // le Voleur est obligé de voler une carte

  const offer = offers[Number(data.choice)];
  const holder = offer && players.find((p) => p !== thief && p.name === offer.holder);
  if (!offer || !holder || holder.role !== offer.role) {
    const fresh = buildThiefOffers(thief);
    if (fresh.length) { thiefOffers.set(thief.name, fresh); sendThiefTurn(thief); }
    else { thiefOffers.delete(thief.name); conn.send({ type: 'thiefDone' }); }
    return;
  }

  thiefOffers.delete(thief.name);
  thief.role = offer.role;
  holder.role = 'Villageois';
  updateCallButtons();

  if (thief.conn && thief.conn.open) thief.conn.send({ type: 'assignRole', role: thief.role });
  if (holder.conn && holder.conn.open) holder.conn.send({ type: 'assignRole', role: holder.role });
  conn.send({ type: 'thiefDone' });

  renderMJDashboard();
  showToast(`🕵️ ${thief.name} a volé « ${offer.role} » à ${holder.name}, qui devient Villageois.`, 'info');
  setTimeout(startRoleReview, 1500);
}

const HOWL_FILES = ["Le hurlement du loup 1.mp3", "Le hurlement du loup 2.mp3", "Le hurlement du loup 3.mp3"];
let lastHowl = null;

function playRandomHowl() {
  const choices = HOWL_FILES.filter((f) => f !== lastHowl);
  const pick = choices[Math.floor(Math.random() * choices.length)];
  lastHowl = pick;
  playAudioFile(pick);
}

function playEffect(effect) {
  if (effect === 'hurlement') {
    playRandomHowl();
  } else if (effect === 'sorciere') {
    playAudioFile("Effet sorciere.mp3");
  }
}

// =====================================================================
//  PARTIE AUTOMATISÉE : Cupidon, loups, sorcière, vote, annonces vidéo
// =====================================================================
const UNIQUE_ROLES = ['Voyante', 'Sorcière', 'Chasseur', 'Cupidon', 'Voleur', 'Renard', 'Petite Fille'];

let cupidWaiting = new Set();                         // Cupidon qui doivent encore choisir
let witchState = { lifeUsed: false, deathUsed: false };
let witchWaiting = new Set();
let night = newNight();
let wolvesOpen = false;
let villageVote = { open: false, votes: new Map() };
let autoVoteResolve = true;   // élimination automatique quand tous les joueurs en vie ont voté
let selection = { wolves: new Set(), poison: new Set(), vote: new Set(), mayor: new Set(), hunter: new Set() };

function newNight() {
  return { wolfVotes: new Map(), wolfFinal: new Set(), wolfVictim: null, saved: false, poisoned: null };
}

function resetGameAutomation() {
  cupidWaiting = new Set();
  witchState = { lifeUsed: false, deathUsed: false };
  witchWaiting = new Set();
  night = newNight();
  wolvesOpen = false;
  villageVote = { open: false, votes: new Map() };
  selection = { wolves: new Set(), poison: new Set(), vote: new Set(), mayor: new Set(), hunter: new Set() };
  hunterPending = null;
  hunterChoice = null;
  hunterState = null;
  hunterThenDay = false;
  hunterDone = false;
  gameStarted = false;
  mayor = null;
  mayorCalled = false;
  nightCalled = new Set();
  nextCallKey = null;
  reviewMode = false;
  foxPowerLost = false;
  if (rps) { clearTimeout(rps.timer); rps = null; }
  waitMusicWanted = false;
  successionPending = null;
  afterSuccession = null;
  mayorVote = newMayorVote(false);
  dayQueue = null;
  seerWaiting = new Set();
  seerResults = new Map();
  seerAcked = new Set();
  foxWaiting = new Set();
  foxChoices = new Map();
  foxAnswered = new Map();
  foxAcked = new Set();
  foxQueuedAnswer = null;
  seerLog = null;
  currentTurnRole = null;
  gameOver = false;
  victoryPending = false;
}

// ------------------------------ VICTOIRE DU VILLAGE ------------------------------
// La partie est gagnée quand tous les Loups-Garous sont morts.
let gameOver = false;
let victoryPending = false;

// Les Loups-Garous gagnent quand il ne reste plus (ou plus qu'un seul) villageois (tout rôle autre que Loup-Garou) face à eux
function wolvesWin() {
  const wolves = players.filter((p) => p.role === 'Loup-Garou' && p.alive).length;
  const others = players.filter((p) => p.role !== 'Loup-Garou' && p.alive).length;
  return wolves > 0 && others <= 1;
}

function currentWinner() {
  if (!distributed) return null;
  if (allWolvesDead()) return 'village';
  if (wolvesWin()) return 'wolves';
  return null;
}

function allWolvesDead() {
  const wolves = players.filter((p) => p.role === 'Loup-Garou');
  return wolves.length > 0 && wolves.every((p) => !p.alive);
}

// mode 'event' : la victoire est annoncée à la fin de la vidéo d'annonce ; mode 'delay' : après l'affichage des noms
function checkVictory(mode) {
  if (gameOver || victoryPending || !distributed || !currentWinner()) return;
  victoryPending = true;
  if (mode === 'delay') setTimeout(() => { if (victoryPending) showVictory(); }, 8500);
}

function showVictory() {
  victoryPending = false;
  const winner = currentWinner();
  if (gameOver || !winner) return;
  gameOver = true;
  closeVillageVote(true);
  closeMayorVote(true);
  stopMusic();
  const shown = sendToProjector({ action: 'victory', winner });
  if (shown) playApplause();
  players.forEach((p) => sendTo(p, { type: 'gameOver', winner }));
  showToast((winner === 'wolves' ? '🐺 Les Loups-Garous ont éliminé le camp des villageois : victoire des Loups-Garous !' : '🏆 Tous les Loups-Garous sont morts : victoire du village !') + (shown ? '' : ' (écran secondaire fermé)'), 'info');
  renderMJDashboard();
}

// Un Loup-Garou est ressuscité après la victoire : la partie continue
function cancelVictory() {
  gameOver = false;
  sendToProjector({ action: 'victoryCancel' });
  players.forEach((p) => sendTo(p, { type: 'gameOver', winner: null }));
  showToast("La partie reprend : la victoire n'est plus valable.", 'info');
  renderMJDashboard();
}

// --- outils ---
function findPlayer(name) { return players.find((p) => p.name === name) || null; }
function alivePlayers() { return players.filter((p) => p.alive); }
function senderOf(conn) { return players.find((p) => p.conn === conn) || null; }
function sendTo(p, msg) {
  if (p && p.conn && p.conn.open) { p.conn.send(msg); return true; }
  return false;
}
// décompte des votes : on ignore les votants et les cibles déjà morts
function aliveTally(votesMap) {
  const counts = {};
  votesMap.forEach((target, voter) => {
    const v = findPlayer(voter), t = findPlayer(target);
    if (v && v.alive && t && t.alive) counts[target] = (counts[target] || 0) + 1;
  });
  return counts;
}
// Vote du village : la voix du Maire (s'il est en vie) compte double
function villageTally(votesMap) {
  const counts = {};
  votesMap.forEach((target, voter) => {
    const v = findPlayer(voter), t = findPlayer(target);
    if (v && v.alive && t && t.alive) counts[target] = (counts[target] || 0) + (voter === mayor ? 2 : 1);
  });
  return counts;
}
function topOf(counts) {
  let max = 0;
  Object.values(counts).forEach((n) => { if (n > max) max = n; });
  return { max, names: max ? Object.keys(counts).filter((n) => counts[n] === max) : [] };
}

function setAlive(p, alive) {
  p.alive = alive;
  sendTo(p, { type: 'status', alive });
  updateCallButtons();
  if (alive && hunterPending === p.name) cancelHunter();
  if (alive && !currentWinner()) {
    victoryPending = false;
    if (gameOver) cancelVictory();
  }
}

// Tue les joueurs donnés ; l'amoureux d'un mort meurt automatiquement de chagrin
function killPlayers(names) {
  const deaths = [];
  names.forEach((n) => {
    const p = findPlayer(n);
    if (!p || !p.alive) return;
    setAlive(p, false);
    p.diedOfLove = false;
    deaths.push({ name: p.name, role: p.role });
    if (p.inLove) {
      const partner = players.find((x) => x !== p && x.inLove);
      if (partner && partner.alive) {
        setAlive(partner, false);
        partner.diedOfLove = true;
        deaths.push({ name: partner.name, role: partner.role, love: true });
      }
    }
  });
  const mayorP = mayor && deaths.some((d) => d.name === mayor) ? findPlayer(mayor) : null;
  if (mayorP) startMayorSuccession(mayorP);
  const hunterP = deaths.map((d) => findPlayer(d.name)).find((p) => p && p.role === 'Chasseur');
  if (hunterP) startHunterTurn(hunterP);
  return deaths;
}

// Renvoie à un joueur qui (re)vient l'état courant de la partie
function resyncPlayer(p) {
  if (!distributed) return;
  sendTo(p, { type: 'status', alive: p.alive });
  if (p.inLove) {
    const partner = players.find((x) => x !== p && x.inLove);
    sendTo(p, { type: 'lover', partner: partner ? partner.name : null });
  }
  if (successionPending === p.name) sendSuccessionTurn(p);
  if (rps && rps.names.includes(p.name) && !rps.picks.has(p.name)) sendRpsTurn(p);
  if (hunterPending === p.name) { if (hunterChoice) sendTo(p, { type: 'hunterDone' }); else sendHunterTurn(p); }
  if (gameStarted) sendTo(p, { type: 'gameStarted', started: true });
  if (!p.alive) return;
  if (thiefOffers.has(p.name)) sendThiefTurn(p);
  if (cupidWaiting.has(p.name)) sendCupidTurn(p);
  if (witchWaiting.has(p.name)) sendWitchTurn(p);
  if (wolvesOpen && p.role === 'Loup-Garou' && !night.wolfFinal.has(p.name)) sendWolfTurn(p);
  if (foxWaiting.has(p.name) || foxChoices.has(p.name)) sendFoxTurn(p);
  if (seerResults.has(p.name)) { const r = seerResults.get(p.name); sendTo(p, { type: 'seerResult', name: r.name, role: r.role }); }
  else if (seerWaiting.has(p.name)) sendSeerTurn(p);
  if (mayorVote.open) sendMayorTurn(p);
  else if (villageVote.open) sendVoteTurn(p);
}

// ------------------------------- CUPIDON -------------------------------
function sendCupidTurn(c) {
  sendTo(c, { type: 'cupidTurn', names: alivePlayers().map((p) => p.name) });
}

function startCupidTurn() {
  const cupids = alivePlayers().filter((p) => p.role === 'Cupidon');
  if (!cupids.length) { showToast("Aucun Cupidon en vie dans la partie.", 'info'); return; }
  cupids.forEach((c) => {
    cupidWaiting.add(c.name);
    if (c.connected) sendCupidTurn(c);
    else showToast(`Cupidon (${c.name}) est déconnecté : le choix lui sera proposé à sa reconnexion.`, 'info');
  });
}

function handleCupidChoice(conn, data) {
  const cupid = senderOf(conn);
  if (!cupid || cupid.role !== 'Cupidon' || !cupidWaiting.has(cupid.name)) return;
  const names = Array.isArray(data.names) ? [...new Set(data.names.map(String))] : [];
  const pair = names.map(findPlayer);
  if (names.length !== 2 || pair.some((p) => !p || !p.alive)) { sendCupidTurn(cupid); return; }

  players.forEach((p) => { p.inLove = false; p.diedOfLove = false; });
  pair.forEach((p) => { p.inLove = true; });
  cupidWaiting.delete(cupid.name);
  sendTo(cupid, { type: 'cupidDone' });
  notifyLovers();
  renderMJDashboard();
  showToast(`💘 Cupidon (${cupid.name}) a uni ${pair[0].name} et ${pair[1].name}.`, 'info');
  scheduleCloseEyes();
}

// ---------------------------- LOUPS-GAROUS ----------------------------
function wolvesAlive() { return alivePlayers().filter((p) => p.role === 'Loup-Garou'); }

function sendWolfTurn(w) {
  sendTo(w, {
    type: 'wolfTurn',
    targets: alivePlayers().filter((p) => p.role !== 'Loup-Garou').map((p) => p.name),   // les loups n'apparaissent pas
    votes: aliveTally(night.wolfVotes),
    myVote: night.wolfVotes.get(w.name) || null,
    final: night.wolfFinal.has(w.name)
  });
}

function startWolfTurn() {
  night = newNight();
  selection.wolves = new Set();
  const wolves = wolvesAlive();
  if (!wolves.length) {
    wolvesOpen = false;
    showToast("Aucun Loup-Garou en vie.", 'info');
    renderMJDashboard();
    return;
  }
  wolvesOpen = true;
  wolves.forEach(sendWolfTurn);
  renderMJDashboard();
}

function broadcastWolfVotes() {
  const votes = aliveTally(night.wolfVotes);
  wolvesAlive().forEach((w) => sendTo(w, { type: 'wolfVotes', votes }));
}

function handleWolfVote(conn, data) {
  const w = senderOf(conn);
  if (!w || !w.alive || w.role !== 'Loup-Garou' || !wolvesOpen || night.wolfFinal.has(w.name)) return;
  const t = findPlayer(String(data.target || ''));
  if (!t || !t.alive || t === w || t.role === 'Loup-Garou') return;   // un loup ne peut pas viser un loup
  night.wolfVotes.set(w.name, t.name);
  broadcastWolfVotes();
  renderMJDashboard();
}

function handleWolfFinal(conn) {
  const w = senderOf(conn);
  if (!w || !w.alive || !wolvesOpen || !night.wolfVotes.has(w.name)) return;
  night.wolfFinal.add(w.name);
  sendTo(w, { type: 'wolfLocked' });
  if (wolvesAlive().every((x) => night.wolfFinal.has(x.name))) closeWolfVote();
  else renderMJDashboard();
}

function closeWolfVote() {
  if (!wolvesOpen) return;
  wolvesOpen = false;
  wolvesAlive().forEach((w) => sendTo(w, { type: 'wolfDone' }));
  const { names } = topOf(aliveTally(night.wolfVotes));
  if (names.length === 1) {
    night.wolfVictim = names[0];
    selection.wolves = new Set([names[0]]);
    showToast(`🐺 Les loups ont désigné ${names[0]}.`, 'info');
  } else if (names.length > 1) {
    night.wolfVictim = null;
    showToast(`🐺 Égalité entre ${names.join(', ')} : sélectionnez la victime à la main.`, 'info');
  } else {
    showToast("🐺 Aucun vote des loups cette nuit.", 'info');
  }
  renderMJDashboard();
  scheduleCloseEyes();
}

// ------------------------------ SORCIÈRE ------------------------------
function sendWitchTurn(w, error) {
  const canSave = !witchState.lifeUsed && !!night.wolfVictim && !night.saved;
  sendTo(w, {
    type: 'witchTurn',
    victim: canSave ? night.wolfVictim : null,
    noVictim: !witchState.lifeUsed && !night.wolfVictim,
    canSave,
    canPoison: !witchState.deathUsed,
    // la victime des loups n'apparaît pas dans la liste du poison (elle ne peut être que sauvée)
    targets: alivePlayers().filter((p) => p.name !== night.wolfVictim).map((p) => p.name),
    error: error || null
  });
}

function startWitchTurn() {
  const witches = alivePlayers().filter((p) => p.role === 'Sorcière');
  if (!witches.length) { showToast("Aucune Sorcière en vie dans la partie.", 'info'); return; }
  witches.forEach((w) => {
    witchWaiting.add(w.name);
    if (w.connected) sendWitchTurn(w);
    else showToast(`La Sorcière (${w.name}) est déconnectée : le choix lui sera proposé à sa reconnexion.`, 'info');
  });
}

function handleWitchAction(conn, data) {
  const w = senderOf(conn);
  if (!w || !w.alive || w.role !== 'Sorcière' || !witchWaiting.has(w.name)) return;

  // Règle : une seule potion par tour (sauver OU empoisonner). Rien n'est consommé : on redemande son choix.
  if (data.save && data.poison) {
    sendWitchTurn(w, "Tu ne peux utiliser qu'une seule potion par tour : sauve OU empoisonne.");
    showToast("🧪 La Sorcière a tenté d'utiliser ses deux potions en même temps : refusé, son choix lui est redemandé.", 'info');
    return;
  }

  witchWaiting.delete(w.name);
  const done = [];

  if (data.save && !witchState.lifeUsed && night.wolfVictim && !night.saved) {
    night.saved = true;
    witchState.lifeUsed = true;
    selection.wolves.delete(night.wolfVictim);
    done.push(`a sauvé ${night.wolfVictim}`);
  }
  const target = data.poison ? findPlayer(String(data.poison)) : null;
  if (target && target.alive && !witchState.deathUsed) {
    night.poisoned = target.name;
    witchState.deathUsed = true;
    selection.poison.add(target.name);
    done.push(`a empoisonné ${target.name}`);
  }
  sendTo(w, { type: 'witchDone' });
  showToast(done.length ? `🧪 La Sorcière ${done.join(' et ')}.` : "🧪 La Sorcière ne fait rien cette nuit.", 'info');
  updateCallButtons();
  renderMJDashboard();
  scheduleCloseEyes();
}

// -------------------------------- CHASSEUR --------------------------------
// À sa mort, le Chasseur choisit sa dernière cible sur son téléphone (noms uniquement). Séquence à l'écran secondaire :
//   1) vidéo du Chasseur (une seule lecture, son de la vidéo uniquement, aucun fichier audio) ;
//   2) une fois sa cible choisie : vidéo « Mort tire » avec le nom du joueur visé.
// La nuit, la séquence passe après les annonces des loups et de l'empoisonnement, juste avant le lever du jour.
// Les scènes (Phases du Jeu) sont arrêtées pendant ces vidéos.
let hunterPending = null;     // nom du Chasseur mort qui doit encore tirer
let hunterChoice = null;      // nom du joueur choisi
let hunterState = null;       // null | 'intro' | 'wait' | 'shot'
let hunterThenDay = false;    // vrai : le jour se lève après le tir
let hunterDone = false;       // le Chasseur n'a droit qu'à un tir par partie

// vrai si le Chasseur est mort et n'a pas encore tiré
function hunterWaiting() {
  const h = hunterPending ? findPlayer(hunterPending) : null;
  return !!h && !h.alive && !hunterDone;
}

function sendHunterTurn(h) {
  sendTo(h, { type: 'hunterTurn', targets: alivePlayers().map((p) => p.name) });
}

function startHunterTurn(h) {
  if (hunterDone || hunterPending) return;
  if (!alivePlayers().length) { hunterDone = true; return; }
  hunterPending = h.name;
  hunterChoice = null;
  sendHunterTurn(h);
  showToast(`🏹 Le Chasseur (${h.name}) est mort : il choisit sa cible depuis son téléphone.`, 'info');
}

function handleHunterShot(conn, data) {
  const h = senderOf(conn);
  if (!h || h.alive || hunterPending !== h.name || hunterChoice) return;
  const t = findPlayer(String(data.target || ''));
  if (!t || !t.alive) { sendHunterTurn(h); return; }
  hunterChoice = t.name;
  sendTo(h, { type: 'hunterDone' });
  showToast(`🏹 Le Chasseur (${h.name}) a choisi sa cible : ${t.name}.`, 'info');
  if (hunterState === 'wait') playHunterShot();   // la vidéo du Chasseur est déjà terminée : on enchaîne
  renderMJDashboard();
}

function silenceVoice() {
  if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
  window.speechSynthesis.cancel();
  afterAudio = null;
  overlayMode = null;
  currentOverlayFile = null;
}

// Lance la séquence ; renvoie vrai si elle démarre
function startHunterSequence(thenDay) {
  if (!hunterWaiting() || hunterState) return false;
  hunterThenDay = !!thenDay;
  hunterState = 'intro';
  if (!projectorOpen()) { hunterIntroEnded(); return true; }   // pas d'écran secondaire : on passe directement au tir
  const launch = () => {
    if (hunterState !== 'intro') return;
    silenceVoice();
    waitMusicWanted = false;
    stopWaitMusic();   // la vidéo du Chasseur est jouée sans musique
    sendToProjector({ action: 'eventVideo', url: mediaUrl('video', 'Chasseur.mp4'), deaths: [], namesAt: 'none', stopScene: true });
    showToast('🏹 Vidéo du Chasseur en cours…', 'info');
    renderMJDashboard();
  };
  // la vidéo du Chasseur attend la fin des autres annonces (ex. nouveau Maire) : rien ne s'affiche par-dessus
  const wait = mayorAnnounceUntil - Date.now();
  if (wait > 0) { showToast('🏹 La vidéo du Chasseur démarre après l\'annonce du Maire…', 'info'); setTimeout(launch, wait + 500); }
  else launch();
  renderMJDashboard();
  return true;
}

function hunterIntroEnded() {
  if (hunterChoice) { playHunterShot(); return; }
  hunterState = 'wait';
  sendToProjector({ action: 'hunterWaiting', name: hunterPending });   // carte du Chasseur sur l'écran secondaire pendant son choix
  resumePauseMusic();
  showToast("🏹 En attente du tir du Chasseur (il doit choisir sa cible sur son téléphone).", 'info');
  renderMJDashboard();
}

function playHunterShot() {
  const h = findPlayer(hunterPending);
  const t = hunterChoice ? findPlayer(hunterChoice) : null;
  if (!t || !t.alive) {                         // la cible est morte entre-temps : il en choisit une autre
    hunterChoice = null;
    hunterState = 'wait';
    if (h) sendHunterTurn(h);
    showToast("🏹 La cible du Chasseur n'est plus en vie : il doit en choisir une autre.", 'info');
    renderMJDashboard();
    return;
  }
  hunterState = 'shot';
  selection.hunter = new Set([t.name]);
  if (!projectorOpen()) {                       // sans écran secondaire : le tir est appliqué sans vidéo
    killPlayers([t.name]);
    selection.hunter = new Set();
    showToast(`🏹 Le Chasseur tue ${t.name}.`, 'info');
    checkVictory('event');
    finishHunter();
    return;
  }
  if (!announceKillEvent('hunter', { auto: true })) finishHunter();
}

function onHunterEventEnded() {
  if (hunterState === 'intro') hunterIntroEnded();
  else if (hunterState === 'shot') finishHunter();
}

function finishHunter() {
  const thenDay = hunterThenDay;
  hunterPending = null;
  hunterChoice = null;
  hunterState = null;
  hunterThenDay = false;
  hunterDone = true;
  selection.hunter = new Set();
  sendToProjector({ action: 'hunterWaiting', hide: true });
  renderMJDashboard();
  resumePauseMusic();
  if (victoryPending && currentWinner()) { dayQueue = null; showVictory(); return; }
  victoryPending = false;
  if (thenDay && dayQueue) nextDayStep();     // le jour se lève après le tir
}

// Le MJ ressuscite le Chasseur : son tir est annulé
function cancelHunter() {
  const h = hunterPending ? findPlayer(hunterPending) : null;
  const wasActive = !!hunterState;
  hunterPending = null;
  hunterChoice = null;
  hunterState = null;
  hunterThenDay = false;
  selection.hunter = new Set();
  sendToProjector({ action: 'hunterWaiting', hide: true });
  if (h) sendTo(h, { type: 'hunterDone' });
  if (wasActive && dayQueue) nextDayStep();
}

function hunterLine() {
  if (hunterDone) return 'a tiré ✅';
  if (!hunterPending) return 'en attente (il tire à sa mort)';
  const state = hunterState === 'intro' ? ' — vidéo du Chasseur en cours'
    : hunterState === 'wait' ? ' — ⏳ l\'écran attend son tir'
    : hunterState === 'shot' ? ' — vidéo du tir en cours' : '';
  const choice = hunterChoice ? `a choisi ${nameHtml(hunterChoice)}` : 'choisit sa cible…';
  const start = !hunterState ? ' <button type="button" class="auto-btn" data-act="hunterStart">Lancer la vidéo du Chasseur</button>' : '';
  return `${nameHtml(hunterPending)} (mort) ${choice}${state}${start}`;
}

// -------------------------------- RENARD --------------------------------
// Il désigne UN joueur sur son téléphone (noms uniquement). Le MJ répond OUI / NON avec ses boutons ;
// la réponse s'affiche sur le téléphone du Renard, et « Fermez les yeux » est lu quand il clique sur « J'ai vu, fermer ».
let foxWaiting = new Set();      // Renards qui doivent encore désigner un joueur
let foxChoices = new Map();      // nom du Renard -> nom du joueur désigné
let foxAnswered = new Map();     // nom du Renard -> réponse donnée par le MJ (true = Loup détecté)
let foxAcked = new Set();        // Renards qui ont refermé leur écran
let foxQueuedAnswer = null;      // réponse donnée par le MJ avant que le Renard ait choisi

function sendFoxTurn(f) {
  if (foxAnswered.has(f.name)) {
    sendTo(f, { type: 'foxAnswer', target: foxChoices.get(f.name), answer: foxAnswered.get(f.name) });
    return;
  }
  sendTo(f, {
    type: 'foxTurn',
    targets: alivePlayers().filter((p) => p !== f).map((p) => p.name),
    chosen: foxChoices.get(f.name) || null
  });
}

function startFoxTurn() {
  const foxes = alivePlayers().filter((p) => p.role === 'Renard');
  foxQueuedAnswer = null;
  if (!foxes.length || !foxes.some((f) => f.connected)) {   // pas de Renard sur téléphone : le MJ répond directement
    renderMJDashboard();
    openFoxModal();
    return;
  }
  foxes.forEach((f) => {
    foxChoices.delete(f.name);
    foxAnswered.delete(f.name);
    foxAcked.delete(f.name);
    foxWaiting.add(f.name);
    if (f.connected) sendFoxTurn(f);
    else showToast(`Le Renard (${f.name}) est déconnecté : le choix lui sera proposé à sa reconnexion.`, 'info');
  });
  renderMJDashboard();
}

function handleFoxChoice(conn, data) {
  const f = senderOf(conn);
  if (!f || !f.alive || f.role !== 'Renard' || !foxWaiting.has(f.name)) return;
  const t = findPlayer(String(data.target || ''));
  if (!t || !t.alive || t === f) { sendFoxTurn(f); return; }

  foxWaiting.delete(f.name);                 // un seul joueur par tour
  foxChoices.set(f.name, t.name);
  sendTo(f, { type: 'foxAck', target: t.name });
  showToast(`🦊 Le Renard (${f.name}) a désigné ${t.name} : répondez Oui ou Non avec les boutons du Renard.`, 'info');
  if (foxQueuedAnswer !== null) { deliverFoxAnswer(foxQueuedAnswer); setTimeout(finishFoxTurns, 8000); }   // le MJ avait déjà répondu
  else openFoxModal();                                                  // sinon : la fenêtre de réponse s'ouvre
  renderMJDashboard();
}


// ---- Fenêtre « Réponse pour le Renard » (au milieu de l'écran du MJ) ----
function openFoxModal() {
  const modal = document.getElementById('fox-modal');
  if (!modal) return;
  const f = players.find((p) => p.role === 'Renard' && foxChoices.has(p.name) && !foxAnswered.has(p.name));
  const text = document.getElementById('fox-modal-text');
  const hint = document.getElementById('fox-modal-hint');
  if (f) {
    const target = foxChoices.get(f.name);
    const t = findPlayer(target);
    text.textContent = `Le Renard (${f.name}) a désigné ${target}. Y a-t-il un Loup-Garou ?`;
    hint.textContent = t && t.role === 'Loup-Garou' ? 'Réponse attendue : OUI (Loup détecté)' : 'Réponse attendue : NON (aucun loup)';
  } else {
    text.textContent = "Le Renard répond à l'oral : y a-t-il un Loup-Garou dans le groupe désigné ?";
    hint.textContent = '';
  }
  modal.style.display = 'flex';
}

function closeFoxModal() {
  const modal = document.getElementById('fox-modal');
  if (modal) modal.style.display = 'none';
}

function foxModalAnswer(isPositive) {
  closeFoxModal();
  playRenardResponse(isPositive);
}

// Envoie la réponse du MJ aux Renards qui ont désigné un joueur ; retient la réponse pour ceux qui n'ont pas encore choisi
function deliverFoxAnswer(isPositive) {
  let sent = 0;
  alivePlayers().filter((p) => p.role === 'Renard').forEach((f) => {
    if (foxChoices.has(f.name) && !foxAnswered.has(f.name)) {
      foxAnswered.set(f.name, !!isPositive);
      sendFoxTurn(f);
      sent++;
    }
  });
  if (sent) foxQueuedAnswer = null;
  else if (alivePlayers().some((p) => p.role === 'Renard' && foxWaiting.has(p.name))) foxQueuedAnswer = !!isPositive;
  renderMJDashboard();
  return sent;
}

// Le Renard a refermé la réponse : son tour est fini, « Fermez les yeux » est lu
// Fin de la réponse audio : les Renards qui ont reçu leur réponse voient leur fenêtre se refermer
function finishFoxTurns() {
  alivePlayers().filter((p) => p.role === 'Renard').forEach((f) => {
    if (foxAnswered.has(f.name) && !foxAcked.has(f.name)) {
      foxAcked.add(f.name);
      sendTo(f, { type: 'foxDone' });
    }
  });
  renderMJDashboard();
}

function handleFoxClosed(conn) {
  const f = senderOf(conn);
  if (!f || !foxAnswered.has(f.name) || foxAcked.has(f.name)) return;
  foxAcked.add(f.name);
  renderMJDashboard();
  scheduleCloseEyes(0);
}

// ------------------------------- VOYANTE -------------------------------
// Elle voit les noms des joueurs en vie (jamais leurs rôles) et en choisit UN par tour : son rôle lui est alors révélé.
let seerWaiting = new Set();     // Voyantes qui doivent encore choisir
let seerResults = new Map();     // nom de la Voyante -> { name, role } (résultat du tour en cours)
let seerLog = null;              // dernière observation, affichée dans le tableau de bord du MJ

let seerAcked = new Set();       // Voyantes qui ont refermé leur écran (« J'ai vu, fermer »)

// La Voyante a refermé son résultat : son tour est fini, « Fermez les yeux » est lu
function handleSeerClosed(conn) {
  const seer = senderOf(conn);
  if (!seer || !seerResults.has(seer.name) || seerAcked.has(seer.name)) return;
  seerAcked.add(seer.name);
  renderMJDashboard();
  scheduleCloseEyes(0);
}

function sendSeerTurn(seer) {
  sendTo(seer, { type: 'seerTurn', targets: alivePlayers().filter((p) => p !== seer).map((p) => p.name) });
}

function startSeerTurn() {
  const seers = alivePlayers().filter((p) => p.role === 'Voyante');
  if (!seers.length) { showToast("Aucune Voyante en vie dans la partie.", 'info'); return; }
  seers.forEach((s) => {
    seerResults.delete(s.name);
    seerAcked.delete(s.name);
    seerWaiting.add(s.name);
    if (s.connected) sendSeerTurn(s);
    else showToast(`La Voyante (${s.name}) est déconnectée : le choix lui sera proposé à sa reconnexion.`, 'info');
  });
  renderMJDashboard();
}

function handleSeerChoice(conn, data) {
  const seer = senderOf(conn);
  if (!seer || !seer.alive || seer.role !== 'Voyante' || !seerWaiting.has(seer.name)) return;
  const target = findPlayer(String(data.target || ''));
  if (!target || !target.alive || target === seer) { sendSeerTurn(seer); return; }

  seerWaiting.delete(seer.name);                       // un seul joueur par tour
  seerResults.set(seer.name, { name: target.name, role: target.role });
  seerLog = { seer: seer.name, target: target.name, role: target.role };
  sendTo(seer, { type: 'seerResult', name: target.name, role: target.role });
  showToast(`🔮 La Voyante (${seer.name}) a observé ${target.name} : ${target.role}.`, 'info');
  renderMJDashboard();
}

// --------------------------- ÉLECTION DU MAIRE ---------------------------
// Chaque joueur en vie vote depuis son téléphone (noms uniquement). Le plus voté devient Maire : son nom s'affiche
// avec une couronne sur l'écran secondaire.
let mayor = null;
let mayorVote = newMayorVote(false);

// Élection en 3 temps : 1) candidatures (chaque joueur dit s'il se présente), 2) discours oraux des candidats
// (affichés sur l'écran secondaire), 3) vote — uniquement parmi les candidats.
function newMayorVote(open) {
  return { open, phase: open ? 'candidacy' : '', votes: new Map(), answers: new Map(), candidates: [], speaker: null, spoke: new Set() };
}

function sendMayorTurn(p) {
  if (!mayorVote.open || !p.alive) return;
  if (mayorVote.phase === 'candidacy') {
    sendTo(p, { type: 'candidacyTurn', answer: mayorVote.answers.has(p.name) ? mayorVote.answers.get(p.name) : null });
  } else if (mayorVote.phase === 'speech') {
    sendTo(p, { type: 'candidacySpeech', candidates: mayorVote.candidates, speaker: mayorVote.speaker, me: mayorVote.candidates.includes(p.name) });
  } else {
    sendTo(p, {
      type: 'mayorTurn',
      targets: mayorVote.candidates.filter((n) => { const x = findPlayer(n); return x && x.alive; }),
      myVote: mayorVote.votes.get(p.name) || null
    });
  }
}

function openMayorVote(withVideo = false) {
  waitMusicWanted = true;
  musicQuiet = false;
  mayorVote = newMayorVote(true);
  selection.mayor = new Set();
  sendToProjector({ action: 'mayorCandidates', hide: true });
  players.forEach((p) => sendTo(p, { type: 'voteClose' }));   // le vote du village (s'il est ouvert) est masqué pendant l'élection
  alivePlayers().forEach(sendMayorTurn);
  // musique d'attente : après la vidéo du Maire (tout de suite si l'écran secondaire est fermé)
  clearTimeout(mayorMusicTimer);
  if (!projectorOpen() || !withVideo) startWaitMusic();
  else mayorMusicTimer = setTimeout(() => { if (mayorVote.open && mayorVote.phase !== 'speech') startWaitMusic(); }, 60000);
  renderMJDashboard();
}

function handleMayorCandidacy(conn, data) {
  const v = senderOf(conn);
  if (!v || !v.alive || !mayorVote.open || mayorVote.phase !== 'candidacy') return;
  mayorVote.answers.set(v.name, !!data.run);
  sendTo(v, { type: 'candidacyAck', answer: !!data.run });
  if (alivePlayers().every((p) => mayorVote.answers.has(p.name))) { closeCandidacy(); return; }
  renderMJDashboard();
}

function mayorCandidatesNow() {
  return alivePlayers().filter((p) => mayorVote.answers.get(p.name) === true).map((p) => p.name);
}

function pushCandidatesToProjector() {
  return sendToProjector({ action: 'mayorCandidates', names: mayorVote.candidates, speaker: mayorVote.phase === 'speech' ? mayorVote.speaker : null });
}

// Fin des candidatures : les candidats s'affichent sur l'écran secondaire, place aux discours
function closeCandidacy() {
  if (!mayorVote.open || mayorVote.phase !== 'candidacy') return;
  const names = mayorCandidatesNow();
  if (!names.length) {
    showToast("👑 Personne ne se présente pour l'instant : attendez des candidats ou clôturez l'élection.", 'info');
    renderMJDashboard();
    return;
  }
  mayorVote.candidates = names;
  mayorVote.phase = 'speech';
  mayorVote.speaker = null;
  mayorVote.spoke = new Set();
  const shown = pushCandidatesToProjector();
  clearTimeout(mayorMusicTimer);
  setWaitMusicQuiet(true);    // musique très discrète pendant les discours
  alivePlayers().forEach(sendMayorTurn);
  showToast(`👑 ${names.length} candidat(s) : ${names.join(', ')}. Donnez la parole à chacun, puis passez au vote.${shown ? '' : ' (écran secondaire fermé)'}`, 'info');
  renderMJDashboard();
}

function setMayorSpeaker(name) {
  if (!mayorVote.open || mayorVote.phase !== 'speech' || !mayorVote.candidates.includes(name)) return;
  mayorVote.speaker = name;
  mayorVote.spoke.add(name);
  pushCandidatesToProjector();
  alivePlayers().forEach(sendMayorTurn);
  renderMJDashboard();
}

function nextMayorSpeaker() {
  const next = mayorVote.candidates.find((n) => !mayorVote.spoke.has(n));
  if (!next) { showToast('👑 Tous les candidats ont parlé : passez au vote.', 'info'); return; }
  setMayorSpeaker(next);
}

// Fin des discours : le vote s'ouvre sur les téléphones, avec les seuls candidats
// Fin du discours en cours (plus personne ne parle)
function endMayorSpeech() {
  if (!mayorVote.open || mayorVote.phase !== 'speech') return;
  mayorVote.speaker = null;
  pushCandidatesToProjector();
  alivePlayers().forEach(sendMayorTurn);
  renderMJDashboard();
}

// Boutons de la régie pour l'élection (carte « 👑 Élection du Maire », visible uniquement pendant l'élection)
function renderMayorControls() {
  const card = document.getElementById('mayor-controls');
  if (!card) return;
  if (rps) {
    card.style.display = '';
    document.getElementById('mayor-controls-info').innerHTML = `✊✋✌️ Égalité ! Pierre, feuille, ciseaux (manche ${rps.round}${rps.purpose === 'vote' ? ', vote du village' : ''}) entre ${rps.names.map(nameHtml).join(', ')} — ${rps.picks.size}/${rps.names.length} ont joué.`;
    document.getElementById('mayor-controls-buttons').innerHTML = '<button type="button" class="btn btn-danger" onclick="cancelRps()">✖ Annuler (choisir à la main)</button>';
    return;
  }
  if (!mayorVote.open) { card.style.display = 'none'; return; }
  card.style.display = '';
  const info = document.getElementById('mayor-controls-info');
  const box = document.getElementById('mayor-controls-buttons');
  const alive = alivePlayers().length;
  const btn = (cls, label, js, extra = '') => `<button type="button" class="btn ${cls}" ${extra} onclick="${js}">${label}</button>`;
  const cancel = btn('btn-danger', '✖ Annuler l\'élection', 'closeMayorVote(false)');
  let html = '';
  if (mayorVote.phase === 'candidacy') {
    const c = mayorCandidatesNow();
    info.innerHTML = `🙋 Candidatures ouvertes — ${mayorVote.answers.size}/${alive} ont répondu. Candidats : ${c.length ? c.map(nameHtml).join(', ') : 'aucun pour l\'instant'}.`;
    html = btn('btn-day', '✅ Clore les candidatures', 'closeCandidacy()') + cancel;
  } else if (mayorVote.phase === 'speech') {
    info.innerHTML = mayorVote.speaker
      ? `🎤 <strong>${nameHtml(mayorVote.speaker)}</strong> a la parole. Quand il a fini, donnez la parole au suivant.`
      : '🙋 Les candidats attendent que vous leur donniez la parole.';
    html = mayorVote.candidates.map((n) => {
      const mark = mayorVote.speaker === n ? '🎤 ' : (mayorVote.spoke.has(n) ? '✔ ' : '');
      return btn(mayorVote.speaker === n ? 'btn-day' : 'btn-night', `${mark}Donner la parole à ${escapeHtml(n)}`, 'setMayorSpeaker(this.dataset.name)', `data-name="${escapeHtml(n)}"`);
    }).join('')
      + btn('btn-effect', '⏭ Candidat suivant', 'nextMayorSpeaker()')
      + (mayorVote.speaker ? btn('btn-effect', '🤐 Fin du discours', 'endMayorSpeech()') : '')
      + btn('btn-day', '🗳️ Passer au vote', 'startMayorBallot()') + cancel;
  } else {
    info.innerHTML = `🗳️ Vote ouvert — ${mayorVote.votes.size}/${alive} ont voté. ${countsText(aliveTally(mayorVote.votes)) || ''}`;
    html = btn('btn-vert', '🏁 Clore le vote et proclamer le Maire', 'resolveMayorVote()') + cancel;
  }
  box.innerHTML = html;
}

function startMayorBallot() {
  if (!mayorVote.open || mayorVote.phase !== 'speech') return;
  mayorVote.phase = 'vote';
  mayorVote.speaker = null;
  setWaitMusicQuiet(false);
  if (musicMode === 'wait') setWaitMusicPaused(false); else startWaitMusic();
  pushCandidatesToProjector();
  alivePlayers().forEach(sendMayorTurn);
  renderMJDashboard();
}

function handleMayorVote(conn, data) {
  const v = senderOf(conn);
  if (!v || !v.alive || !mayorVote.open || mayorVote.phase !== 'vote') return;
  const t = findPlayer(String(data.target || ''));
  if (!t || !t.alive || !mayorVote.candidates.includes(t.name)) return;
  mayorVote.votes.set(v.name, t.name);
  sendTo(v, { type: 'mayorAck', target: t.name });

  // tous les joueurs en vie ont voté : l'élection se clôt et le Maire est annoncé automatiquement
  if (autoVoteResolve && alivePlayers().every((p) => mayorVote.votes.has(p.name))) {
    resolveMayorVote();
    return;
  }
  renderMJDashboard();
}

function closeMayorVote(silent = false) {
  if (!mayorVote.open) return;
  mayorVote.open = false;
  if (musicQuiet) setWaitMusicQuiet(false);
  if (silent) { waitMusicWanted = false; stopWaitMusic(); }
  else if (waitMusicWanted) { if (musicMode === 'wait') setWaitMusicPaused(false); else if (overlayMode !== 'full') startWaitMusic(); }   // la musique continue pendant la pause
  sendToProjector({ action: 'mayorCandidates', hide: true });
  players.forEach((p) => sendTo(p, { type: 'mayorClose' }));
  if (villageVote.open) alivePlayers().forEach(sendVoteTurn);   // le vote du village réapparaît s'il était ouvert
  if (!silent && mayorVote.phase !== 'vote') {
    showToast('👑 Élection clôturée sans vote.', 'info');
  } else if (!silent) {
    const { names, max } = topOf(aliveTally(mayorVote.votes));
    if (names.length === 1) {
      selection.mayor = new Set([names[0]]);
      showToast(`👑 ${names[0]} a le plus de votes (${max}).`, 'info');
    } else if (names.length > 1) {
      selection.mayor = new Set();
      startMayorTieBreak(names);
    } else {
      showToast("👑 Aucun vote exprimé pour le Maire.", 'info');
    }
  }
  renderMJDashboard();
}

// ---- Égalité : les candidats ex æquo jouent à Pierre, feuille, ciseaux sur leur téléphone ----
let rps = null;   // { names, picks: Map, round, timer, purpose: 'mayor'|'vote' }
const RPS_BEATS = { pierre: 'ciseaux', feuille: 'pierre', ciseaux: 'feuille' };

function sendRpsTurn(p) {
  if (!rps || !p || !rps.names.includes(p.name)) return;
  sendTo(p, { type: 'rpsTurn', names: rps.names, round: rps.round, purpose: rps.purpose, myPick: rps.picks.get(p.name) || null });
}

function pushRpsToProjector() {
  const vote = rps.purpose === 'vote';
  sendToProjector({ action: 'mayorCandidates', names: rps.names, speaker: null, title: vote ? '🗳️ Égalité au vote du village' : undefined,
    sub: vote ? '✊ ✋ ✌️  Pierre, feuille, ciseaux : le perdant est éliminé' : '✊ ✋ ✌️  Égalité ! Pierre, feuille, ciseaux…' });
}

function startMayorTieBreak(names, purpose = 'mayor') {
  rps = { names: [...names], picks: new Map(), round: 1, timer: null, purpose };
  rps.names.forEach((n) => sendRpsTurn(findPlayer(n)));
  pushRpsToProjector();
  showToast(purpose === 'vote'
    ? `🗳️ Égalité entre ${names.join(', ')} : ils jouent à Pierre, feuille, ciseaux sur leur téléphone (le perdant est éliminé).`
    : `👑 Égalité entre ${names.join(', ')} : ils jouent à Pierre, feuille, ciseaux sur leur téléphone.`, 'info');
  renderMJDashboard();
}

function handleRpsPick(conn, data) {
  const v = senderOf(conn);
  const pick = String(data.pick || '');
  if (!rps || !v || !rps.names.includes(v.name) || rps.picks.has(v.name) || !RPS_BEATS[pick]) return;
  rps.picks.set(v.name, pick);
  sendTo(v, { type: 'rpsAck', pick });
  if (rps.names.every((n) => rps.picks.has(n))) resolveRpsRound();
  else renderMJDashboard();
}

function resolveRpsRound() {
  const picks = Object.fromEntries(rps.picks);
  const shapes = [...new Set(rps.picks.values())];
  let winners = null;
  if (shapes.length === 2) {
    const [a, b] = shapes;
    const win = RPS_BEATS[a] === b ? a : b;
    winners = rps.names.filter((n) => rps.picks.get(n) === win);
  }
  const known = rps.names.slice();
  const vote = rps.purpose === 'vote';
  // vote du village : le perdant est éliminé (on continue entre les perdants s'ils sont plusieurs)
  const losers = winners ? rps.names.filter((n) => !winners.includes(n)) : null;
  const keep = vote ? losers : winners;
  if (keep && keep.length === 1) {
    const only = keep[0];
    if (vote) {
      known.forEach((n) => sendTo(findPlayer(n), { type: 'rpsResult', picks, loser: only }));
      rps = null;
      sendToProjector({ action: 'mayorCandidates', hide: true });
      selection.vote = new Set([only]);
      showToast(`🗳️ ${only} perd au Pierre, feuille, ciseaux : il est éliminé.`, 'info');
      renderMJDashboard();
      setTimeout(() => { announceKillEvent('vote', { auto: true }); }, 3500);
      return;
    }
    const winner = only;
    known.forEach((n) => sendTo(findPlayer(n), { type: 'rpsResult', picks, winner }));
    rps = null;
    selection.mayor = new Set([winner]);
    showToast(`👑 ${winner} gagne au Pierre, feuille, ciseaux : il devient Maire.`, 'info');
    setTimeout(() => { if (!mayor || mayor !== winner) announceMayor(); }, 3500);
    renderMJDashboard();
    return;
  }
  // égalité parfaite (ou plusieurs gagnants) : on rejoue entre les joueurs encore en lice
  const next = keep || rps.names;
  known.forEach((n) => sendTo(findPlayer(n), { type: 'rpsResult', picks, draw: !winners, next }));
  rps.names = next.slice();
  rps.picks = new Map();
  rps.round++;
  pushRpsToProjector();
  clearTimeout(rps.timer);
  const r = rps;
  r.timer = setTimeout(() => { if (rps === r) rps.names.forEach((n) => sendRpsTurn(findPlayer(n))); }, 3500);
  renderMJDashboard();
}

function cancelRps() {
  if (!rps) return;
  clearTimeout(rps.timer);
  rps.names.forEach((n) => sendTo(findPlayer(n), { type: 'rpsResult', cancel: true }));
  const purpose = rps.purpose;
  rps = null;
  sendToProjector({ action: 'mayorCandidates', hide: true });
  showToast(purpose === 'vote' ? '🗳️ Pierre, feuille, ciseaux annulé : sélectionnez à la main qui est éliminé.' : '👑 Pierre, feuille, ciseaux annulé : désignez le Maire à la main.', 'info');
  renderMJDashboard();
}

function resolveMayorVote() {
  closeMayorVote(false);
  if (selection.mayor.size === 1) announceMayor();
}


// ---- Le Maire est mort : il choisit son successeur depuis son téléphone (noms des joueurs en vie, sans rôles) ----
let successionPending = null;   // nom du Maire mort qui doit désigner son successeur

function sendSuccessionTurn(p) {
  sendTo(p, { type: 'mayorSuccessionTurn', targets: alivePlayers().map((x) => x.name) });
}

function startMayorSuccession(dead) {
  if (!alivePlayers().length) return;
  successionPending = dead.name;
  sendSuccessionTurn(dead);
  showToast(`👑 Le Maire ${dead.name} est mort : il choisit son successeur depuis son téléphone.`, 'info');
}

// Passation du Maire : l'écran secondaire l'affiche et la suite (Chasseur, débat du village) attend qu'il ait désigné son successeur
let afterSuccession = null;
function gateSuccession(next) {
  const dead = successionPending ? findPlayer(successionPending) : null;
  if (!dead || !dead.connected || !projectorOpen()) return false;   // injoignable : on ne bloque pas la partie
  afterSuccession = next;
  sendToProjector({ action: 'hunterWaiting', name: dead.name, role: 'Maire', sub: '👑 Le Maire est mort : il doit transmettre son rôle de Maire à un joueur encore en vie' });
  return true;
}
function releaseSuccession() {
  sendToProjector({ action: 'hunterWaiting', hide: true });
  const next = afterSuccession;
  afterSuccession = null;
  if (next) setTimeout(next, MAYOR_ANNOUNCE_MS + 800);   // laisse l'annonce du nouveau Maire se terminer
}

function cancelMayorSuccession() {
  const p = successionPending ? findPlayer(successionPending) : null;
  successionPending = null;
  if (p) sendTo(p, { type: 'mayorSuccessionDone' });
  releaseSuccession();
}

function handleMayorSuccessor(conn, data) {
  const dead = senderOf(conn);
  if (!dead || dead.alive || successionPending !== dead.name) return;
  const t = findPlayer(String(data.target || ''));
  if (!t || !t.alive) { sendSuccessionTurn(dead); return; }
  successionPending = null;
  mayor = t.name;
  selection.mayor = new Set();
  sendTo(dead, { type: 'mayorSuccessionDone' });
  const shown = sendToProjector({ action: 'announceMayor', name: t.name });
  mayorAnnounceUntil = Date.now() + MAYOR_ANNOUNCE_MS;
  if (shown) playApplause();
  releaseSuccession();
  showToast(`👑 ${dead.name} désigne ${t.name} comme nouveau Maire${shown ? '' : ' (écran secondaire fermé)'}.`, 'info');
  renderMJDashboard();
}

const MAYOR_ANNOUNCE_MS = 9000;   // durée d'affichage de l'annonce du Maire sur l'écran secondaire
let mayorAnnounceUntil = 0;

// Applaudissements lus à l'annonce du Maire (son indépendant des voix du MJ)
function playApplause() {
  try {
    const a = new Audio(mediaUrl('audio', 'Applaudissements.mp3'));
    a.addEventListener('error', () => showToast('🔊 Applaudissements.mp3 introuvable sur Supabase (assets/mj/audio).', 'info'));
    fadeInAudio(a, FADE_IN_MS, MAX_VOLUME);
    a.play().catch(() => {});
  } catch (e) { /* ignoré */ }
}

// Proclame le Maire : couronne + nom sur l'écran secondaire
function announceMayor() {
  const name = [...selection.mayor].find((n) => { const p = findPlayer(n); return p && p.alive; });
  if (!name) { showToast("Sélectionnez d'abord le joueur élu Maire.", 'info'); return; }
  mayor = name;
  selection.mayor = new Set();
  if (successionPending) cancelMayorSuccession();   // un Maire est désigné : plus de succession en attente
  const shown = sendToProjector({ action: 'announceMayor', name });
  mayorAnnounceUntil = Date.now() + MAYOR_ANNOUNCE_MS;
  if (shown) playApplause();
  showToast(shown ? `👑 ${name} est élu Maire du village !` : `👑 ${name} est élu Maire (écran secondaire fermé : rien n'est affiché).`, 'info');
  renderMJDashboard();
}

// --------------------------- VOTE DU VILLAGE ---------------------------
function sendVoteTurn(p) {
  if (!villageVote.open || !p.alive || mayorVote.open) return;
  sendTo(p, {
    type: 'voteTurn',
    targets: alivePlayers().filter((x) => x !== p).map((x) => x.name),
    myVote: villageVote.votes.get(p.name) || null
  });
}

function openVillageVote() {
  villageVote = { open: true, votes: new Map() };
  selection.vote = new Set();
  alivePlayers().forEach(sendVoteTurn);
  renderMJDashboard();
}

function handleVillageVote(conn, data) {
  const v = senderOf(conn);
  if (!v || !v.alive || !villageVote.open) return;
  const t = findPlayer(String(data.target || ''));
  if (!t || !t.alive || t === v) return;
  villageVote.votes.set(v.name, t.name);
  sendTo(v, { type: 'voteAck', target: t.name });

  // tous les joueurs en vie ont voté : le vote se clôt et le plus voté est éliminé automatiquement
  if (autoVoteResolve && alivePlayers().every((p) => villageVote.votes.has(p.name))) {
    resolveVillageVote();
    return;
  }
  renderMJDashboard();
}

// Clôt le vote, désigne le joueur le plus voté et lance la vidéo d'élimination.
// Égalité : personne n'est éliminé automatiquement, le MJ choisit à la main.
function resolveVillageVote() {
  closeVillageVote(false);
  if (selection.vote.size === 1) announceKillEvent('vote', { auto: true });
}

function closeVillageVote(silent = false) {
  if (!villageVote.open) return;
  villageVote.open = false;
  players.forEach((p) => sendTo(p, { type: 'voteClose' }));
  if (!silent) {
    const { names, max } = topOf(villageTally(villageVote.votes));
    if (names.length === 1) {
      selection.vote = new Set([names[0]]);
      showToast(`🗳️ ${names[0]} a le plus de votes (${max}).`, 'info');
    } else if (names.length > 1) {
      selection.vote = new Set();
      if (names.length > 1 && !rps && names.every((n) => { const p = findPlayer(n); return p && p.alive && p.connected; })) startMayorTieBreak(names, 'vote');
      else showToast(`🗳️ Égalité entre ${names.join(', ')} : sélectionnez à la main qui est éliminé.`, 'info');
    } else {
      showToast("🗳️ Aucun vote exprimé.", 'info');
    }
  }
  renderMJDashboard();
}

// --------------------- ANNONCES VIDÉO (écran secondaire) ---------------------
// namesAt : 'start' = noms par-dessus la vidéo dès le début ; 'end' = noms affichés à la fin de la vidéo
const EVENTS = {
  wolves: { video: 'Mort Loup.mp4',     namesAt: 'start', title: '🐺 Mort par les loups-garous', button: '🐺 Annoncer la mort (loups)' },
  poison: { video: 'Empoisoner.mp4',    namesAt: 'end',   title: '☠️ Mort par empoisonnement',   button: '☠️ Annoncer l\'empoisonnement' },
  hunter: { video: 'Mort tire.mp4',       namesAt: 'start', stopScene: true,   title: '🏹 Tir du Chasseur',            button: '🏹 Annoncer le tir du Chasseur' },
  vote:   { video: 'Elimination 2.mp4', namesAt: 'end', stopScene: true,   title: '🗳️ Élimination par le village', button: '🗳️ Annoncer l\'élimination' }
};

function announceKillEvent(kind, opts = {}) {
  const cfg = EVENTS[kind];
  if (!cfg) return false;
  const names = [...selection[kind]].filter((n) => { const p = findPlayer(n); return p && p.alive; });
  if (!names.length) { showToast("Sélectionnez d'abord au moins un joueur à annoncer.", 'info'); return false; }
  if (!projectorOpen()) {
    if (opts.auto) {
      showToast(`Ouvrez l'écran secondaire puis cliquez sur « ${cfg.button} » (le ou les joueurs sont déjà présélectionnés).`, 'info');
    } else {
      alert("Veuillez d'abord cliquer sur 'Ouvrir l'Écran Secondaire' !");
    }
    renderMJDashboard();
    return false;
  }

  const deaths = killPlayers(names);
  if (kind !== 'vote') nightDeaths += deaths.length;
  else dayPause = true;
  selection[kind] = new Set();
  if (kind === 'wolves') night.wolfVictim = null;
  if (kind === 'poison') night.poisoned = null;

  sendToProjector({ action: 'hunterWaiting', hide: true });
  waitMusicWanted = false;
  stopWaitMusic();
  stopDayMusic();
  // on coupe la voix du MJ et les incrustations pendant la vidéo d'annonce
  if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
  window.speechSynthesis.cancel();
  overlayMode = null;
  currentOverlayFile = null;

  // effets sonores joués par l'écran secondaire par-dessus la vidéo
  const sfx = {};
  if (kind === 'poison') sfx.before = { url: mediaUrl('audio', 'Effet sorciere.mp3'), secs: 4 };   // un peu avant la fin de la vidéo, jusqu'à la fin de l'annonce
  if ((kind === 'vote' || kind === 'hunter') && deaths.some((d) => d.role === 'Loup-Garou')) sfx.reveal = { url: mediaUrl('audio', 'Le hurlement du loup 1.mp3') };   // à la révélation de la carte
  sendToProjector({ action: 'eventVideo', url: mediaUrl('video', cfg.video), deaths, namesAt: cfg.namesAt, stopScene: !!cfg.stopScene, cause: kind, sfx });
  checkVictory('event');
  renderMJDashboard();
  showToast(deaths.map((d) => (d.love ? `💔 ${d.name} meurt de chagrin` : `💀 ${d.name}`)).join(' — '), 'info');
  return true;
}

// ---------------------- PANNEAU D'AUTOMATISATION ----------------------
function chipsHtml(kind) {
  const list = alivePlayers();
  if (!list.length) return '<span class="hint">Aucun joueur en vie</span>';
  return list.map((p) =>
    `<button type="button" class="chip ${selection[kind].has(p.name) ? 'on' : ''}" data-kind="${kind}" data-name="${escapeHtml(p.name)}">${escapeHtml(p.name)}</button>`
  ).join('');
}

// nom de joueur (police Angel Wish)
function nameHtml(n) { return `<span class="nom-joueur">${escapeHtml(n)}</span>`; }

function countsText(counts) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return entries.length ? entries.map(([n, c]) => `${nameHtml(n)} (${c})`).join(' · ') : 'aucun vote';
}

// État du Renard pour le MJ, avec la réponse attendue (le MJ répond lui-même avec ses boutons)
function foxLine() {
  const f = players.find((p) => p.role === 'Renard' && foxChoices.has(p.name));
  if (f) {
    const t = findPlayer(foxChoices.get(f.name));
    const wolf = !!t && t.role === 'Loup-Garou';
    const answered = foxAnswered.has(f.name);
    return `a désigné ${nameHtml(foxChoices.get(f.name))} → réponse attendue : ${wolf ? '<strong>OUI</strong> (Loup détecté)' : '<strong>NON</strong> (aucun loup)'}`
      + (answered ? ` — ✅ réponse donnée (${foxAnswered.get(f.name) ? 'Oui' : 'Non'})${foxAcked.has(f.name) ? ', vision refermée' : ''}` : ' — ⏳ en attente de votre réponse <button type="button" class="auto-btn" data-act="foxModal">Répondre</button>');
  }
  return foxWaiting.size ? 'choix en cours…' : 'en attente de son appel';
}

function renderAutomation() {
  const el = document.getElementById('automation-panel');
  if (!el || !distributed) return;

  const wolves = wolvesAlive();
  const wolfCounts = aliveTally(night.wolfVotes);
  const voteCounts = villageTally(villageVote.votes);
  const lovers = players.filter((p) => p.inLove);

  const wolfStatus = wolvesOpen
    ? `🟢 vote ouvert — ${night.wolfFinal.size}/${wolves.length} validé(s) — ${countsText(wolfCounts)} <button type="button" class="auto-btn" data-act="closeWolves">Clore le vote</button>`
    : (night.wolfVictim ? `🔒 victime désignée : <strong>${nameHtml(night.wolfVictim)}</strong>${night.saved ? ' (sauvée par la Sorcière)' : ''}` : '⚪ en attente de l\'appel des loups');

  let mayorStatus;
  if (!mayorVote.open) {
    mayorStatus = `⚪ fermée <button type="button" class="auto-btn" data-act="openMayor">Ouvrir l'élection</button>`;
  } else if (mayorVote.phase === 'candidacy') {
    mayorStatus = `🟢 candidatures — ${mayorVote.answers.size}/${alivePlayers().length} ont répondu, ${mayorCandidatesNow().length} candidat(s) <button type="button" class="auto-btn" data-act="closeCandidacy">Clore les candidatures</button> <button type="button" class="auto-btn" data-act="closeMayor">Annuler</button>`;
  } else if (mayorVote.phase === 'speech') {
    const spk = mayorVote.candidates.map((n) => `<button type="button" class="auto-btn" data-act="mayorSpeaker" data-name="${escapeHtml(n)}">${mayorVote.speaker === n ? '🎤 ' : (mayorVote.spoke.has(n) ? '✔ ' : '')}${escapeHtml(n)}</button>`).join(' ');
    mayorStatus = `🎤 discours — ${spk} <button type="button" class="auto-btn" data-act="mayorNextSpeaker">Candidat suivant</button> <button type="button" class="auto-btn" data-act="startMayorBallot">Passer au vote</button> <button type="button" class="auto-btn" data-act="closeMayor">Annuler</button>`;
  } else {
    mayorStatus = `🟢 vote — ${mayorVote.votes.size}/${alivePlayers().length} ont voté — ${countsText(aliveTally(mayorVote.votes))} <button type="button" class="auto-btn" data-act="closeMayor">Clore l'élection</button>`;
  }

  const voteStatus = villageVote.open
    ? `🟢 vote ouvert — ${villageVote.votes.size}/${alivePlayers().length} ont voté — ${countsText(voteCounts)} <button type="button" class="auto-btn" data-act="closeVote">Clore le vote</button>`
    : `⚪ fermé — il s'ouvre quand le jour se lève <button type="button" class="auto-btn" data-act="openVote">Ouvrir le vote</button>`;

  const witchStatus = `Potion de vie : ${witchState.lifeUsed ? '❌ utilisée' : '✅ disponible'} · Potion de mort : ${witchState.deathUsed ? '❌ utilisée' : '✅ disponible'}`
    + (night.poisoned ? ` — empoisonné cette nuit : <strong>${nameHtml(night.poisoned)}</strong>` : '');

  el.innerHTML = `
    <h3 class="auto-title">⚙️ Automatisation de la partie</h3>
    ${gameOver ? '<p class="game-over">🏆 Partie terminée : <strong>victoire du village</strong> (tous les Loups-Garous sont morts).</p>' : ''}

    <div class="auto-block">
      <p><strong>🔔 Tour en cours :</strong> ${currentTurnRole ? `${escapeHtml(currentTurnRole)} — ${players.filter((p) => p.alive && p.role === currentTurnRole).map((p) => nameHtml(p.name)).join(', ') || 'personne en vie'}` : 'aucun'}</p>
      <p><strong>💘 Amoureux :</strong> ${lovers.length === 2 ? lovers.map((l) => nameHtml(l.name)).join(' & ') + ' — si l\'un meurt, l\'autre meurt aussi.' : 'pas encore désignés (appel de Cupidon).'}</p>
      <p><strong>🐺 Loups :</strong> ${wolfStatus}</p>
      <p><strong>🧪 Sorcière :</strong> ${witchStatus}</p>
      <p><strong>🏹 Chasseur :</strong> ${hunterLine()}</p>
      <p><strong>🦊 Renard :</strong> ${foxLine()}</p>
      <p><strong>🔮 Voyante :</strong> ${seerWaiting.size ? 'choix en cours…' : (seerLog ? `a observé <strong>${nameHtml(seerLog.target)}</strong> (${escapeHtml(seerLog.role)})` : 'en attente de son appel')}</p>
      <p><strong>👑 Maire :</strong> ${mayor ? nameHtml(mayor) + (successionPending ? ' (mort : successeur en cours de désignation)' : '') : 'pas encore élu'} — ${mayorStatus}</p>
      <p><strong>🗳️ Vote du village :</strong> ${voteStatus} <em>(la voix du Maire compte double)</em></p>
      <label class="auto-toggle"><input type="checkbox" data-act="toggleAutoVote" ${autoVoteResolve ? 'checked' : ''}> Résoudre automatiquement dès que tout le monde a voté (élimination avec vidéo, élection du Maire)</label>
    </div>

    <div class="auto-block">
      <p class="auto-label">👑 Désigner le Maire</p>
      <div class="chips">${chipsHtml('mayor')}</div>
      <button type="button" class="btn btn-day auto-announce" data-act="announceMayor">👑 Annoncer le Maire</button>
    </div>

    ${['wolves', 'poison', 'vote'].map((kind) => `
    <div class="auto-block">
      <p class="auto-label">${EVENTS[kind].title}</p>
      <div class="chips">${chipsHtml(kind)}</div>
      <button type="button" class="btn btn-danger auto-announce" data-act="announce" data-kind="${kind}">${EVENTS[kind].button}</button>
    </div>`).join('')}
  `;
}

document.addEventListener('click', (e) => {
  const panel = document.getElementById('automation-panel');
  if (!panel || !panel.contains(e.target)) return;

  const chip = e.target.closest('.chip');
  if (chip) {
    const { kind, name } = chip.dataset;
    if (kind === 'hunter') selection.hunter = selection.hunter.has(name) ? new Set() : new Set([name]);   // un seul joueur visé
    else if (kind === 'mayor') selection.mayor = selection.mayor.has(name) ? new Set() : new Set([name]);   // un seul Maire
    else if (selection[kind].has(name)) selection[kind].delete(name);
    else selection[kind].add(name);
    if (kind === 'wolves' && selection.wolves.size === 1) night.wolfVictim = [...selection.wolves][0];
    renderAutomation();
    return;
  }
  const btn = e.target.closest('[data-act]');
  if (!btn) return;
  if (btn.dataset.act === 'announce') announceKillEvent(btn.dataset.kind);
  else if (btn.dataset.act === 'closeWolves') closeWolfVote();
  else if (btn.dataset.act === 'closeVote') closeVillageVote(false);
  else if (btn.dataset.act === 'openVote') openVillageVote();
  else if (btn.dataset.act === 'openMayor') openMayorVote(false);
  else if (btn.dataset.act === 'closeCandidacy') closeCandidacy();
  else if (btn.dataset.act === 'mayorSpeaker') setMayorSpeaker(btn.dataset.name);
  else if (btn.dataset.act === 'mayorNextSpeaker') nextMayorSpeaker();
  else if (btn.dataset.act === 'startMayorBallot') startMayorBallot();
  else if (btn.dataset.act === 'foxModal') openFoxModal();
  else if (btn.dataset.act === 'hunterStart') startHunterSequence(false);
  else if (btn.dataset.act === 'closeMayor') closeMayorVote(false);
  else if (btn.dataset.act === 'announceMayor') announceMayor();
  else if (btn.dataset.act === 'toggleAutoVote') { autoVoteResolve = !!e.target.checked; renderAutomation(); }
});

// --- RACCOURCIS CLAVIER ---
document.addEventListener('keydown', (e) => {
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea') return;
  if (e.key === 'Escape') stopAllMedia();
  if (e.code === 'Space') {
    e.preventDefault();
    togglePauseAllMedia();
  }
});

updateCallButtons();

// Diagnostic de la police des noms (console, F12) : indique si « Angel Wish » est bien chargée
if (typeof document !== 'undefined' && document.fonts && document.fonts.load) {
  document.fonts.load("20px 'Angel Wish'", 'Alice').then((f) => {
    console.info('Police Angel Wish :', f && f.length ? 'chargée ✅' : 'NON chargée ❌ (les noms utilisent la police de secours)');
  }).catch(() => console.warn('Police Angel Wish : erreur de chargement'));
}
