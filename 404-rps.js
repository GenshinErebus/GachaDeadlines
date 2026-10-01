const logBox = document.getElementById('log-box');
const humanScoreEl = document.getElementById('human-score');
const aiScoreEl = document.getElementById('ai-score');
const interfaceBox = document.getElementById('interface-box');
const escapeLink = document.getElementById('escape-link');

const MOVES = { rock: '✊ ROCK', paper: '✋ PAPER', scissors: '✌️ SCISSORS' };
const BEATS = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
const WIN_TARGET = 3;

let humanScore = 0;
let aiScore = 0;
let duelOver = false;

/* ===== AUTO-SCROLL =====
   Hängt einen neuen Eintrag an den Log an und scrollt danach
   automatisch ans Ende, damit immer die neueste Konversation
   sichtbar ist. */
function addLog(text, cssClass) {
  const entry = document.createElement('div');
  entry.className = 'log-entry' + (cssClass ? ' ' + cssClass : '');
  entry.textContent = text;
  logBox.appendChild(entry);

  // requestAnimationFrame: erst rendern lassen, DANN scrollen
  requestAnimationFrame(() => {
    logBox.scrollTop = logBox.scrollHeight;
  });
}

function updateScoreBoard() {
  humanScoreEl.textContent = humanScore;
  aiScoreEl.textContent = aiScore;
}

function endDuel() {
  duelOver = true;
  addLog('[VICTORY] Firewall integrity 0%. SYN-ACK accepted. Routing path cleared!', 'log-win');
  interfaceBox.classList.add('hidden');
  escapeLink.classList.remove('hidden');

  // Escape-Button sicher in den Sichtbereich holen
  requestAnimationFrame(() => {
    escapeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
}

function playRound(humanMove) {
  if (duelOver) return;

  const moves = Object.keys(MOVES);
  const aiMove = moves[Math.floor(Math.random() * moves.length)];

  addLog('> YOU transmit: ' + MOVES[humanMove]);
  addLog('> FIREWALL counters: ' + MOVES[aiMove]);

  if (humanMove === aiMove) {
    addLog('[DRAW] Packets collide. No route established.');
  } else if (BEATS[humanMove] === aiMove) {
    humanScore++;
    updateScoreBoard();
    addLog('[WIN] Handshake accepted! Firewall packet dropped.', 'log-win');
    if (humanScore >= WIN_TARGET) {
      endDuel();
    }
  } else {
    aiScore++;
    updateScoreBoard();
    addLog('[ERROR] Packet rejected. Intrusion logged.', 'log-lose');
    if (aiScore >= WIN_TARGET) {
      humanScore = 0;
      aiScore = 0;
      updateScoreBoard();
      addLog('[PURGE] Firewall wins the session and flushes all sockets. Protocol re-initialized...', 'log-lose');
    }
  }
}

// Falls der Log beim Laden schon gefüllt ist: direkt ans Ende springen
logBox.scrollTop = logBox.scrollHeight;