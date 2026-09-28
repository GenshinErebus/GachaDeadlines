// ============================================
// GAME STATE MANAGEMENT
// ============================================
const scoreEl = document.getElementById('current-score');
const statusMsg = document.getElementById('status-msg');
const escapeBtn = document.getElementById('escape-btn');
const resetBtn = document.getElementById('reset-btn');

const tracks = [
  document.getElementById('track-0'),
  document.getElementById('track-1'),
  document.getElementById('track-2')
];

let score = 0;
let gameActive = true;
let nodes = [];
let spawnTimer;
let gameInterval;

// Core game settings
const nodeSpeed = 4; // Pixels fallen per frame
const targetMinY = 270; // Top boundary of hit zone
const targetMaxY = 320; // Bottom boundary of hit zone
const targetGoal = 25; // Score needed to win

// ============================================
// NODE SPAWNING LOGIC
// ============================================
function spawnNode() {
  if (!gameActive) return;

  // Random track selection (0, 1, or 2)
  const trackIdx = Math.floor(Math.random() * 3);

  const nodeEl = document.createElement('div');
  nodeEl.className = 'node';
  nodeEl.style.top = '0px';
  tracks[trackIdx].appendChild(nodeEl);

  nodes.push({
    element: nodeEl,
    track: trackIdx,
    y: 0
  });

  // Clear existing timer and set new random spawn interval
  clearInterval(spawnTimer);
  const nextSpawn = Math.floor(Math.random() * 800) + 600;
  spawnTimer = setInterval(spawnNode, nextSpawn);
}

// ============================================
// GAME UPDATE LOOP
// ============================================
function updateEngine() {
  if (!gameActive) return;

  // Iterate backwards to safely remove elements during loop
  for (let i = nodes.length - 1; i >= 0; i--) {
    let node = nodes[i];
    node.y += nodeSpeed;
    node.element.style.top = node.y + 'px';

    // Node fell past the hit zone without being intercepted
    if (node.y > 320) {
      node.element.remove();
      nodes.splice(i, 1);
      triggerMiss();
    }
  }
}

// ============================================
// PLAYER INPUT HANDLING
// ============================================
function triggerHitAttempt(trackIdx) {
  if (!gameActive) return;

  // Find all nodes in the selected track
  const laneNodes = nodes.filter(n => n.track === trackIdx);

  if (laneNodes.length > 0) {
    // Intercept the first (lowest) node in this lane
    const targetNode = laneNodes[0];

    // Check if node is within the valid hit zone
    if (targetNode.y >= targetMinY && targetNode.y <= targetMaxY) {
      score++;
      scoreEl.innerText = score;

      // Visual feedback: flash white then remove
      targetNode.element.style.backgroundColor = '#ffffff';
      setTimeout(() => targetNode.element.remove(), 50);

      nodes = nodes.filter(n => n !== targetNode);
      checkWinCondition();
    } else {
      // Tapped too early or too late
      triggerMiss();
    }
  } else {
    // No node in this lane - empty tap penalty
    triggerMiss();
  }
}

function triggerMiss() {
  // Penalty: lose one point (if score > 0)
  if (score > 0) {
    score--;
    scoreEl.innerText = score;
  }
}

function checkWinCondition() {
  if (score >= targetGoal) {
    // Victory! Stop the game
    gameActive = false;
    clearInterval(spawnTimer);
    clearInterval(gameInterval);

    // Clean up all remaining nodes
    nodes.forEach(n => n.element.remove());
    nodes = [];

    // Show success message and escape button
    statusMsg.innerHTML = "<span style='color: #00ff33; font-weight: bold;'>GRID_SYNC_COMPLETE: Stream Restored!</span>";
    escapeBtn.classList.remove('hidden');
  }
}

// ============================================
// INPUT EVENT LISTENERS (Cross-Platform)
// ============================================

// DESKTOP: Keyboard inputs (A/S/D keys)
document.addEventListener('keydown', (e) => {
  if (!gameActive) return;

  // Prevent browser default actions for game keys
  if (['a', 's', 'd'].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }

  // Map keys to lanes
  if (e.key.toLowerCase() === 'a') triggerHitAttempt(0);
  if (e.key.toLowerCase() === 's') triggerHitAttempt(1);
  if (e.key.toLowerCase() === 'd') triggerHitAttempt(2);
}, { capture: true });

// MOBILE/DESKTOP: Unified pointer events (works on ALL devices)
// pointerdown fires instantly on both touch and mouse
for (let i = 0; i < 3; i++) {
  const btn = document.getElementById(`btn-${i}`);

  btn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    triggerHitAttempt(i);
  }, { passive: false });
}

// ============================================
// GAME START/RESET FUNCTIONS
// ============================================
function startGame() {
  gameActive = true;
  score = 0;
  scoreEl.innerText = score;
  statusMsg.innerText = '';
  escapeBtn.classList.add('hidden');
  resetBtn.classList.add('hidden');

  // 60fps game loop for smooth animation
  gameInterval = setInterval(updateEngine, 1000 / 60);
  spawnTimer = setInterval(spawnNode, 500);
}

function resetGame() {
  // Cleanup current game state
  nodes.forEach(n => n.element.remove());
  nodes = [];
  clearInterval(spawnTimer);
  clearInterval(gameInterval);
  
  // Restart fresh
  startGame();
}

// Start the game immediately when page loads
startGame();