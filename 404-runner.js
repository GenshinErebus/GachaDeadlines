    const canvas = document.getElementById('runnerCanvas');
    const ctx = canvas.getContext('2d');

    const scoreEl = document.getElementById('current-score');
    const highScoreEl = document.getElementById('high-score');

    // Game variables
    let score = 0;
    let highScore = 0;
    let isGameOver = false;
    let gameSpeed = 5;
    let obstacles = [];
    let frameCount = 0;

    // Player physics settings
    const player = {
      x: 50,
      y: canvas.height - 40,
      width: 25,
      height: 25,
      velocityY: 0,
      gravity: 0.6,
      jumpForce: -12,
      isGrounded: true
    };

    // --- INPUT CONTROLS SYSTEM ---

    function triggerJump() {
      if (isGameOver) {
        resetGame();
      } else if (player.isGrounded) {
        player.velocityY = player.jumpForce;
        player.isGrounded = false;
      }
    }

    // DESKTOP: Keyboard support - FIX: capture phase and prevent default
    document.addEventListener('keydown', (e) => {
      if (!isGameOver && player.isGrounded === false && e.code !== 'Space' && e.code !== 'ArrowUp' && e.key !== 'w') {
        return;
      }
      
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        triggerJump();
      }
    }, { capture: true });

    // SMARTPHONE: Screen tap support
    document.addEventListener('touchstart', (e) => {
      // Allow default clicking behavior on buttons, block elsewhere for jumping
      if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
        e.preventDefault();
        triggerJump();
      }
    }, { passive: false });

    // Fallback desktop mouse click anywhere to jump
    canvas.addEventListener('mousedown', (e) => {
      e.preventDefault();
      triggerJump();
    });


    // --- GAME ENGINE LOGIC ---

    function spawnObstacle() {
      // Randomize block height and layout slightly
      const height = Math.floor(Math.random() * 25) + 20; // 20px to 45px tall
      const width = 15;
      
      obstacles.push({
        x: canvas.width,
        y: canvas.height - height - 15, // 15px is ground buffer matching drawing code
        width: width,
        height: height
      });
    }

    function checkCollision(p, o) {
      return p.x < o.x + o.width &&
             p.x + p.width > o.x &&
             p.y < o.y + o.height &&
             p.y + p.height > o.y;
    }

    function resetGame() {
      score = 0;
      isGameOver = false;
      gameSpeed = 5;
      obstacles = [];
      frameCount = 0;
      player.y = canvas.height - 40;
      player.velocityY = 0;
      player.isGrounded = true;
      scoreEl.innerText = score;
      gameLoop();
    }

    function update() {
      if (isGameOver) return;

      frameCount++;
      
      // 1. Gradually speed up the game over time
      if (frameCount % 500 === 0) {
        gameSpeed += 0.5;
      }

      // 2. Score progression
      if (frameCount % 5 === 0) {
        score++;
        scoreEl.innerText = score;
      }

      // 3. Player physics & jump tracking
      player.velocityY += player.gravity;
      player.y += player.velocityY;

      // Ground ceiling boundary check
      const groundY = canvas.height - player.height - 15;
      if (player.y >= groundY) {
        player.y = groundY;
        player.velocityY = 0;
        player.isGrounded = true;
      }

      // 4. Obstacle generation timing rule
      const spawnInterval = Math.max(50, Math.floor(120 - gameSpeed * 4));
      if (frameCount % spawnInterval === 0) {
        spawnObstacle();
      }

      // 5. Update & check obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= gameSpeed;

        // Collision logic checkpoint
        if (checkCollision(player, obstacles[i])) {
          isGameOver = true;
          if (score > highScore) {
            highScore = score;
            highScoreEl.innerText = highScore;
          }
        }

        // Cleanup out-of-screen objects
        if (obstacles[i].x + obstacles[i].width < 0) {
          obstacles.splice(i, 1);
        }
      }
    }

    function draw() {
      // Clear frame background
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Matrix Neon glow setup
      ctx.fillStyle = '#00ff33';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00ff33';

      // Draw Horizon Ground Line
      ctx.fillRect(0, canvas.height - 15, canvas.width, 2);

      // Draw Player Cube
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // Draw Active Obstacles
      obstacles.forEach(o => {
        ctx.fillRect(o.x, o.y, o.width, o.height);
      });

      // Overlay Game Over Text directly onto screen canvas
      if (isGameOver) {
        ctx.fillStyle = '#ff3333';
        ctx.shadowColor = '#ff3333';
        ctx.font = '20px "Courier New"';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ CRASH_DETECTED ⚡', canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '14px "Courier New"';
        ctx.fillText('Tap Screen or Press Space to Reboot', canvas.width / 2, canvas.height / 2 + 20);
      }

      ctx.shadowBlur = 0; // Performance optimization
    }

    function gameLoop() {
      update();
      draw();
      if (!isGameOver) {
        requestAnimationFrame(gameLoop);
      }
    }

    // Fire engine up
    gameLoop();