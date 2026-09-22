    const canvas = document.getElementById('invadersCanvas');
    const ctx = canvas.getContext('2d');

    const scoreEl = document.getElementById('current-score');
    const escapeBtn = document.getElementById('escape-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Engine settings
    let score = 0;
    let isGameOver = false;
    let isWin = false;
    let bullets = [];
    let enemies = [];
    let lastShotTime = 0;
    const shotInterval = 350;

    // Get current display dimensions for responsive calculations
    function getDisplaySize() {
      const rect = canvas.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }

    // Scale player to canvas display size
    function getPlayerSize(displayWidth) {
      const scaleX = displayWidth / canvas.width;
      return {
        width: 40 * scaleX,
        height: 12 * scaleX,
        offsetX: 20 * scaleX
      };
    }

    let player = {
      x: canvas.width / 2 - 20,
      y: canvas.height - 30,
      width: 40,
      height: 12
    };

    function handleInputX(clientX) {
      if (isGameOver) return;
      const rect = canvas.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const displayWidth = rect.width;
      
      const playerSize = getPlayerSize(displayWidth);
      const targetX = relativeX * (canvas.width / displayWidth);

      player.x = Math.max(0, Math.min(canvas.width - player.width, targetX - playerSize.offsetX));
    }

    canvas.addEventListener('mousemove', (e) => handleInputX(e.clientX));

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (e.touches.length > 0) handleInputX(e.touches[0].clientX);
    }, { passive: false });

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (isGameOver) resetGame();
      else if (e.touches.length > 0) handleInputX(e.touches[0].clientX);
    }, { passive: false });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') player.x = Math.max(0, player.x - 15);
      if (e.key === 'ArrowRight' || e.key === 'd') player.x = Math.min(canvas.width - player.width, player.x + 15);
    });

    canvas.addEventListener('click', () => { if (isGameOver) resetGame(); });

    function initEnemies() {
      enemies = [];
      const rows = 3;
      const cols = 4;
      const eWidth = 40;
      const eHeight = 20;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          enemies.push({
            x: c * (eWidth + 35) + 50,
            y: r * (eHeight + 20) + 40,
            width: eWidth,
            height: eHeight,
            direction: 1,
            speed: 1.2
          });
        }
      }
    }

    function checkCollision(rect1, rect2) {
      return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;
    }

    function update() {
      if (isGameOver) return;

      const currentTime = Date.now();

      if (currentTime - lastShotTime > shotInterval) {
        bullets.push({
          x: player.x + player.width / 2 - 2,
          y: player.y - 10,
          width: 4,
          height: 10,
          speed: 5
        });
        lastShotTime = currentTime;
      }

      for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;
        if (bullets[i].y < 0) bullets.splice(i, 1);
      }

      let changeDir = false;
      enemies.forEach(e => {
        e.x += e.direction * e.speed;
        if (e.x <= 0 || e.x + e.width >= canvas.width) changeDir = true;
      });

      if (changeDir) {
        enemies.forEach(e => {
          e.direction *= -1;
          e.y += 15;
          if (e.y + e.height >= player.y) {
            isGameOver = true;
            isWin = false;
          }
        });
      }

      for (let bIdx = bullets.length - 1; bIdx >= 0; bIdx--) {
        for (let eIdx = enemies.length - 1; eIdx >= 0; eIdx--) {
          if (checkCollision(bullets[bIdx], enemies[eIdx])) {
            bullets.splice(bIdx, 1);
            enemies.splice(eIdx, 1);
            score++;
            scoreEl.innerText = score;

            if (enemies.length === 0) {
              isGameOver = true;
              isWin = true;
              escapeBtn.classList.remove('hidden');
            }
            break;
          }
        }
      }

      if (isGameOver && !isWin) resetBtn.classList.remove('hidden');
    }

    function draw() {
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff33';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00ff33';

      if (!isGameOver || isWin) {
        ctx.fillRect(player.x, player.y, player.width, player.height);
      }

      ctx.fillStyle = '#00ff33';
      bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

      ctx.font = '16px "Courier New"';
      ctx.textAlign = 'center';
      enemies.forEach(e => {
        ctx.fillText('👾', e.x + e.width / 2, e.y + e.height / 2 + 5);
      });

      if (isGameOver) {
        if (isWin) {
          ctx.fillStyle = '#00ff33';
          ctx.shadowColor = '#00ff33';
          ctx.font = '20px "Courier New"';
          ctx.fillText('SYSTEM CLEANSED!', canvas.width / 2, canvas.height / 2 - 10);
          ctx.font = '14px "Courier New"';
          ctx.fillText('Run Escape execution.', canvas.width / 2, canvas.height / 2 + 15);
        } else {
          ctx.fillStyle = '#ff3333';
          ctx.shadowColor = '#ff3333';
          ctx.font = '20px "Courier New"';
          ctx.fillText('BREAK IN DETECTED!', canvas.width / 2, canvas.height / 2 - 10);
          ctx.font = '14px "Courier New"';
          ctx.fillText('Tap Reboot to try again', canvas.width / 2, canvas.height / 2 + 15);
        }
      }

      ctx.shadowBlur = 0;
    }

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    function resetGame() {
      score = 0;
      scoreEl.innerText = score;
      isGameOver = false;
      isWin = false;
      bullets = [];
      escapeBtn.classList.add('hidden');
      resetBtn.classList.add('hidden');
      
      const displayWidth = canvas.getBoundingClientRect().width;
      const playerSize = getPlayerSize(displayWidth);
      player.width = 40;
      player.height = 12;
      player.x = canvas.width / 2 - 20;
      player.y = canvas.height - 30;
      
      initEnemies();
    }

    function handleResize() {
      if (!isGameOver) {
        const displayWidth = canvas.getBoundingClientRect().width;
        const playerSize = getPlayerSize(displayWidth);
        player.width = 40;
        player.height = 12;
        player.x = Math.min(player.x, canvas.width - player.width);
      }
    }

    window.addEventListener('resize', handleResize);
    initEnemies();
    gameLoop();