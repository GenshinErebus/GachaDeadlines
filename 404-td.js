    const board = document.getElementById('main-board');
    const bitsEl = document.getElementById('bits-count');
    const filteredEl = document.getElementById('filtered-count');
    const integrityEl = document.getElementById('integrity-count');
    const terminalMsg = document.getElementById('terminal-msg');
    const escapeBtn = document.getElementById('escape-btn');
    const resetBtn = document.getElementById('reset-btn');

    let bits = 40;
    let filtered = 0;
    let integrity = 100;
    let isGameOver = false;
    let spawnCounter = 0;
    let activeViruses = [];
    let deployedTowers = [];
    
    let spawnClock;
    let physicsClock;
    let shootingClock;

    const slotLocationsPct = [
      { x: 16, y: 30 }, { x: 42, y: 30 }, { x: 62, y: 40 },
      { x: 26, y: 5 },  { x: 56, y: 5 },  { x: 72, y: 65 }
    ];

    function startDefenderEngine() {
      bits = 40; filtered = 0; integrity = 100; isGameOver = false;
      spawnCounter = 0; activeViruses = []; deployedTowers = [];
      
      bitsEl.innerText = bits;
      filteredEl.innerText = filtered;
      integrityEl.innerText = integrity;
      terminalMsg.innerText = '';
      
      escapeBtn.classList.add('hidden');
      resetBtn.classList.add('hidden');

      document.querySelectorAll('.slot').forEach(e => e.remove());
      document.querySelectorAll('.virus-node').forEach(e => e.remove());

      slotLocationsPct.forEach(loc => {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.style.left = loc.x + '%';
        slot.style.top = loc.y + '%';
        
        slot.addEventListener('click', function() {
          if (isGameOver || this.classList.contains('occupied') || bits < 20) return;
          
          const boardRect = board.getBoundingClientRect();
          
          bits -= 20;
          bitsEl.innerText = bits;
          this.classList.add('occupied');
          this.innerText = '☤';
          deployedTowers.push({ 
            x: (loc.x / 100) * boardRect.width, 
            y: (loc.y / 100) * boardRect.height,
            range: boardRect.width * 0.25 
          });
        });
        
        board.appendChild(slot);
      });

      spawnClock = setInterval(spawnVirusPacket, 2500);
      physicsClock = setInterval(updatePhysicsLoop, 40);
      shootingClock = setInterval(executeDefensesShooting, 700);
    }

    function spawnVirusPacket() {
      if (isGameOver || spawnCounter >= 15) return;
      
      const vEl = document.createElement('div');
      vEl.className = 'virus-node';
      vEl.innerText = '👾';
      board.appendChild(vEl);

      activeViruses.push({
        element: vEl, x: 0, y: 15, speed: 0.3, trackStage: 0
      });
      spawnCounter++;
    }

    function updatePhysicsLoop() {
      if (isGameOver) return;

      for (let i = activeViruses.length - 1; i >= 0; i--) {
        let v = activeViruses[i];

        if (v.trackStage === 0) {
          v.x += v.speed;
          if (v.x >= 55) { v.x = 55; v.trackStage = 1; }
        } else if (v.trackStage === 1) {
          v.y += v.speed;
          if (v.y >= 55) { v.y = 55; v.trackStage = 2; }
        } else if (v.trackStage === 2) {
          v.x += v.speed;
          if (v.x >= 80) {
            v.element.remove();
            activeViruses.splice(i, 1);
            integrity = Math.max(0, integrity - 20);
            integrityEl.innerText = integrity;
            if (integrity <= 0) triggerMatchEnd(false);
            continue;
          }
        }

        v.element.style.left = v.x + '%';
        v.element.style.top = v.y + '%';
      }
    }

    function executeDefensesShooting() {
      if (isGameOver) return;
      const boardRect = board.getBoundingClientRect();

      deployedTowers.forEach(t => {
        if (activeViruses.length === 0) return;

        for (let i = 0; i < activeViruses.length; i++) {
          let v = activeViruses[i];
          const vx = (v.x / 100) * boardRect.width;
          const vy = (v.y / 100) * boardRect.height;
          let dist = Math.sqrt((vx - t.x) ** 2 + (vy - t.y) ** 2);

          if (dist <= t.range) {
            v.element.style.color = '#ffffff';
            setTimeout(() => { v.element.remove(); }, 100);
            
            activeViruses.splice(i, 1);
            bits += 10;
            filtered++;
            
            bitsEl.innerText = bits;
            filteredEl.innerText = filtered;

            if (filtered >= 10) triggerMatchEnd(true);
            break;
          }
        }
      });
    }

    function triggerMatchEnd(won) {
      isGameOver = true;
      clearInterval(spawnClock);
      clearInterval(physicsClock);
      clearInterval(shootingClock);

      resetBtn.classList.remove('hidden');
      if (won) {
        escapeBtn.classList.remove('hidden');
        terminalMsg.innerHTML = "<span style='color:#00ff33;font-weight:bold;'>GATEWAY SECURED!</span>";
      } else {
        terminalMsg.innerHTML = "<span style='color:#ff3333;'>MAINFRAME OVERRUN!</span>";
      }
    }

    function resetGame() {
      startDefenderEngine();
    }

    window.onload = startDefenderEngine;
    
    window.onresize = () => {
      if (!isGameOver) {
        startDefenderEngine();
      }
    };