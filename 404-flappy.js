    // =====================================================
    // GAME CONFIGURATION - RELAXED SPEED SETTINGS
    // =====================================================
    const canvas = document.getElementById('flappyCanvas');
    const ctx = canvas.getContext('2d');

    // DOM Element References
    const scoreEl = document.getElementById('current-score');
    const bestScoreEl = document.getElementById('best-score');
    const livesEl = document.getElementById('lives');
    const escapeBtn = document.getElementById('escape-btn');
    const resetBtn = document.getElementById('reset-btn');
    const achievementPopup = document.getElementById('achievement-popup');
    const achievementText = document.getElementById('achievement-text');

    // Game State Object
    let gameState = {
      score: 0,
      bestScore: parseInt(localStorage.getItem('flappyBestScore')) || 0,
      lives: 3,
      isGameOver: false,
      isPaused: false,
      frameCount: 0,
      difficultyLevel: 1
    };

    // Initialize best score display
    bestScoreEl.innerText = gameState.bestScore;

    // Physics Configuration - RELAXED for Casual Gameplay
    const config = {
      // Slower gravity = more time to react
      baseGravity: 0.22,        // Reduced from 0.35
      // Less jump force = smoother control
      baseJumpForce: -4.5,      // Reduced from -6.5
      // Slower pipe speed = easier dodging
      basePipeSpeed: 1.8,       // Reduced from 2.5
      // Wider gaps = more forgiving
      basePipeGap: 140,         // Increased from 120
      // Slower pipe spawn = less stress
      pipeSpawnRate: 110,       // Increased from 90
      // Smoother rotation
      rotationSpeed: 0.08,
      maxRotation: Math.PI / 5,
      particleCount: 6,
      difficultyStep: 8,        // Harder to increase difficulty
      difficultyMultiplier: 0.08 // Smaller difficulty increases
    };

    // Packet Entity (the player character)
    const packet = {
      x: 0,
      y: 0,
      size: 18,
      velocity: 0,
      rotation: 0,
      targetRotation: 0,
      trail: []
    };

    // Game Objects Arrays
    let pipes = [];
    let particles = [];
    let gameLoopId = null;

    // =====================================================
    // RESPONSIVE CANVAS SETUP
    // =====================================================
    function resizeCanvas() {
      const wrapper = document.querySelector('.canvas-wrapper');
      
      // Get available space minus margins
      const maxWidth = Math.min(wrapper.clientWidth * 0.98, 450);
      const maxHeight = wrapper.clientHeight * 0.95;
      
      // Maintain portrait aspect ratio (4:5)
      const aspectRatio = 0.8;
      
      // Calculate dimensions that fit within constraints
      let width, height;
      
      if (maxWidth / maxHeight < aspectRatio) {
        width = maxWidth;
        height = width / aspectRatio;
      } else {
        height = maxHeight;
        width = height * aspectRatio;
      }
      
      canvas.width = Math.floor(width);
      canvas.height = Math.floor(height);
      
      // Position packet at start if fresh game
      if (gameState.frameCount === 0) {
        packet.x = canvas.width * 0.25;
        packet.y = canvas.height / 2;
      }
    }

    // Listen for window resize events
    window.addEventListener('resize', () => {
      resizeCanvas();
      if (gameState.isGameOver) {
        draw(); // Redraw game over screen with new size
      }
    });

    // Initial canvas setup
    resizeCanvas();

    // =====================================================
    // INPUT HANDLING
    // =====================================================
    function triggerJump() {
      if (gameState.isGameOver) {
        fullReset();
        return;
      }
      
      if (gameState.isPaused) {
        resumeGame();
        return;
      }

      // Set upward velocity
      packet.velocity = config.baseJumpForce;
      
      // Add rotation effect
      packet.rotation = -config.maxRotation;
      
      // Spawn particle effects
      spawnParticles(packet.x, packet.y + packet.size / 2, '#00ff33', config.particleCount);
    }

    // Keyboard Controls (Desktop)
    document.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        e.preventDefault();
        triggerJump();
      }
      if (e.key === 'Escape') {
        togglePause();
      }
    });

    // Touch Controls (Mobile)
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      triggerJump();
    }, { passive: false });

    // Mouse Click (Desktop fallback)
    canvas.addEventListener('mousedown', (e) => {
      e.preventDefault();
      triggerJump();
    });

    // =====================================================
    // PARTICLE SYSTEM FOR VISUAL EFFECTS
    // =====================================================
    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 2;
        this.speedX = (Math.random() - 0.5) * 3;
        this.speedY = (Math.random() - 0.5) * 3;
        this.color = color;
        this.life = 1.0;
        this.decay = Math.random() * 0.025 + 0.015;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
      }

      draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }

    function spawnParticles(x, y, color, count) {
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, color));
      }
    }

    function updateParticles() {
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].life <= 0) {
          particles.splice(i, 1);
        }
      }
    }

    function drawParticles(ctx) {
      particles.forEach(p => p.draw(ctx));
    }

    // =====================================================
    // PIPE GENERATION WITH PROGRESSIVE DIFFICULTY
    // =====================================================
    function spawnPipe() {
      const minHeight = canvas.height * 0.15;
      const maxHeight = canvas.height * 0.65;
      const adjustedGap = Math.max(config.basePipeGap - (gameState.difficultyLevel * 2), 95);
      
      const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
      
      pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: canvas.height - topHeight - adjustedGap,
        gap: adjustedGap,
        passed: false
      });
    }

    // =====================================================
    // COLLISION DETECTION
    // =====================================================
    function checkCollision(pkt, p) {
      const hitboxPadding = 3; // Forgiving hitbox
      
      // Top pipe collision
      const hitTop = pkt.x + pkt.size - hitboxPadding > p.x && 
                     pkt.x + hitboxPadding < p.x + 50 && 
                     pkt.y + hitboxPadding < p.top;
      
      // Bottom pipe collision  
      const hitBottom = pkt.x + pkt.size - hitboxPadding > p.x && 
                        pkt.x + hitboxPadding < p.x + 50 && 
                        pkt.y + pkt.size - hitboxPadding > canvas.height - p.bottom;
      
      return hitTop || hitBottom;
    }

    // =====================================================
    // GAME LOOP ENGINE
    // =====================================================
    function update() {
      if (gameState.isGameOver || gameState.isPaused) return;

      gameState.frameCount++;

      // Apply progressive difficulty (slower progression)
      if (gameState.score > 0 && gameState.score % config.difficultyStep === 0) {
        gameState.difficultyLevel = 1 + Math.floor(gameState.score / config.difficultyStep) * config.difficultyMultiplier;
      }

      // Physics update
      packet.velocity += config.baseGravity;
      packet.y += packet.velocity;
      
      // Rotation smoothing
      packet.targetRotation = Math.min(Math.max(packet.velocity * 0.04, -config.maxRotation), config.maxRotation);
      packet.rotation += (packet.targetRotation - packet.rotation) * config.rotationSpeed;

      // Trail effect
      packet.trail.push({ x: packet.x, y: packet.y });
      if (packet.trail.length > 8) packet.trail.shift();

      // Boundary checks (ground/ceiling)
      if (packet.y + packet.size >= canvas.height || packet.y <= 0) {
        handleCollision();
      }

      // Pipe spawning with adjusted rate
      const adjustedSpawnRate = Math.max(config.pipeSpawnRate - (gameState.difficultyLevel * 3), 70);
      if (gameState.frameCount % adjustedSpawnRate === 0) {
        spawnPipe();
      }

      // Pipe movement and logic
      const pipeSpeed = config.basePipeSpeed + (gameState.difficultyLevel * 0.15);
      
      for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= pipeSpeed;

        // Collision detection
        if (checkCollision(packet, pipes[i])) {
          handleCollision();
        }

        // Scoring
        if (!pipes[i].passed && pipes[i].x + 50 < packet.x) {
          pipes[i].passed = true;
          gameState.score++;
          scoreEl.innerText = gameState.score;
          
          // Achievement unlocks
          if (gameState.score === 5) {
            showAchievement("First Firewall Breached!");
            escapeBtn.classList.remove('hidden');
          }
          if (gameState.score === 10) {
            showAchievement("Double Node Master!");
          }
          if (gameState.score === 20) {
            showAchievement("Elite Packet Operator!");
          }
        }

        // Remove off-screen pipes
        if (pipes[i].x + 50 < 0) {
          pipes.splice(i, 1);
        }
      }

      // Update particles
      updateParticles();
    }

    // =====================================================
    // DRAWING FUNCTIONS
    // =====================================================
    function draw() {
      // Clear canvas with subtle gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0a0a');
      gradient.addColorStop(1, '#121212');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid overlay
      drawGrid();

      // Draw trail effect behind packet
      drawTrail();

      // Draw pipes
      drawPipes();

      // Draw packet with rotation
      drawPacket();

      // Draw particles
      drawParticles(ctx);

      // Game over overlay
      if (gameState.isGameOver) {
        drawGameOver();
      }

      // Pause overlay
      if (gameState.isPaused) {
        drawPause();
      }
    }

    function drawGrid() {
      ctx.strokeStyle = 'rgba(0, 255, 51, 0.08)';
      ctx.lineWidth = 1;
      
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    function drawTrail() {
      packet.trail.forEach((pos, index) => {
        const alpha = index / packet.trail.length * 0.35;
        const size = packet.size * (index / packet.trail.length);
        
        ctx.fillStyle = `rgba(0, 255, 51, ${alpha})`;
        ctx.fillRect(pos.x, pos.y, size, size);
      });
    }

    function drawPacket() {
      ctx.save();
      ctx.translate(packet.x + packet.size / 2, packet.y + packet.size / 2);
      ctx.rotate(packet.rotation);
      
      // Glow effect
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00ff33';
      
      // Main packet body
      ctx.fillStyle = '#00ff33';
      ctx.fillRect(-packet.size / 2, -packet.size / 2, packet.size, packet.size);
      
      // Inner detail
      ctx.fillStyle = '#003300';
      ctx.fillRect(-packet.size / 4, -packet.size / 4, packet.size / 2, packet.size / 2);
      
      ctx.restore();
    }

    function drawPipes() {
      pipes.forEach(p => {
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff3333';
        
        // Top pipe gradient
        const topGradient = ctx.createLinearGradient(p.x, 0, p.x + 50, 0);
        topGradient.addColorStop(0, '#cc0000');
        topGradient.addColorStop(0.5, '#ff3333');
        topGradient.addColorStop(1, '#cc0000');
        
        ctx.fillStyle = topGradient;
        ctx.fillRect(p.x, 0, 50, p.top);
        
        // Bottom pipe gradient
        const bottomGradient = ctx.createLinearGradient(p.x, canvas.height - p.bottom, p.x + 50, canvas.height - p.bottom);
        bottomGradient.addColorStop(0, '#cc0000');
        bottomGradient.addColorStop(0.5, '#ff3333');
        bottomGradient.addColorStop(1, '#cc0000');
        
        ctx.fillStyle = bottomGradient;
        ctx.fillRect(p.x, canvas.height - p.bottom, 50, p.bottom);
        
        // Pipe caps
        ctx.fillStyle = '#ff6666';
        ctx.fillRect(p.x - 3, p.top - 8, 56, 8);
        ctx.fillRect(p.x - 3, canvas.height - p.bottom, 56, 8);
        
        ctx.shadowBlur = 0;
      });
    }

    function drawGameOver() {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.85)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff3333';
      
      ctx.fillStyle = '#ff3333';
      ctx.font = `bold ${Math.max(18, canvas.width * 0.055)}px "Courier New"`;
      ctx.textAlign = 'center';
      ctx.fillText('⚡ CONNECTION TERMINATED ⚡', canvas.width / 2, canvas.height / 2 - 25);
      
      ctx.font = `${Math.max(14, canvas.width * 0.04)}px "Courier New"`;
      ctx.fillStyle = '#00ff33';
      ctx.fillText(`Nodes Passed: ${gameState.score}`, canvas.width / 2, canvas.height / 2 + 5);
      
      ctx.font = `${Math.max(12, canvas.width * 0.035)}px "Courier New"`;
      ctx.fillStyle = '#aaaaaa';
      ctx.fillText('Tap or Press Space to Reboot', canvas.width / 2, canvas.height / 2 + 35);
      
      ctx.shadowBlur = 0;
    }

    function drawPause() {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ff33';
      
      ctx.fillStyle = '#00ff33';
      ctx.font = `bold ${Math.max(22, canvas.width * 0.06)}px "Courier New"`;
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
      
      ctx.font = `${Math.max(11, canvas.width * 0.03)}px "Courier New"`;
      ctx.fillStyle = '#aaaaaa';
      ctx.fillText('Press ESC to Resume', canvas.width / 2, canvas.height / 2 + 28);
      
      ctx.shadowBlur = 0;
    }

    // =====================================================
    // GAME STATE MANAGEMENT
    // =====================================================
    function handleCollision() {
      gameState.lives--;
      updateLivesDisplay();
      
      // Spawn impact particles
      spawnParticles(packet.x, packet.y, '#ff3333', 12);
      
      if (gameState.lives <= 0) {
        triggerGameOver();
      } else {
        // Reset packet position but keep pipes for continuity
        resetPacketPosition();
        
        // Flash effect for damage
        flashScreen('#ff3333');
      }
    }

    function resetPacketPosition() {
      packet.y = canvas.height / 2;
      packet.velocity = 0;
      packet.rotation = 0;
      packet.trail = [];
    }

    function updateLivesDisplay() {
      const hearts = '❤️'.repeat(Math.max(0, gameState.lives));
      livesEl.innerHTML = hearts;
    }

    function triggerGameOver() {
      gameState.isGameOver = true;
      
      // Update best score if needed
      if (gameState.score > gameState.bestScore) {
        gameState.bestScore = gameState.score;
        localStorage.setItem('flappyBestScore', gameState.bestScore);
        bestScoreEl.innerText = gameState.bestScore;
        showAchievement('New High Score!');
      }
      
      cancelAnimationFrame(gameLoopId);
      resetBtn.classList.remove('hidden');
    }

    function showAchievement(text) {
      achievementText.textContent = text;
      achievementPopup.classList.add('show');
      
      setTimeout(() => {
        achievementPopup.classList.remove('show');
      }, 2500);
    }

    function flashScreen(color) {
      const flash = document.createElement('div');
      flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${color};
        opacity: 0.25;
        pointer-events: none;
        z-index: 9999;
      `;
      document.body.appendChild(flash);
      
      setTimeout(() => flash.remove(), 100);
    }

    function togglePause() {
      if (gameState.isGameOver) return;
      
      gameState.isPaused = !gameState.isPaused;
      if (!gameState.isPaused) {
        gameLoop();
      }
    }

    function resumeGame() {
      gameState.isPaused = false;
      gameLoop();
    }

    function fullReset() {
      gameState = {
        score: 0,
        bestScore: parseInt(localStorage.getItem('flappyBestScore')) || 0,
        lives: 3,
        isGameOver: false,
        isPaused: false,
        frameCount: 0,
        difficultyLevel: 1
      };
      
      pipes = [];
      particles = [];
      packet.trail = [];
      
      resetPacketPosition();
      
      scoreEl.innerText = '0';
      updateLivesDisplay();
      bestScoreEl.innerText = gameState.bestScore;
      
      escapeBtn.classList.add('hidden');
      resetBtn.classList.add('hidden');
      
      resizeCanvas();
      gameLoop();
    }

    function gameLoop() {
      if (gameState.isPaused || gameState.isGameOver) return;
      
      update();
      draw();
      gameLoopId = requestAnimationFrame(gameLoop);
    }

    // =====================================================
    // INITIALIZATION
    // =====================================================
    fullReset();

    // Prevent context menu on right-click
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());