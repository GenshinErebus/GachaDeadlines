    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');

    const userScoreEl = document.getElementById('user-score');
    const aiScoreEl = document.getElementById('ai-score');
    const escapeBtn = document.getElementById('escape-btn');

    // Game objects configurations
    const paddleWidth = 10;
    const paddleHeight = 80;
    const ballRadius = 7;

    let user = { x: 15, y: 0, score: 0 };
    let ai = { x: 0, y: 0, score: 0 };
    let ball = { x: 0, y: 0, speedX: 4, speedY: 4, speedMultiplier: 1.05 };

    // --- RESPONSIVE CANVAS RESIZER ---
    function resizeCanvas() {
      // Get viewport dimensions minus paddings
      const maxWidth = Math.min(window.innerWidth - 24, window.innerWidth * 0.95);
      const maxHeight = window.innerHeight - 200; // Reserve space for header + buttons
      
      // Aspect ratio preserved from original 600x400 = 1.5:1
      let targetWidth, targetHeight;

      if (window.innerWidth >= 1200) {
        // Large Desktop: Canvas bis zu 75vh, max 1100px
        targetHeight = Math.min(window.innerHeight * 0.70, 1100 / 1.5);
        targetWidth = targetHeight * 1.5;
      } else if (window.innerWidth >= 769) {
        // Desktop: ~70vh, max 780px
        targetHeight = Math.min(window.innerHeight * 0.68, 780 / 1.5);
        targetWidth = targetHeight * 1.5;
      } else if (window.innerWidth >= 481) {
        // Tablet: ~60vh
        targetHeight = Math.min(window.innerHeight * 0.60, 500 / 1.5);
        targetWidth = targetHeight * 1.5;
      } else {
        // Mobile: bis zu 95vw Breite
        targetWidth = Math.min(window.innerWidth - 20, 300);
        targetHeight = targetWidth / 1.5;
      }

      // Set logical canvas size (internal resolution)
      canvas.width = Math.floor(targetWidth);
      canvas.height = Math.floor(targetHeight);

      // Update game object positions
      user.x = canvas.width * 0.025;
      ai.x = canvas.width - canvas.width * 0.025 - paddleWidth;
      user.y = canvas.height / 2 - paddleHeight / 2;
      ai.y = canvas.height / 2 - paddleHeight / 2;
      
      // Ball resets to new center
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
      ball.speedX = Math.random() > 0.5 ? 4 : -4; 
      ball.speedY = (Math.random() * 2 - 1) * 3;
    }

    function checkCollision(b, p) {
      return b.x + ballRadius > p.x && 
             b.x - ballRadius < p.x + paddleWidth && 
             b.y + ballRadius > p.y && 
             b.y - ballRadius < p.y + paddleHeight;
    }

    function update() {
      ball.x += ball.speedX;
      ball.y += ball.speedY;

      if (ball.y - ballRadius < 0 || ball.y + ballRadius > canvas.height) {
        ball.speedY = -ball.speedY;
      }

      const aiTarget = ball.y - paddleHeight / 2;
      ai.y += (aiTarget - ai.y) * 0.12; 
      ai.y = Math.max(0, Math.min(canvas.height - paddleHeight, ai.y)); 

      let player = (ball.x < canvas.width / 2) ? user : ai;

      if (checkCollision(ball, player)) {
        ball.speedX = -ball.speedX * ball.speedMultiplier;
        let hitPoint = ball.y - (player.y + paddleHeight / 2);
        hitPoint = hitPoint / (paddleHeight / 2); 
        ball.speedY = hitPoint * 5;
      }

      if (ball.x - ballRadius < 0) {
        ai.score++;
        aiScoreEl.innerText = ai.score;
        resetBall();
      } else if (ball.x + ballRadius > canvas.width) {
        user.score++;
        userScoreEl.innerText = user.score;
        resetBall();
      }
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

    // Start game on first user interaction
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
    isGameRunning = false; // Wait for user input

    // Resize listener
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
      }, 150);
    });