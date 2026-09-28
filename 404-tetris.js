// ============================================
// TETRIS GAME LOGIC
// ============================================

const canvas = document.getElementById('tetrisCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('current-score');
const highscoreEl = document.getElementById('highscore');
const escapeBtn = document.getElementById('escape-btn');
const resetBtn = document.getElementById('reset-btn');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 24;
const GOAL_ROWS = 2; // Target rows to unlock escape option

// Game state variables
let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let score = 0;
let highscore = parseInt(localStorage.getItem('tetris_highscore')) || 0;
let isGameOver = false;
let goalReached = false;
let dropCounter = 0;
let dropInterval = 1000; // Drop speed in milliseconds
let lastTime = 0;

// Initialize highscore display
highscoreEl.innerText = highscore;

// Tetromino shapes (all 7 standard pieces)
const SHAPES = [
  [[1,1,1,1]],         // I
  [[1,1,1],[0,1,0]],   // T
  [[1,1,1],[1,0,0]],   // L
  [[1,1,1],[0,0,1]],   // J
  [[1,1],[1,1]],       // O
  [[1,1,0],[0,1,1]],   // S
  [[0,1,1],[1,1,0]]    // Z
];

let piece = { matrix: null, x: 0, y: 0 };

// Create a new random piece
function createPiece() {
  const idx = Math.floor(Math.random() * SHAPES.length);
  piece.matrix = SHAPES[idx];
  piece.y = 0;
  piece.x = Math.floor((COLS - piece.matrix[0].length) / 2);

  // Check if piece spawns inside existing blocks (game over condition)
  if (checkCollision(piece.matrix, piece.x, piece.y)) {
    isGameOver = true;
    handleGameOver();
  }
}

// Check collision with walls, floor, or existing blocks
function checkCollision(matrix, offsetX, offsetY) {
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] !== 0) {
        let nextX = offsetX + c;
        let nextY = offsetY + r;
        // Check boundaries
        if (nextX < 0 || nextX >= COLS || nextY >= ROWS) return true;
        // Check against existing grid blocks (ignore negative y during spawn)
        if (nextY >= 0 && grid[nextY][nextX] !== 0) return true;
      }
    }
  }
  return false;
}

// Merge current piece into the grid
function mergePiece() {
  piece.matrix.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value !== 0) grid[piece.y + r][piece.x + c] = 1;
    });
  });
}

// Move piece down by one row
function playerDrop() {
  if (isGameOver) return;
  piece.y++;
  if (checkCollision(piece.matrix, piece.x, piece.y)) {
    piece.y--; // Step back up
    mergePiece(); // Lock piece in place
    clearRows(); // Check for completed rows
    createPiece(); // Spawn new piece
  }
  dropCounter = 0;
}

// Move piece left or right
function playerMove(dir) {
  if (isGameOver) return;
  piece.x += dir;
  if (checkCollision(piece.matrix, piece.x, piece.y)) piece.x -= dir;
}

// Rotate piece 90 degrees clockwise
function playerRotate() {
  if (isGameOver) return;
  const rotated = piece.matrix[0].map((_, i) => piece.matrix.map(row => row[i]).reverse());
  if (!checkCollision(rotated, piece.x, piece.y)) {
    piece.matrix = rotated;
  }
}

// Check and clear completed rows, update score
function clearRows() {
  let rowsCleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (grid[r].every(value => value !== 0)) {
      grid.splice(r, 1); // Remove full row
      grid.unshift(Array(COLS).fill(0)); // Add new empty row at top
      r++; // Re-check current index since rows shifted down
      rowsCleared++;
    }
  }
  if (rowsCleared > 0) {
    score += rowsCleared;
    scoreEl.innerText = score;
    
    // Goal reached (2+ rows cleared) - show escape button, keep playing!
    if (score >= GOAL_ROWS && !goalReached) {
      goalReached = true;
      escapeBtn.classList.remove('hidden'); // Show "RUN" button
      // Game continues automatically - no pause needed
    }
  }
}

// Handle game over - save highscore and show reset button
function handleGameOver() {
  // Update highscore if current score is better
  if (score > highscore) {
    highscore = score;
    localStorage.setItem('tetris_highscore', highscore);
    highscoreEl.innerText = highscore;
  }
  
  resetBtn.classList.remove('hidden'); // Show reset button
  escapeBtn.classList.add('hidden'); // Hide escape button on game over
}

// Keyboard controls (WASD + Arrow keys)
document.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
  if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') playerMove(-1);
  if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') playerMove(1);
  if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') playerDrop();
  if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') playerRotate();
});

// Touch controls for mobile buttons
document.getElementById('left-btn').addEventListener('touchstart', (e) => { e.preventDefault(); playerMove(-1); });
document.getElementById('right-btn').addEventListener('touchstart', (e) => { e.preventDefault(); playerMove(1); });
document.getElementById('rotate-btn').addEventListener('touchstart', (e) => { e.preventDefault(); playerRotate(); });
document.getElementById('drop-btn').addEventListener('touchstart', (e) => { e.preventDefault(); playerDrop(); });

// Click controls for desktop buttons
document.getElementById('left-btn').addEventListener('click', () => playerMove(-1));
document.getElementById('right-btn').addEventListener('click', () => playerMove(1));
document.getElementById('rotate-btn').addEventListener('click', () => playerRotate());
document.getElementById('drop-btn').addEventListener('click', () => playerDrop());

// Draw the locked blocks in the grid
function drawGrid() {
  grid.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value !== 0) {
        ctx.fillStyle = '#0c2c0e';
        ctx.strokeStyle = '#00ff33';
        ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
        ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
      }
    });
  });
}

// Draw the current falling piece with glow effect
function drawPiece() {
  if (!piece.matrix) return;
  ctx.fillStyle = '#00ff33';
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#00ff33';
  piece.matrix.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value !== 0) {
        ctx.fillRect((piece.x + c) * BLOCK_SIZE, (piece.y + r) * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
      }
    });
  });
  ctx.shadowBlur = 0;
}

// Display game over screen on canvas
function showGameOverScreen() {
  ctx.fillStyle = '#ff3333';
  ctx.shadowColor = '#ff3333';
  ctx.shadowBlur = 8;
  ctx.font = '16px "Courier New"';
  ctx.textAlign = 'center';
  ctx.fillText('STACK_OVERFLOW', canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = '12px "Courier New"';
  ctx.fillText(`HIGHSCORE: ${highscore}`, canvas.width / 2, canvas.height / 2 + 10);
  ctx.fillText('Click Reset to wipe buffer', canvas.width / 2, canvas.height / 2 + 25);
  ctx.shadowBlur = 0;
}

// Main game loop using requestAnimationFrame
function renderLoop(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) playerDrop();
  
  // Clear canvas
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw game elements
  drawGrid();
  drawPiece();
  
  // Continue loop or show game over
  if (isGameOver) {
    showGameOverScreen();
  } else {
    requestAnimationFrame(renderLoop);
  }
}

// Reset the entire game state
function resetGame() {
  grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  score = 0;
  scoreEl.innerText = score;
  goalReached = false;
  isGameOver = false;
  escapeBtn.classList.add('hidden');
  resetBtn.classList.add('hidden');
  createPiece();
  lastTime = performance.now();
  renderLoop();
}

// Start the game on load
resetGame();