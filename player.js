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
    "Sorcière.png": "https://ifjiysdhxmidiswcsiuq.supabase.co/storage/v1/object/public/assets/assets/images/Sorci%C3%A8re.png",
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
    image: "Sorcière.png",
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
}

// --- Tour du Voleur : choisir l'un des 2 rôles proposés (cartes, sans nom de joueur) ---
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

    card.onclick = () => thiefChoose(index, role);
    list.appendChild(card);
  });

  document.getElementById('thief-skip').disabled = false;
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function lockThiefPanel() {
  document.querySelectorAll('#thief-panel button').forEach((b) => { b.disabled = true; });
}

function thiefChoose(index, role) {
  if (!conn || !conn.open) return;
  if (!confirm(`Voler le rôle « ${role} » ?`)) return;
  lockThiefPanel();
  conn.send({ type: 'thiefSteal', choice: index });
}

function thiefSkip() {
  if (!conn || !conn.open) return;
  if (!confirm("Garder ton rôle de Voleur ?")) return;
  lockThiefPanel();
  conn.send({ type: 'thiefSteal', skip: true });
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
    ['cupid-panel', 'wolf-panel', 'witch-panel', 'vote-panel', 'thief-panel', 'seer-panel'].forEach(hidePanel);
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
  if (!confirm(`Unir ${cupidState.picked[0]} et ${cupidState.picked[1]} ?`)) return;
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
  const parts = [];
  if (witchState.save) parts.push(`sauver ${witchState.victim}`);
  if (witchState.poison) parts.push(`empoisonner ${witchState.poison}`);
  if (!confirm(parts.length ? `Confirmer : ${parts.join(' et ')} ?` : "Ne rien faire cette nuit ?")) return;
  document.querySelectorAll('#witch-panel button').forEach((b) => { b.disabled = true; });
  conn.send({ type: 'witchAction', save: witchState.save, poison: witchState.poison });
}

// --- Vote du village ---
let voteState = { targets: [], my: null, picked: null };

function showVotePanel(data) {
  hidePanel('seer-panel');   // au lever du jour, l'écran de la Voyante se ferme
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
  seerState = { targets, picked: null };
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
  if (!confirm(`Découvrir le rôle de ${seerState.picked} ? Tu ne peux observer qu'un seul joueur.`)) return;
  document.querySelectorAll('#seer-choose button').forEach((b) => { b.disabled = true; });
  conn.send({ type: 'seerChoice', target: seerState.picked });
}

function showSeerResult(name, role) {
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