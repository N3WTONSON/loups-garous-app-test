// ===== LIENS SUPABASE =====
const SUPABASE_BASE = "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets";

const ASSETS = {
  images: {
    "Verso.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/joueur/images/Verso.png",
    "Chasseur.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Chasseur.png",
    "Cupidon.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Cupidon.png",
    "Loup-Garou.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Loup-Garou.png",
    "Maire.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Maire.png",
    "Voyante.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Voyante.png",
    "Voleur.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Voleur.png",
    "Villageois.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Villageois.png",
    "Renard.jpg": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Renard.jpg",
    "Petite Fille.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Petite%20Fille.png",
    "Sorciere.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Sorciere.png",
    "fond-village.jpg": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/fond-village.jpg",
  }
};

const ASSET_FOLDERS = { images: "images" };

function assetUrl(path) {
  return SUPABASE_BASE + "/" + path.split("/").map(encodeURIComponent).join("/");
}

function mediaUrl(kind, name) {
  return (ASSETS[kind] && ASSETS[kind][name]) || assetUrl(ASSET_FOLDERS[kind] + "/" + name);
}

let peer = null;
let conn = null;
let myRole = "";
let isRevealed = false;
let gameStartedUI = false;   // vrai après le premier appel du Maire : la carte passe en petit en haut à droite
let joined = false;
let session = null;
let retryTimer = null;

const STORE_KEY = "lg-player-session";

// Dictionnaire des cartes
const roleData = {
  "Loup-Garou": {
    image: "Loup-Garou.png",
    description: "🐺 <strong>Loup-Garou :</strong> Chaque nuit, dévorez un villageois en concertation avec les autres loups. Le jour, fondez-vous parmi les innocents pour ne pas vous faire démasquer."
  },
  "Villageois": {
    image: "Villageois.png",
    description: "👨‍🌾 <strong>Simple Villageois :</strong> Vous ne possédez aucun pouvoir particulier. Utilisez votre sens de l'observation et votre logique lors des débats pour éliminer les Loups-Garous."
  },
  "Voyante": {
    image: "Voyante.png",
    description: "🔮 <strong>La Voyante :</strong> Chaque nuit, vous pouvez observer la véritable identité d'un joueur de votre choix avant que le village ne se réveille."
  },
  "Sorcière": {
    image: "Sorciere.png",
    description: "🧪 <strong>La Sorcière :</strong> Vous possédez deux potions à usage unique : une potion de vie pour sauver la victime des loups, et une potion de mort pour éliminer un joueur."
  },
  "Chasseur": {
    image: "Chasseur.png",
    description: "🏹 <strong>Le Chasseur :</strong> Si vous vous faites éliminer (par les loups ou par le vote du village), vous tirez une dernière balle pour éliminer immédiatement le joueur de votre choix."
  },
  "Cupidon": {
    image: "Cupidon.png",
    description: "💘 <strong>Cupidon :</strong> La première nuit, désignez deux joueurs qui deviendront amoureux. Si l'un d'eux meurt, l'autre meurt de chagrin immédiatement."
  },
  "Voleur": {
    image: "Voleur.png",
    description: "🕵️ <strong>Le Voleur :</strong> La première nuit, quand le Maître du Jeu t'appelle, deux rôles te sont proposés au hasard : tu en choisis un et tu le voles. Le joueur qui le possédait devient simple Villageois."
  },
  "Renard": {
    image: "Renard.jpg",
    description: "🦊 <strong>Le Renard :</strong> Chaque nuit, désignez un groupe de 3 joueurs voisins. Si au moins un Loup-Garou s'y trouve, vous conservez votre pouvoir pour la nuit suivante."
  },
  "Petite Fille": {
    image: "Petite Fille.png",
    description: "👧 <strong>La Petite Fille :</strong> Vous pouvez entr'ouvrir les yeux pendant la nuit pour espionner discrètement les Loups-Garous, à vos risques et périls !"
  }
};

function loadSession() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { return null; }
}
function saveSession(s) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) { }
}
function clearSession() {
  try { localStorage.removeItem(STORE_KEY); } catch (e) { }
}
function randomToken() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function showError(msg) {
  const el = document.getElementById('join-error');
  el.textContent = msg;
  el.style.display = msg ? 'block' : 'none';
}

function setBusy(busy) {
  const btn = document.getElementById('join-btn');
  btn.disabled = busy;
  btn.textContent = busy ? "Connexion…" : "Rejoindre";
}

function showJoinForm() {
  document.getElementById('join-card').style.display = 'block';
  document.getElementById('game-card').style.display = 'none';
}

function showGame(name) {
  document.getElementById('join-card').style.display = 'none';
  document.getElementById('game-card').style.display = 'block';
  document.getElementById('welcome-title').textContent = `Joueur : ${name}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const urlRoom = (new URLSearchParams(window.location.search).get('room') || "").toUpperCase();
  const saved = loadSession();

  if (urlRoom) document.getElementById('room-code').value = urlRoom;

  if (saved && (!urlRoom || urlRoom === saved.room)) {
    document.getElementById('room-code').value = saved.room;
    document.getElementById('player-name').value = saved.name;
    session = saved;
    connect(saved.room, saved.name, saved.token, true);
  }

  ["room-code", "player-name"].forEach((id) =>
    document.getElementById(id).addEventListener('keydown', (e) => {
      if (e.key === 'Enter') joinRoom();
    })
  );
  document.getElementById('secret-card').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleRoleReveal(); }
  });
});

function joinRoom() {
  const name = document.getElementById('player-name').value.trim();
  const room = document.getElementById('room-code').value.trim().toUpperCase();

  if (!name || !room) {
    showError("Veuillez entrer votre pseudo et le code du salon.");
    return;
  }
  const token = session && session.room === room && session.name === name ? session.token : randomToken();
  session = { room, name, token };
  connect(room, name, token, false);
}

function connect(room, name, token, isAuto) {
  clearTimeout(retryTimer);
  showError("");
  setBusy(true);
  if (peer && !peer.destroyed) peer.destroy();

  peer = new Peer();

  peer.on('open', () => {
    conn = peer.connect("LG-" + room, { reliable: true });

    const timeout = setTimeout(() => {
      if (!conn.open) failJoin("Salon introuvable. Vérifiez le code ou réessayez.", isAuto);
    }, 10000);

    conn.on('open', () => {
      clearTimeout(timeout);
      conn.send({ type: 'join', playerName: name, token });
    });

    conn.on('data', (data) => {
      if (!data) return;
      if (data.type === 'joined') {
        joined = true;
        saveSession(session);
        setBusy(false);
        showGame(name);
      } else if (data.type === 'rejected') {
        joined = false;
        failJoin(data.message || "Connexion refusée.", true);
      } else if (data.type === 'assignRole') {
        myRole = data.role;
        setupRoleCard(data.role);
      } else if (data.type === 'thiefTurn') {
        showThiefPanel(data.options || []);
      } else if (data.type === 'thiefDone') {
        hideThiefPanel();
      } else if (data.type === 'status') {
        setAliveUI(data.alive);
      } else if (data.type === 'lover') {
        setLoverUI(data.partner);
      } else if (data.type === 'cupidTurn') {
        showCupidPanel(data.names || []);
      } else if (data.type === 'cupidDone') {
        hidePanel('cupid-panel');
      } else if (data.type === 'wolfTurn') {
        showWolfPanel(data);
      } else if (data.type === 'wolfVotes') {
        wolfState.votes = data.votes || {};
        renderWolfList();
      } else if (data.type === 'wolfLocked') {
        wolfState.final = true;
        renderWolfList();
      } else if (data.type === 'wolfDone') {
        hidePanel('wolf-panel');
      } else if (data.type === 'witchTurn') {
        showWitchPanel(data);
      } else if (data.type === 'witchDone') {
        hidePanel('witch-panel');
      } else if (data.type === 'voteTurn') {
        showVotePanel(data);
      } else if (data.type === 'voteAck') {
        voteState.my = data.target;
        voteState.picked = data.target;
        renderVoteList();
      } else if (data.type === 'voteClose') {
        hidePanel('vote-panel');
      } else if (data.type === 'mayorTurn') {
        showMayorPanel(data);
      } else if (data.type === 'candidacyTurn') {
        showCandidacyAsk(data.answer);
      } else if (data.type === 'candidacyAck') {
        showCandidacyAsk(data.answer);
      } else if (data.type === 'candidacySpeech') {
        showCandidacySpeech(data);
      } else if (data.type === 'mayorAck') {
        mayorState.my = data.target;
        mayorState.picked = data.target;
        renderMayorList();
      } else if (data.type === 'mayorSuccessionTurn') {
        showSuccessionPanel(data.targets || []);
      } else if (data.type === 'mayorSuccessionDone') {
        hidePanel('succession-panel');
      } else if (data.type === 'mayorClose') {
        hidePanel('mayor-panel');
        hidePanel('candidacy-panel');
      } else if (data.type === 'gameStarted') {
        applyGameStarted(data.started !== false);
      } else if (data.type === 'hunterTurn') {
        showHunterPanel(data.targets || []);
      } else if (data.type === 'hunterDone') {
        showHunterDone();
      } else if (data.type === 'gameOver') {
        showGameOver(data.winner);
      } else if (data.type === 'foxTurn') {
        showFoxPanel(data);
      } else if (data.type === 'foxAck') {
        showFoxWaiting(data.target);
      } else if (data.type === 'foxDone') {
        foxClose(true);
      } else if (data.type === 'foxAnswer') {
        showFoxAnswer(data.target, data.answer);
      } else if (data.type === 'seerTurn') {
        showSeerPanel(data.targets || []);
      } else if (data.type === 'seerResult') {
        showSeerResult(data.name, data.role);
      }
    });

    conn.on('close', () => {
      if (joined) scheduleReconnect();
    });
  });

  peer.on('error', (err) => {
    if (joined) {
      scheduleReconnect();
    } else if (err.type === 'peer-unavailable') {
      failJoin("Salon introuvable. Vérifiez le code fourni par le MJ.", isAuto);
    } else {
      failJoin("Erreur de connexion (" + err.type + "). Vérifiez votre réseau.", isAuto);
    }
  });
}

function failJoin(message, clear) {
  setBusy(false);
  if (clear) clearSession();
  showJoinForm();
  showError(message);
}

function scheduleReconnect() {
  document.getElementById('status-text').textContent = "Connexion perdue, reconnexion en cours…";
  clearTimeout(retryTimer);
  retryTimer = setTimeout(() => {
    if (session) connect(session.room, session.name, session.token, true);
  }, 3000);
}

function setupRoleCard(role) {
  document.getElementById('status-text').textContent = "Votre rôle vous a été distribué !";
  document.getElementById('card-area').style.display = 'block';

  const data = roleData[role] || {
    image: null,
    description: `🎭 <strong>${escapeText(role)} :</strong> Rôle personnalisé attribué par le Maître du Jeu.`
  };

  document.getElementById('role-name-display').textContent = role;
  const img = document.getElementById('role-image-display');
  if (data.image) {
    img.style.display = '';
    img.onerror = () => { img.style.display = 'none'; };
    img.src = mediaUrl('images', data.image);
  } else {
    img.style.display = 'none';
  }
  document.getElementById('role-desc-display').innerHTML = data.description;

  isRevealed = true;
  toggleRoleReveal();
}

function escapeText(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function toggleRoleReveal() {
  const cardBack = document.getElementById('secret-card');
  const roleDetails = document.getElementById('role-details');
  const versoImg = document.getElementById('verso-image');

  isRevealed = !isRevealed;

  if (isRevealed) {
    cardBack.classList.add('revealed');
    cardBack.querySelector('span').textContent = "🔒 Toucher pour masquer";
    if (versoImg) versoImg.style.display = 'none';
    roleDetails.style.display = 'flex';
  } else {
    cardBack.classList.remove('revealed');
    cardBack.querySelector('span').textContent = "👁️ Toucher pour révéler";
    if (versoImg) versoImg.style.display = 'block';
    roleDetails.style.display = 'none';
  }
  updateMiniCard();
}

// --- Tour du Voleur : choisir l'un des 2 rôles proposés (cartes, sans nom de joueur) ---
let thiefState = { picked: null, role: null };

function renderThiefSelection() {
  document.querySelectorAll('#thief-cards .thief-card').forEach((c, i) => c.classList.toggle('selected', thiefState.picked === i));
  const btn = document.getElementById('thief-confirm');
  if (btn) {
    btn.disabled = thiefState.picked === null;
    btn.textContent = thiefState.picked === null ? '🕵️ Voler ce rôle' : `🕵️ Voler « ${thiefState.role} »`;
  }
}

function thiefConfirm() {
  if (thiefState.picked === null) return;
  thiefChoose(thiefState.picked, thiefState.role);
}

function showThiefPanel(options) {
  const panel = document.getElementById('thief-panel');
  const list = document.getElementById('thief-cards');
  if (!panel || !list) return;

  list.innerHTML = '';
  options.forEach((role, index) => {
    const data = roleData[role] || { image: null, description: `🎭 <strong>${escapeText(role)}</strong>` };

    const card = document.createElement('button');
    card.className = 'thief-card';

    if (data.image) {
      const img = document.createElement('img');
      img.alt = role;
      img.onerror = () => { img.style.display = 'none'; };
      img.src = mediaUrl('images', data.image);
      card.appendChild(img);
    }
    const title = document.createElement('h4');
    title.textContent = role;
    card.appendChild(title);
    const desc = document.createElement('p');
    desc.innerHTML = data.description;
    card.appendChild(desc);

    card.onclick = () => { thiefState.picked = index; thiefState.role = role; renderThiefSelection(); };
    list.appendChild(card);
  });

  thiefState = { picked: null, role: null };
  renderThiefSelection();
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function lockThiefPanel() {
  document.querySelectorAll('#thief-panel button').forEach((b) => { b.disabled = true; });
}

function thiefChoose(index, role) {
  if (!conn || !conn.open) return;
  lockThiefPanel();
  conn.send({ type: 'thiefSteal', choice: index });
}


function hideThiefPanel() {
  const panel = document.getElementById('thief-panel');
  if (panel) panel.style.display = 'none';
}

// =====================================================================
//  ACTIONS DE JEU SUR TÉLÉPHONE (noms des joueurs uniquement, jamais les rôles)
// =====================================================================
function hidePanel(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

function showPanel(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// bouton-nom réutilisable
function pickButton(label, { selected = false, disabled = false, extra = '', onClick }) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'btn pick-btn nom-joueur' + (selected ? ' selected' : '');
  b.disabled = disabled;
  const name = document.createElement('span');
  name.textContent = label;
  b.appendChild(name);
  if (extra) {
    const x = document.createElement('small');
    x.className = 'pick-extra';
    x.textContent = extra;
    b.appendChild(x);
  }
  b.onclick = onClick;
  return b;
}

// --- joueur éliminé / amoureux ---
function setAliveUI(alive) {
  const banner = document.getElementById('dead-banner');
  if (banner) banner.style.display = alive ? 'none' : 'block';
  if (!alive) {
    ['cupid-panel', 'wolf-panel', 'witch-panel', 'vote-panel', 'thief-panel', 'seer-panel', 'mayor-panel', 'candidacy-panel', 'fox-panel'].forEach(hidePanel);
  }
}

function setLoverUI(partner) {
  const el = document.getElementById('lover-line');
  if (!el) return;
  if (partner) {
    el.textContent = `💘 Tu es amoureux(se) de ${partner}. Si l'un de vous meurt, l'autre mourra de chagrin.`;
    el.style.display = 'block';
  } else {
    el.style.display = 'none';
  }
}

// --- Cupidon ---
let cupidState = { names: [], picked: [] };

function showCupidPanel(names) {
  cupidState = { names, picked: [] };
  renderCupidList();
  showPanel('cupid-panel');
}

function renderCupidList() {
  const list = document.getElementById('cupid-list');
  list.innerHTML = '';
  cupidState.names.forEach((name) => {
    const on = cupidState.picked.includes(name);
    list.appendChild(pickButton(name, {
      selected: on,
      onClick: () => {
        if (on) cupidState.picked = cupidState.picked.filter((n) => n !== name);
        else if (cupidState.picked.length < 2) cupidState.picked.push(name);
        renderCupidList();
      }
    }));
  });
  document.getElementById('cupid-confirm').disabled = cupidState.picked.length !== 2;
}

function cupidConfirm() {
  if (!conn || !conn.open || cupidState.picked.length !== 2) return;
  document.querySelectorAll('#cupid-panel button').forEach((b) => { b.disabled = true; });
  conn.send({ type: 'cupidChoice', names: cupidState.picked });
}

// --- Loups-Garous ---
let wolfState = { targets: [], votes: {}, my: null, final: false };

function showWolfPanel(data) {
  wolfState = { targets: data.targets || [], votes: data.votes || {}, my: data.myVote || null, final: !!data.final };
  renderWolfList();
  showPanel('wolf-panel');
}

function renderWolfList() {
  const list = document.getElementById('wolf-list');
  list.innerHTML = '';
  wolfState.targets.forEach((name) => {
    const n = wolfState.votes[name] || 0;
    list.appendChild(pickButton(name, {
      selected: wolfState.my === name,
      disabled: wolfState.final,
      extra: n ? `${n} vote${n > 1 ? 's' : ''}` : '',
      onClick: () => {
        if (!conn || !conn.open || wolfState.final) return;
        wolfState.my = name;
        conn.send({ type: 'wolfVote', target: name });
        renderWolfList();
      }
    }));
  });
  document.getElementById('wolf-confirm').disabled = wolfState.final || !wolfState.my;
  document.getElementById('wolf-info').textContent = wolfState.final
    ? "Vote validé. En attente des autres loups…"
    : "Touche un nom pour voter. Le nombre de votes s'affiche à côté.";
}

function wolfConfirm() {
  if (!conn || !conn.open || !wolfState.my) return;
  conn.send({ type: 'wolfFinal' });
}

// --- Sorcière ---
let witchState = { save: false, poison: null, victim: null, canSave: false, canPoison: false, targets: [] };

function showWitchPanel(data) {
  witchState = { save: false, poison: null, victim: data.victim || null, canSave: !!data.canSave, canPoison: !!data.canPoison, targets: data.targets || [] };

  const saveBox = document.getElementById('witch-save');
  saveBox.style.display = witchState.canSave ? 'block' : 'none';
  if (witchState.canSave) {
    document.getElementById('witch-victim-text').textContent = `Cette nuit, les loups ont attaqué : ${witchState.victim}.`;
  }
  document.getElementById('witch-novictim').style.display = (!witchState.canSave && data.noVictim) ? 'block' : 'none';
  document.getElementById('witch-poison').style.display = witchState.canPoison ? 'block' : 'none';
  document.getElementById('witch-empty').style.display = (!witchState.canSave && !witchState.canPoison) ? 'block' : 'none';

  const err = document.getElementById('witch-error');
  err.textContent = data.error || '';
  err.style.display = data.error ? 'block' : 'none';

  renderWitch();
  showPanel('witch-panel');
}

// Une seule potion par tour : choisir l'une désactive l'autre
function renderWitch() {
  const saveBtn = document.getElementById('witch-save-btn');
  saveBtn.disabled = !!witchState.poison;
  saveBtn.textContent = witchState.save
    ? `✅ Potion de vie sur ${witchState.victim} (toucher pour annuler)`
    : `🧪💚 Sauver ${witchState.victim || ''}`;

  const list = document.getElementById('witch-poison-list');
  list.innerHTML = '';
  if (witchState.canPoison) {
    witchState.targets.forEach((name) => {
      list.appendChild(pickButton(name, {
        selected: witchState.poison === name,
        disabled: witchState.save,
        onClick: () => {
          if (witchState.save) return;
          witchState.poison = witchState.poison === name ? null : name;
          renderWitch();
        }
      }));
    });
  }

  document.getElementById('witch-hint').style.display = (witchState.canSave && witchState.canPoison) ? 'block' : 'none';
  const confirmBtn = document.getElementById('witch-confirm');
  confirmBtn.disabled = false;     // réactivé à chaque tour (il est verrouillé après l'envoi)
  confirmBtn.textContent = (witchState.save || witchState.poison)
    ? 'Valider'
    : ((!witchState.canSave && !witchState.canPoison) ? 'Fermer' : 'Ne rien faire');
}

function witchToggleSave() {
  if (witchState.poison) return;
  witchState.save = !witchState.save;
  renderWitch();
}

function witchConfirm() {
  if (!conn || !conn.open) return;
  if (witchState.save && witchState.poison) return;   // jamais les deux potions en même temps
  document.querySelectorAll('#witch-panel button').forEach((b) => { b.disabled = true; });
  conn.send({ type: 'witchAction', save: witchState.save, poison: witchState.poison });
}

// --- Vote du village ---
let voteState = { targets: [], my: null, picked: null };

function showVotePanel(data) {
  hidePanel('seer-panel');   // au lever du jour, l'écran de la Voyante se ferme
  hidePanel('fox-panel');    // … et celui du Renard
  voteState = { targets: data.targets || [], my: data.myVote || null, picked: data.myVote || null };
  renderVoteList();
  showPanel('vote-panel');
}

// On choisit un nom, puis on appuie sur « Voter ». Le vote reste modifiable tant qu'il est ouvert.
function renderVoteList() {
  const list = document.getElementById('vote-list');
  list.innerHTML = '';
  voteState.targets.forEach((name) => {
    list.appendChild(pickButton(name, {
      selected: voteState.picked === name,
      onClick: () => { voteState.picked = name; renderVoteList(); }
    }));
  });

  const btn = document.getElementById('vote-confirm');
  if (!voteState.picked) {
    btn.disabled = true;
    btn.textContent = '🗳️ Voter';
  } else if (voteState.my && voteState.picked === voteState.my) {
    btn.disabled = true;
    btn.textContent = `✅ Vote enregistré : ${voteState.my}`;
  } else {
    btn.disabled = false;
    btn.textContent = voteState.my ? `🗳️ Changer mon vote pour ${voteState.picked}` : `🗳️ Voter pour ${voteState.picked}`;
  }
  document.getElementById('vote-info').textContent = voteState.my
    ? `Ton vote : ${voteState.my}. Tu peux le changer tant que le vote est ouvert.`
    : "Choisis le joueur à éliminer, puis appuie sur « Voter ».";
}

function voteConfirm() {
  if (!conn || !conn.open || !voteState.picked) return;
  conn.send({ type: 'villageVote', target: voteState.picked });
}

// --- Voyante : choisir UN joueur (noms uniquement), puis découvrir son rôle ---
let seerState = { targets: [], picked: null };

function showSeerPanel(targets) {
  seerState = { targets, picked: null, resultShown: false };
  document.getElementById('seer-choose').style.display = 'block';
  document.getElementById('seer-result').style.display = 'none';
  renderSeerList();
  showPanel('seer-panel');
}

function renderSeerList() {
  const list = document.getElementById('seer-list');
  list.innerHTML = '';
  seerState.targets.forEach((name) => {
    list.appendChild(pickButton(name, {
      selected: seerState.picked === name,
      onClick: () => { seerState.picked = name; renderSeerList(); }
    }));
  });
  document.getElementById('seer-confirm').disabled = !seerState.picked;
}

function seerConfirm() {
  if (!conn || !conn.open || !seerState.picked) return;
  document.querySelectorAll('#seer-choose button').forEach((b) => { b.disabled = true; });
  conn.send({ type: 'seerChoice', target: seerState.picked });
}

function showSeerResult(name, role) {
  seerState.resultShown = true;
  const data = roleData[role] || { image: null, description: `🎭 <strong>${escapeText(role)}</strong>` };
  document.getElementById('seer-choose').style.display = 'none';
  document.getElementById('seer-result').style.display = 'block';
  document.getElementById('seer-result-text').textContent = `${name} est…`;
  document.getElementById('seer-result-role').textContent = role;
  document.getElementById('seer-result-desc').innerHTML = data.description;
  const img = document.getElementById('seer-result-img');
  if (data.image) {
    img.style.display = '';
    img.onerror = () => { img.style.display = 'none'; };
    img.src = mediaUrl('images', data.image);
    img.alt = role;
  } else {
    img.style.display = 'none';
  }
  showPanel('seer-panel');
}

// --- Candidatures du Maire : « Je me présente » / « Je ne me présente pas », puis discours oraux ---
function showCandidacyAsk(answer) {
  const asked = answer === true || answer === false;
  document.getElementById('candidacy-info').textContent = asked
    ? (answer ? '✅ Tu te présentes. Prépare ton discours : tu le feras à l\'oral devant le village.' : '🙅 Tu ne te présentes pas. Tu peux changer d\'avis tant que les candidatures sont ouvertes.')
    : 'Veux-tu te présenter comme Maire ? Si oui, tu feras un discours à l\'oral devant le village.';
  document.getElementById('candidacy-buttons').style.display = '';
  document.getElementById('candidacy-yes').disabled = answer === true;
  document.getElementById('candidacy-no').disabled = answer === false;
  document.getElementById('candidacy-list').innerHTML = '';
  showPanel('candidacy-panel');
}

function showCandidacySpeech(data) {
  const list = document.getElementById('candidacy-list');
  document.getElementById('candidacy-buttons').style.display = 'none';
  document.getElementById('candidacy-info').textContent = data.speaker
    ? (data.speaker === (session && session.name) ? '🎤 C\'est à toi de faire ton discours !' : `🎤 Discours de ${data.speaker}… Écoute-le avant de voter.`)
    : (data.me ? '🙋 Tu es candidat. Attends que le Maître du Jeu te donne la parole.' : 'Les candidats vont faire leur discours, puis le vote s\'ouvrira.');
  list.innerHTML = '';
  (data.candidates || []).forEach((name) => {
    const li = document.createElement('li');
    li.className = 'candidate-line' + (name === data.speaker ? ' speaking' : '');
    li.textContent = (name === data.speaker ? '🎤 ' : '👑 ') + name;
    list.appendChild(li);
  });
  showPanel('candidacy-panel');
}

function candidacyAnswer(run) {
  if (!conn || !conn.open) return;
  conn.send({ type: 'mayorCandidacy', run: !!run });
}

// --- Élection du Maire : on choisit un nom, puis on appuie sur « Voter » (modifiable tant que l'élection est ouverte) ---
let mayorState = { targets: [], my: null, picked: null };

function showMayorPanel(data) {
  hidePanel('candidacy-panel');
  mayorState = { targets: data.targets || [], my: data.myVote || null, picked: data.myVote || null };
  renderMayorList();
  showPanel('mayor-panel');
}

function renderMayorList() {
  const list = document.getElementById('mayor-list');
  list.innerHTML = '';
  mayorState.targets.forEach((name) => {
    list.appendChild(pickButton(name, {
      selected: mayorState.picked === name,
      onClick: () => { mayorState.picked = name; renderMayorList(); }
    }));
  });

  const btn = document.getElementById('mayor-confirm');
  if (!mayorState.picked) {
    btn.disabled = true;
    btn.textContent = '👑 Voter';
  } else if (mayorState.my && mayorState.picked === mayorState.my) {
    btn.disabled = true;
    btn.textContent = `✅ Vote enregistré : ${mayorState.my}`;
  } else {
    btn.disabled = false;
    btn.textContent = mayorState.my ? `👑 Changer mon vote pour ${mayorState.picked}` : `👑 Voter pour ${mayorState.picked}`;
  }
  document.getElementById('mayor-info').textContent = mayorState.my
    ? `Ton vote : ${mayorState.my}. Tu peux le changer tant que l'élection est ouverte.`
    : "Choisis le joueur que tu veux comme Maire, puis appuie sur « Voter ».";
}

function mayorConfirm() {
  if (!conn || !conn.open || !mayorState.picked) return;
  conn.send({ type: 'mayorVote', target: mayorState.picked });
}

// --- Le Maire est mort : il choisit son successeur (noms des joueurs en vie, sans rôles) ---
let successionState = { targets: [], picked: null };

function showSuccessionPanel(targets) {
  successionState = { targets, picked: null };
  renderSuccessionList();
  showPanel('succession-panel');
}

function renderSuccessionList() {
  const list = document.getElementById('succession-list');
  list.innerHTML = '';
  successionState.targets.forEach((name) => {
    list.appendChild(pickButton(name, {
      selected: successionState.picked === name,
      onClick: () => { successionState.picked = name; renderSuccessionList(); }
    }));
  });
  const btn = document.getElementById('succession-confirm');
  btn.disabled = !successionState.picked;
  btn.textContent = successionState.picked ? `👑 Désigner ${successionState.picked}` : '👑 Désigner mon successeur';
}

function successionConfirm() {
  if (!conn || !conn.open || !successionState.picked) return;
  document.querySelectorAll('#succession-panel button').forEach((b) => { b.disabled = true; });
  conn.send({ type: 'mayorSuccessor', target: successionState.picked });
}

// La Voyante referme son résultat : le tour est fini, la régie lance « Fermez les yeux »
function seerClose() {
  const wasShown = seerState.resultShown;
  seerState.resultShown = false;
  hidePanel('seer-panel');
  if (wasShown && conn && conn.open) conn.send({ type: 'seerClosed' });
}

// Fin de partie : tous les Loups-Garous sont morts
function showGameOver(winner) {
  const el = document.getElementById('gameover-banner');
  if (!el) return;
  if (!winner) { el.style.display = 'none'; return; }   // la partie reprend
  el.textContent = winner === 'village' ? '🏆 Victoire du village ! Tous les Loups-Garous sont morts.' : '🏁 Partie terminée.';
  el.style.display = 'block';
  ['cupid-panel', 'wolf-panel', 'witch-panel', 'vote-panel', 'thief-panel', 'seer-panel', 'mayor-panel', 'candidacy-panel', 'fox-panel'].forEach(hidePanel);
}

// --- Renard : il désigne UN joueur (noms uniquement) puis lit la réponse OUI / NON du Maître du Jeu ---
let foxState = { targets: [], picked: null, answerShown: false };

function showFoxPanel(data) {
  foxState = { targets: data.targets || [], picked: null, answerShown: false };
  document.getElementById('fox-result').style.display = 'none';
  if (data.chosen) {                       // reconnexion : il avait déjà choisi
    showFoxWaiting(data.chosen);
  } else {
    document.getElementById('fox-choose').style.display = 'block';
    document.getElementById('fox-wait').style.display = 'none';
    renderFoxList();
  }
  showPanel('fox-panel');
}

function renderFoxList() {
  const list = document.getElementById('fox-list');
  list.innerHTML = '';
  foxState.targets.forEach((name) => {
    list.appendChild(pickButton(name, {
      selected: foxState.picked === name,
      onClick: () => { foxState.picked = name; renderFoxList(); }
    }));
  });
  const btn = document.getElementById('fox-confirm');
  btn.disabled = !foxState.picked;
  btn.textContent = foxState.picked ? `Désigner ${foxState.picked}` : 'Désigner ce joueur';
}

function foxConfirm() {
  if (!conn || !conn.open || !foxState.picked) return;
  document.querySelectorAll('#fox-choose button').forEach((b) => { b.disabled = true; });
  conn.send({ type: 'foxChoice', target: foxState.picked });
}

function showFoxWaiting(name) {
  document.getElementById('fox-choose').style.display = 'none';
  document.getElementById('fox-result').style.display = 'none';
  document.getElementById('fox-wait').style.display = 'block';
  document.getElementById('fox-wait-text').textContent = `Tu as désigné ${name}. Attends la réponse du Maître du Jeu…`;
  showPanel('fox-panel');
}

function showFoxAnswer(name, answer) {
  foxState.answerShown = true;
  document.getElementById('fox-choose').style.display = 'none';
  document.getElementById('fox-wait').style.display = 'none';
  document.getElementById('fox-result').style.display = 'block';
  document.getElementById('fox-result-target').textContent = `Ta réponse pour ${name} :`;
  const el = document.getElementById('fox-answer');
  el.className = 'fox-answer ' + (answer ? 'yes' : 'no');
  el.textContent = answer ? '🐺 OUI — un Loup-Garou est détecté' : '🌿 NON — aucun Loup-Garou';
  showPanel('fox-panel');
}

// Le Renard referme la réponse : son tour est fini, la régie lance « Fermez les yeux »
function foxClose(auto) {
  const wasShown = foxState.answerShown;
  foxState.answerShown = false;
  hidePanel('fox-panel');
  if (!auto && wasShown && conn && conn.open) conn.send({ type: 'foxClosed' });
}

// --- Carte de rôle en petit, en haut à droite, à côté du nom (dès que la partie a commencé) ---
function applyGameStarted(started) {
  gameStartedUI = !!started;
  const big = document.getElementById('secret-card');
  const card = document.getElementById('game-card');
  if (big) big.style.display = gameStartedUI ? 'none' : '';
  if (card) card.classList.toggle('has-mini', gameStartedUI && !!myRole);
  updateMiniCard();
}

function updateMiniCard() {
  const mini = document.getElementById('mini-card');
  const img = document.getElementById('mini-card-img');
  const card = document.getElementById('game-card');
  if (!mini || !img) return;
  const show = gameStartedUI && !!myRole;
  mini.style.display = show ? 'block' : 'none';
  if (card) card.classList.toggle('has-mini', show);
  if (!show) return;
  const data = roleData[myRole];
  img.src = (isRevealed && data && data.image) ? mediaUrl('images', data.image) : mediaUrl('images', 'Verso.png');
  mini.title = isRevealed ? 'Toucher pour masquer mon rôle' : 'Toucher pour voir mon rôle';
}

// --- Chasseur mort : il choisit sa dernière cible (noms uniquement) ---
let hunterState = { targets: [], picked: null };

function showHunterPanel(targets) {
  hunterState = { targets, picked: null };
  renderHunterList();
  showPanel('hunter-panel');
}

function renderHunterList() {
  const list = document.getElementById('hunter-list');
  list.innerHTML = '';
  hunterState.targets.forEach((name) => {
    list.appendChild(pickButton(name, {
      selected: hunterState.picked === name,
      onClick: () => { hunterState.picked = name; renderHunterList(); }
    }));
  });
  const btn = document.getElementById('hunter-confirm');
  btn.disabled = !hunterState.picked;
  btn.textContent = hunterState.picked ? `🏹 Tirer sur ${hunterState.picked}` : '🏹 Tirer';
}

function hunterConfirm() {
  if (!conn || !conn.open || !hunterState.picked) return;
  document.querySelectorAll('#hunter-panel button').forEach((b) => { b.disabled = true; });
  conn.send({ type: 'hunterShoot', target: hunterState.picked });
}

function showHunterDone() {
  hidePanel('hunter-panel');
}