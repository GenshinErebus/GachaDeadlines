const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const userScoreEl = document.getElementById('user-score');
const aiScoreEl = document.getElementById('ai-score');
const escapeBtn = document.getElementById('escape-btn');

// Game objects configurations
const paddleWidth = 10;
const paddleHeight = 80;
const ballRadius = 7;

/* ===== PHYSICS CONSTANTS - TUNED FOR STABILITY ===== */
const AI_TRACKING = 0.05;
const AI_MAX_SPEED = 4;
const AI_AIM_ERROR = 36;

// CRITICAL FIX: Reduced max speed to prevent tunneling
// Ball diameter is 14px - must stay below 14px/frame to avoid passing through paddles
const BALL_SPEEDUP = 1.02;
const BALL_MAX_SPEED_X = 9;   // REDUCED: was 11 - keeps ball manageable
const BALL_ANGLE = 4;
const MAX_BOUNCE_ANGLE = 0.7;

// NEW: Minimum horizontal speed to keep ball moving toward paddles
const MIN_BALL_SPEED_X = 3;

let user = { x: 15, y: 0, score: 0 };
let ai = { x: 0, y: 0, score: 0 };
let ball = { x: 0, y: 0, speedX: 4, speedY: 4 };

let aiAimOffset = 0;
function randomizeAiAim() {
  aiAimOffset = (Math.random() * 2 - 1) * AI_AIM_ERROR;
}

// --- RESPONSIVE CANVAS RESIZER ---
function resizeCanvas() {
  const maxWidth = Math.min(window.innerWidth - 24, window.innerWidth * 0.95);
  const maxHeight = window.innerHeight - 200;

  let targetWidth, targetHeight;

  if (window.innerWidth >= 1200) {
    targetHeight = Math.min(window.innerHeight * 0.70, 1100 / 1.5);
    targetWidth = targetHeight * 1.5;
  } else if (window.innerWidth >= 769) {
    targetHeight = Math.min(window.innerHeight * 0.68, 780 / 1.5);
    targetWidth = targetHeight * 1.5;
  } else if (window.innerWidth >= 481) {
    targetHeight = Math.min(window.innerHeight * 0.60, 500 / 1.5);
    targetWidth = targetHeight * 1.5;
  } else {
    targetWidth = Math.min(window.innerWidth - 20, 300);
    targetHeight = targetWidth / 1.5;
  }

  canvas.width = Math.floor(targetWidth);
  canvas.height = Math.floor(targetHeight);

  user.x = canvas.width * 0.025;
  ai.x = canvas.width - canvas.width * 0.025 - paddleWidth;
  user.y = canvas.height / 2 - paddleHeight / 2;
  ai.y = canvas.height / 2 - paddleHeight / 2;

  if (!isGameRunning) {
    resetBall();
  }
}

// --- RESPONSIVE CONTROLS SYSTEM ---

function processInputY(clientY) {
  const rect = canvas.getBoundingClientRect();
  const relativeY = clientY - rect.top;
  const canvasScaleFactor = canvas.height / rect.height;
  const targetCanvasY = relativeY * canvasScaleFactor;

  user.y = Math.max(0, Math.min(canvas.height - paddleHeight, targetCanvasY - paddleHeight / 2));
}

canvas.addEventListener('mousemove', (e) => {
  processInputY(e.clientY);
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  if (e.touches.length > 0) {
    processInputY(e.touches[0].clientY);
  }
}, { passive: false });

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (e.touches.length > 0) {
    processInputY(e.touches[0].clientY);
  }
}, { passive: false });

// --- BASE PONG ENGINE ---

let isGameRunning = false;

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  // Ensure minimum speed to prevent ball from stalling
  ball.speedX = (Math.random() > 0.5 ? 1 : -1) * MIN_BALL_SPEED_X;
  ball.speedY = (Math.random() * 2 - 1) * 2;
  randomizeAiAim();
}

function checkCollision(b, p) {
  return b.x + ballRadius > p.x &&
         b.x - ballRadius < p.x + paddleWidth &&
         b.y + ballRadius > p.y &&
         b.y - ballRadius < p.y + paddleHeight;
}

// NEW: Safety function to keep ball inside canvas bounds
function clampBallToCanvas() {
  if (ball.y - ballRadius < 0) {
    ball.y = ballRadius;
    ball.speedY = Math.abs(ball.speedY);
  }
  if (ball.y + ballRadius > canvas.height) {
    ball.y = canvas.height - ballRadius;
    ball.speedY = -Math.abs(ball.speedY);
  }
  // Fix X position if ball somehow teleports outside
  if (ball.x < -ballRadius * 2) {
    ball.x = -ballRadius; // Position just outside left edge for scoring
  }
  if (ball.x > canvas.width + ballRadius * 2) {
    ball.x = canvas.width + ballRadius; // Position just outside right edge for scoring
  }
}

function update() {
  // Apply movement
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // TOP AND BOTTOM WALL COLLISION
  if (ball.y - ballRadius < 0 || ball.y + ballRadius > canvas.height) {
    ball.speedY = -ball.speedY;
    // Clamp position to prevent sticking to wall
    if (ball.y - ballRadius < 0) {
      ball.y = ballRadius;
    } else if (ball.y + ballRadius > canvas.height) {
      ball.y = canvas.height - ballRadius;
    }
  }

  // AI MOVEMENT - Only track when ball is approaching
  const aiTarget = ball.speedX > 0
    ? ball.y - paddleHeight / 2 + aiAimOffset
    : canvas.height / 2 - paddleHeight / 2;
  const aiStep = (aiTarget - ai.y) * AI_TRACKING;
  ai.y += Math.max(-AI_MAX_SPEED, Math.min(AI_MAX_SPEED, aiStep));
  ai.y = Math.max(0, Math.min(canvas.height - paddleHeight, ai.y));

  // PADDLE COLLISION DETECTION
  let player = (ball.x < canvas.width / 2) ? user : ai;

  if (checkCollision(ball, player)) {
    // Determine direction based on who was hit
    const isUserPaddle = (player === user);
    
    // Calculate hit point for angle variation
    let hitPoint = ball.y - (player.y + paddleHeight / 2);
    hitPoint = hitPoint / (paddleHeight / 2);
    hitPoint = Math.max(-MAX_BOUNCE_ANGLE, Math.min(MAX_BOUNCE_ANGLE, hitPoint));
    
    // Apply new angle
    ball.speedY = hitPoint * BALL_ANGLE;
    
    // Increase speed but enforce maximum
    ball.speedX = -ball.speedX * BALL_SPEEDUP;
    ball.speedX = Math.max(-BALL_MAX_SPEED_X, Math.min(BALL_MAX_SPEED_X, ball.speedX));
    
    // Ensure minimum speed (prevent ball from stalling)
    if (Math.abs(ball.speedX) < MIN_BALL_SPEED_X) {
      ball.speedX = Math.sign(ball.speedX) * MIN_BALL_SPEED_X;
    }
    
    // CRITICAL FIX: Push ball OUTSIDE paddle to prevent double-collision and teleportation
    if (isUserPaddle) {
      // Ball is on left side, push it to right of paddle
      ball.x = user.x + paddleWidth + ballRadius + 1;
    } else {
      // Ball is on right side, push it to left of paddle
      ball.x = ai.x - ballRadius - 1;
    }
    
    // Re-roll AI aim for next exchange
    if (isUserPaddle) {
      randomizeAiAim();
    }
  }

  // Score detection - ball went past paddle
  if (ball.x - ballRadius < 0) {
    ai.score++;
    aiScoreEl.innerText = ai.score;
    resetBall();
  } else if (ball.x + ballRadius > canvas.width) {
    user.score++;
    userScoreEl.innerText = user.score;
    resetBall();
  }
  
  // Run safety check AFTER all calculations
  clampBallToCanvas();
}

function draw() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(0, 255, 51, 0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();

  ctx.fillStyle = '#00ff33';
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#00ff33';

  ctx.fillRect(user.x, user.y, paddleWidth, paddleHeight);
  ctx.fillRect(ai.x, ai.y, paddleWidth, paddleHeight);

  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
}

function gameLoop() {
  if (isGameRunning) {
    update();
  }
  draw();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  if (!isGameRunning) {
    isGameRunning = true;
    escapeBtn.style.opacity = '0.6';
  }
}

canvas.addEventListener('click', startGame);
canvas.addEventListener('touchstart', startGame, { passive: true });

// Initialize
resizeCanvas();
resetBall();
gameLoop();
isGameRunning = false;

let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    resizeCanvas();
  }, 150);
});