// ============================================
// PAC-MAN GAME LOGIC - WITH 3 LIVES SYSTEM
// ============================================

const canvas = document.getElementById('pacmanCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('current-score');
const highscoreEl = document.getElementById('highscore');
const levelEl = document.getElementById('level');
const restartBtn = document.getElementById('restart-btn');
const homeBtn = document.getElementById('home-btn');

// Game constants
const TILE_SIZE = 20;
const COLS = 20;
const ROWS = 20;
const PACMAN_SPEED = 2.5;
const GHOST_SPEED = 1.8;

// Score settings
const DOT_POINTS = 10;
const POWER_DOT_POINTS = 50;
const GHOST_POINTS = 200;
const WIN_LEVEL_SCORE = 500;
const LEVEL_TO_UNLOCK = 2; // Home button at level 2

// Life system
const MAX_LIVES = 3;
let lives = MAX_LIVES; // Start with 3 lives

// Load highscore from local storage
let highscore = parseInt(localStorage.getItem('pacman_highscore')) || 0;
highscoreEl.innerText = highscore;

// Game state
let score = 0;
let level = 1;
let isGameOver = false;
let homeUnlocked = false; // Track if escape is permanently unlocked
let maze = [];
let pacman = { x: 0, y: 0, direction: 'right', nextDirection: 'right' };
let ghosts = [];
let dots = [];
let powerDots = [];
let poweredGhosts = false;
let powerTimer = 0;
let invincibleTimer = 0; // Invincibility frames after respawn

// Ghost colors for variety
const GHOST_COLORS = ['#ff0000', '#00ffff', '#ffb8ff', '#ffb852'];

// ============================================
// DISPLAY UPDATE FUNCTIONS
// ============================================
function updateLivesDisplay() {
  // Add lives to score board
  let livesStr = 'LIVES: ';
  for (let i = 0; i < lives; i++) {
    livesStr += '❤️ ';
  }
  scoreEl.innerHTML = `${score} | ${livesStr}`;
}

// ============================================
// IMPROVED MAZE GENERATION - CONNECTED PATHS
// ============================================
function generateMaze(levelNum) {
  maze = [];
  dots = [];
  powerDots = [];
  
  // Initialize empty maze (all walkable)
  for (let row = 0; row < ROWS; row++) {
    maze[row] = [];
    for (let col = 0; col < COLS; col++) {
      maze[row][col] = 0;
    }
  }
  
  // Build outer walls
  for (let i = 0; i < COLS; i++) {
    maze[0][i] = 1;
    maze[ROWS - 1][i] = 1;
  }
  for (let j = 0; j < ROWS; j++) {
    maze[j][0] = 1;
    maze[j][COLS - 1] = 1;
  }
  
  // Create symmetrical internal walls (ensures connectivity)
  const wallPatterns = [
    // Horizontal barriers with gaps
    [[3, 5, 7, 8, 9, 10, 11, 12, 13], [5]],
    [[3, 5, 6, 7, 8, 11, 12, 13, 14], [5]],
    [[4, 5, 6, 10, 11, 12, 13], [7, 10]],
    [[3, 4, 8, 9, 10, 14, 15], [6, 11]],
    [[2, 3, 4, 12, 13, 14, 15], [6, 7, 11]],
  ];
  
  const difficulty = Math.min(levelNum, wallPatterns.length);
  for (let i = 0; i < difficulty; i++) {
    const row = 4 + i * 3;
    if (row < ROWS - 2) {
      const cols = wallPatterns[i][0];
      cols.forEach(col => {
        if (col > 1 && col < COLS - 1) {
          maze[row][col] = 1;
          maze[row + 1][col] = 1;
        }
      });
    }
  }
  
  // Clear spawn area for Pac-Man
  for (let r = 2; r <= 4; r++) {
    for (let c = 2; c <= 4; c++) {
      maze[r][c] = 0;
    }
  }
  
  // Clear center ghost house area
  for (let r = 8; r <= 12; r++) {
    for (let c = 8; c <= 12; c++) {
      maze[r][c] = 0;
    }
  }
  
  // Place dots in ALL walkable areas (excluding spawn zones)
  for (let row = 1; row < ROWS - 1; row++) {
    for (let col = 1; col < COLS - 1; col++) {
      // Skip spawn areas
      if ((row <= 4 && col <= 4) || (row >= 8 && row <= 12 && col >= 8 && col <= 12)) {
        continue;
      }
      
      // Place dot in walkable cells with some randomness
      if (maze[row][col] === 0 && Math.random() < 0.6) {
        dots.push({ x: col, y: row, collectible: true });
      }
    }
  }
  
  // Ensure at least 50 dots exist (for fair gameplay)
  while (dots.length < 50) {
    let randomRow = Math.floor(Math.random() * (ROWS - 4)) + 2;
    let randomCol = Math.floor(Math.random() * (COLS - 4)) + 2;
    
    if (maze[randomRow][randomCol] === 0 && 
        !(randomRow <= 4 && randomCol <= 4) &&
        !(randomRow >= 8 && randomRow <= 12 && randomCol >= 8 && randomCol <= 12)) {
      
      // Check if dot already exists here
      let exists = dots.some(d => d.x === randomCol && d.y === randomRow);
      if (!exists) {
        dots.push({ x: randomCol, y: randomRow, collectible: true });
      }
    }
  }
  
  // Place power dots in 4 corners of walkable area
  const cornerPositions = [[2, 2], [COLS - 3, 2], [2, ROWS - 3], [COLS - 3, ROWS - 3]];
  cornerPositions.forEach(pos => {
    if (maze[pos[1]][pos[0]] === 0) {
      // Remove any regular dot there first
      dots = dots.filter(d => !(d.x === pos[0] && d.y === pos[1]));
      powerDots.push({ x: pos[0], y: pos[1] });
    }
  });
}

// ============================================
// INIT & RESET FUNCTIONS
// ============================================
function initGame() {
  score = 0;
  level = 1;
  lives = MAX_LIVES; // Reset lives to 3
  isGameOver = false;
  homeUnlocked = false;
  
  scoreEl.innerText = score;
  levelEl.innerText = level;
  updateLivesDisplay();
  
  generateMaze(level);
  resetPacman();
  resetGhosts();
  
  restartBtn.classList.add('hidden');
  homeBtn.classList.add('hidden');
}

function resetPacman() {
  pacman.x = TILE_SIZE * 3;
  pacman.y = TILE_SIZE * 3;
  pacman.direction = 'right';
  pacman.nextDirection = 'right';
  invincibleTimer = 120; // 2 seconds invincibility (60fps)
}

function resetGhosts() {
  ghosts = [];
  const numGhosts = Math.min(4, 2 + Math.floor(level / 2));
  const ghostSpawnPositions = [
    { x: TILE_SIZE * 10, y: TILE_SIZE * 10 },
    { x: TILE_SIZE * 9, y: TILE_SIZE * 10 },
    { x: TILE_SIZE * 11, y: TILE_SIZE * 10 },
    { x: TILE_SIZE * 10, y: TILE_SIZE * 9 }
  ];
  
  for (let i = 0; i < numGhosts; i++) {
    ghosts.push({
      x: ghostSpawnPositions[i % ghostSpawnPositions.length].x,
      y: ghostSpawnPositions[i % ghostSpawnPositions.length].y,
      color: GHOST_COLORS[i % GHOST_COLORS.length],
      direction: ['left', 'right', 'up', 'down'][i % 4],
      scared: false,
      moveTimer: 0
    });
  }
}

// ============================================
// MOVEMENT & COLLISION
// ============================================
function canMove(x, y) {
  let col = Math.round(x / TILE_SIZE);
  let row = Math.round(y / TILE_SIZE);
  
  if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return false;
  return maze[row][col] === 0;
}

function checkDotCollision() {
  for (let i = dots.length - 1; i >= 0; i--) {
    let dot = dots[i];
    if (!dot.collectible) continue;
    
    let dx = Math.abs((pacman.x + TILE_SIZE/2) / TILE_SIZE - dot.x);
    let dy = Math.abs((pacman.y + TILE_SIZE/2) / TILE_SIZE - dot.y);
    
    if (dx < 0.6 && dy < 0.6) {
      dot.collectible = false;
      dots.splice(i, 1);
      score += DOT_POINTS;
      updateLivesDisplay();
      
      if (dots.length === 0 && powerDots.length === 0) {
        setTimeout(levelComplete, 500);
      }
    }
  }
}

function checkPowerDotCollision() {
  for (let i = powerDots.length - 1; i >= 0; i--) {
    let dot = powerDots[i];
    let dx = Math.abs((pacman.x + TILE_SIZE/2) / TILE_SIZE - dot.x);
    let dy = Math.abs((pacman.y + TILE_SIZE/2) / TILE_SIZE - dot.y);
    
    if (dx < 0.6 && dy < 0.6) {
      powerDots.splice(i, 1);
      score += POWER_DOT_POINTS;
      updateLivesDisplay();
      
      poweredGhosts = true;
      powerTimer = 500;
      ghosts.forEach(g => g.scared = true);
      
      if (powerDots.length === 0 && dots.length === 0) {
        setTimeout(levelComplete, 500);
      }
    }
  }
}

function handleLifeLost() {
  lives--;
  updateLivesDisplay();
  
  if (lives <= 0) {
    // Real game over - no more lives
    isGameOver = true;
    
    if (score > highscore) {
      highscore = score;
      localStorage.setItem('pacman_highscore', highscore);
      highscoreEl.innerText = highscore;
    }
    
    restartBtn.classList.remove('hidden');
    
    if (!homeUnlocked) {
      homeBtn.classList.add('hidden');
    }
  } else {
    // Lose one life, respawn Pac-Man
    resetPacman();
    resetGhosts();
    
    // Brief pause before continuing
    isGameOver = true;
    setTimeout(() => {
      if (!isGameOver || lives > 0) {
        isGameOver = false;
      }
    }, 2000);
  }
}

function checkGhostCollision() {
  if (invincibleTimer > 0) return; // Pac-Man is invincible
  
  for (let ghost of ghosts) {
    let dx = Math.abs(pacman.x - ghost.x);
    let dy = Math.abs(pacman.y - ghost.y);
    let distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < TILE_SIZE * 0.8) {
      if (ghost.scared) {
        // Eat ghost - send back to spawn
        ghost.x = TILE_SIZE * 10;
        ghost.y = TILE_SIZE * 10;
        ghost.scared = false;
        score += GHOST_POINTS;
        updateLivesDisplay();
      } else {
        // Hit by ghost - lose one life
        handleLifeLost();
      }
    }
  }
}

function updatePacman() {
  if (invincibleTimer > 0) invincibleTimer--;
  
  let newX = pacman.x;
  let newY = pacman.y;
  
  switch (pacman.nextDirection) {
    case 'up': newY -= PACMAN_SPEED; break;
    case 'down': newY += PACMAN_SPEED; break;
    case 'left': newX -= PACMAN_SPEED; break;
    case 'right': newX += PACMAN_SPEED; break;
  }
  
  if (canMove(newX, newY)) {
    pacman.x = newX;
    pacman.y = newY;
    pacman.direction = pacman.nextDirection;
  } else {
    newX = pacman.x;
    newY = pacman.y;
    switch (pacman.direction) {
      case 'up': newY -= PACMAN_SPEED; break;
      case 'down': newY += PACMAN_SPEED; break;
      case 'left': newX -= PACMAN_SPEED; break;
      case 'right': newX += PACMAN_SPEED; break;
    }
    
    if (canMove(newX, newY)) {
      pacman.x = newX;
      pacman.y = newY;
    }
  }
}

function updateGhosts() {
  ghosts.forEach(ghost => {
    ghost.moveTimer++;
    
    if (ghost.moveTimer > 25) {
      const directions = ['up', 'down', 'left', 'right'];
      ghost.direction = directions[Math.floor(Math.random() * directions.length)];
      ghost.moveTimer = 0;
    }
    
    let newX = ghost.x;
    let newY = ghost.y;
    
    switch (ghost.direction) {
      case 'up': newY -= GHOST_SPEED; break;
      case 'down': newY += GHOST_SPEED; break;
      case 'left': newX -= GHOST_SPEED; break;
      case 'right': newX += GHOST_SPEED; break;
    }
    
    if (canMove(newX, newY)) {
      ghost.x = newX;
      ghost.y = newY;
    } else {
      const directions = ['up', 'down', 'left', 'right'];
      ghost.direction = directions[Math.floor(Math.random() * directions.length)];
    }
    
    if (poweredGhosts) {
      powerTimer--;
      if (powerTimer <= 0) {
        poweredGhosts = false;
        ghosts.forEach(g => g.scared = false);
      }
    }
  });
}

// ============================================
// DRAWING FUNCTIONS
// ============================================
function drawMaze() {
  ctx.strokeStyle = '#0000ff';
  ctx.lineWidth = 2;
  
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (maze[row][col] === 1) {
        ctx.fillStyle = '#1a1a4a';
        ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        ctx.strokeRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

function drawDots() {
  ctx.fillStyle = '#ffb8ae';
  dots.forEach(dot => {
    ctx.beginPath();
    ctx.arc(dot.x * TILE_SIZE + TILE_SIZE/2, dot.y * TILE_SIZE + TILE_SIZE/2, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawPowerDots() {
  const blink = Math.sin(Date.now() / 100) > 0;
  powerDots.forEach(dot => {
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = blink ? 15 : 0;
    ctx.shadowColor = '#ffffff';
    ctx.beginPath();
    ctx.arc(dot.x * TILE_SIZE + TILE_SIZE/2, dot.y * TILE_SIZE + TILE_SIZE/2, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  });
}

function drawPacman() {
  const centerX = pacman.x + TILE_SIZE/2;
  const centerY = pacman.y + TILE_SIZE/2;
  const radius = TILE_SIZE/2 - 2;
  const mouthAngle = Math.abs(Math.sin(Date.now() / 80)) * 0.6;
  
  // Flash when invincible
  if (invincibleTimer > 0 && Math.floor(Date.now() / 100) % 2 === 0) {
    ctx.globalAlpha = 0.5;
  }
  
  let startAngle = 0;
  switch (pacman.direction) {
    case 'right': startAngle = mouthAngle; break;
    case 'left': startAngle = Math.PI + mouthAngle; break;
    case 'up': startAngle = -Math.PI/2 + mouthAngle; break;
    case 'down': startAngle = Math.PI/2 + mouthAngle; break;
  }
  
  ctx.fillStyle = '#ffff00';
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#ffff00';
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, startAngle, startAngle + Math.PI*2 - mouthAngle*2);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1.0;
}

function drawLivesDisplay() {
  // Draw lives near spawn area
  ctx.fillStyle = '#ffff00';
  ctx.font = '14px "Courier New"';
  ctx.textAlign = 'left';
  ctx.fillText('❤️'.repeat(lives), TILE_SIZE * 2, TILE_SIZE * 6);
}

function drawGhosts() {
  ghosts.forEach(ghost => {
    const centerX = ghost.x + TILE_SIZE/2;
    const centerY = ghost.y + TILE_SIZE/2;
    
    ctx.fillStyle = ghost.scared ? '#0000ff' : ghost.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = ghost.scared ? '#0000ff' : ghost.color;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY - 2, TILE_SIZE/2 - 2, Math.PI, 0);
    ctx.lineTo(centerX + TILE_SIZE/2 - 2, centerY + TILE_SIZE/2 - 2);
    
    for (let i = 1; i <= 3; i++) {
      const waveX = centerX + (TILE_SIZE/2 - 2) - (i * TILE_SIZE/6);
      const waveY = centerY + TILE_SIZE/2 - 2 + (i % 2 === 0 ? 0 : 3);
      ctx.lineTo(waveX, waveY);
    }
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX - 4, centerY - 4, 3, 0, Math.PI*2);
    ctx.arc(centerX + 4, centerY - 4, 3, 0, Math.PI*2);
    ctx.fill();
    
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(centerX - 4, centerY - 4, 1.5, 0, Math.PI*2);
    ctx.arc(centerX + 4, centerY - 4, 1.5, 0, Math.PI*2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
  });
}

function drawGameOver() {
  ctx.fillStyle = '#ff0000';
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#ff0000';
  ctx.font = 'bold 24px "Courier New"';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2 - 20);
  
  ctx.font = '14px "Courier New"';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2 + 10);
  ctx.fillText('All lives lost - Click Restart', canvas.width/2, canvas.height/2 + 30);
  
  ctx.shadowBlur = 0;
}

function drawPaused() {
  ctx.fillStyle = '#ffffff';
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#ffffff';
  ctx.font = 'bold 20px "Courier New"';
  ctx.textAlign = 'center';
  ctx.fillText('Respawning...', canvas.width/2, canvas.height/2);
  ctx.font = '12px "Courier New"';
  ctx.fillText(`Lives remaining: ${lives}`, canvas.width/2, canvas.height/2 + 25);
  ctx.shadowBlur = 0;
}

// ============================================
// GAME FLOW - FIXED ESCAPE LOGIC
// ============================================
function levelComplete() {
  level++;
  score += WIN_LEVEL_SCORE;
  levelEl.innerText = level;
  updateLivesDisplay();
  
  // UNLOCK ESCAPE IMMEDIATELY at level 2 - FIX FOR PERMANENT ACCESS
  if (level >= LEVEL_TO_UNLOCK && !homeUnlocked) {
    homeUnlocked = true;
    homeBtn.classList.remove('hidden'); // Show button NOW - stays visible forever
  }
  
  generateMaze(level);
  resetPacman();
  resetGhosts();
}

function handleGameOver() {
  isGameOver = true;
  
  if (score > highscore) {
    highscore = score;
    localStorage.setItem('pacman_highscore', highscore);
    highscoreEl.innerText = highscore;
  }
  
  // Show restart button
  restartBtn.classList.remove('hidden');
  
  // Keep home button visible if already unlocked!
  if (!homeUnlocked) {
    homeBtn.classList.add('hidden');
  }
}

function gameLoop() {
  if (!isGameOver) {
    updatePacman();
    updateGhosts();
    checkDotCollision();
    checkPowerDotCollision();
    checkGhostCollision();
    
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawMaze();
    drawDots();
    drawPowerDots();
    drawPacman();
    drawGhosts();
  } else if (lives > 0 && invincibleTimer > 0) {
    // Pause screen between deaths
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawPaused();
  } else {
    drawGameOver();
  }
  
  requestAnimationFrame(gameLoop);
}

function resetGame() {
  initGame();
}

// ============================================
// CONTROLS - Keyboard + Touch
// ============================================
document.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }
  
  switch (e.key) {
    case 'ArrowUp': case 'w': case 'W': pacman.nextDirection = 'up'; break;
    case 'ArrowDown': case 's': case 'S': pacman.nextDirection = 'down'; break;
    case 'ArrowLeft': case 'a': case 'A': pacman.nextDirection = 'left'; break;
    case 'ArrowRight': case 'd': case 'D': pacman.nextDirection = 'right'; break;
  }
});

// Button controls
['up-btn', 'down-btn', 'left-btn', 'right-btn'].forEach((id, i) => {
  const dirs = ['up', 'down', 'left', 'right'];
  const btn = document.getElementById(id);
  btn.addEventListener('click', () => { pacman.nextDirection = dirs[i]; });
  btn.addEventListener('touchstart', (e) => { e.preventDefault(); pacman.nextDirection = dirs[i]; });
});

// START GAME
initGame();
gameLoop();