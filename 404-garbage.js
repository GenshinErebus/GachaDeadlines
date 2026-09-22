    const sandbox = document.getElementById('heap-zone');
    const clearedEl = document.getElementById('cleared-count');
    const msgEl = document.getElementById('terminal-msg');
    const escapeLink = document.getElementById('escape-link');
    const resetBtn = document.getElementById('reset-btn');

    let score = 0;
    let isGameOver = false;
    let activeTrash = [];
    let spawnClock;
    let physicsClock;

    const deadCodePool = [
      "let undefined_var;",
      "var useless_array = [];",
      "const dead_ptr = null;",
      "function unreferenced() {}",
      "this.lost_context = {}",
      "new MemoryLeakLeak()",
      "while(true){broken_loop}",
      "window.orphaned_data = 1"
    ];

    function startCollectorEngine() {
      score = 0;
      isGameOver = false;
      activeTrash = [];
      
      clearedEl.innerText = score;
      msgEl.innerText = "Collector: ACTIVE // Purging...";
      
      escapeLink.classList.add('hidden');
      resetBtn.classList.add('hidden');
      sandbox.innerHTML = '';

      const spawnRate = window.innerWidth < 480 ? 1400 : 1800;
      const physicsRate = window.innerWidth < 480 ? 50 : 40;

      spawnClock = setInterval(spawnLeakVariable, spawnRate);
      physicsClock = setInterval(updatePhysicsLoop, physicsRate);
    }

    function spawnLeakVariable() {
      if (isGameOver || activeTrash.length >= 6) return;

      const randomText = deadCodePool[Math.floor(Math.random() * deadCodePool.length)];
      
      const el = document.createElement('div');
      el.className = 'trash-variable';
      el.innerText = randomText;
      
      const maxWidth = sandbox.clientWidth;
      const xPos = Math.floor(Math.random() * (maxWidth - 120)) + 60;
      
      el.style.left = xPos + 'px';
      el.style.top = '0px';

      el.addEventListener('click', function(e) {
        e.stopPropagation();
        collectTrashItem(el);
      });
      el.addEventListener('touchstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        collectTrashItem(el);
      }, { passive: false });

      sandbox.appendChild(el);
      activeTrash.push({ element: el, y: 0, speed: 0.8 + Math.random() * 0.5 });
    }

    function updatePhysicsLoop() {
      if (isGameOver) return;

      const maxHeight = sandbox.clientHeight;

      for (let i = activeTrash.length - 1; i >= 0; i--) {
        let trash = activeTrash[i];
        trash.y += trash.speed;
        trash.element.style.top = trash.y + 'px';

        if (trash.y >= maxHeight - 8) {
          triggerMemoryLeakCrash();
          break;
        }
      }
    }

    function collectTrashItem(element) {
      if (isGameOver) return;

      activeTrash = activeTrash.filter(item => item.element !== element);
      
      element.style.color = '#ffffff';
      element.style.textShadow = '0 0 15px #00ff33';
      setTimeout(function() { element.remove(); }, 60);

      score++;
      clearedEl.innerText = score;

      if (score >= 8) {
        triggerWinState();
      } else {
        msgEl.innerText = "Sector reclaimed successfully.";
      }
    }

    function triggerMemoryLeakCrash() {
      isGameOver = true;
      clearInterval(spawnClock);
      clearInterval(physicsClock);
      
      resetBtn.classList.remove('hidden');
      msgEl.innerHTML = "<span style='color:#ff3333'>FATAL: HEAP_OVERFLOW! Stack frozen.</span>";
    }

    function triggerWinState() {
      isGameOver = true;
      clearInterval(spawnClock);
      clearInterval(physicsClock);
      
      activeTrash.forEach(item => item.element.remove());
      activeTrash = [];

      escapeLink.classList.remove('hidden');
      msgEl.innerHTML = "<span style='color:#00ff33;font-weight:bold'>HEAP_STABILIZED! Bridge opened!</span>";
    }

    function rebootCollectorEngine() {
      startCollectorEngine();
    }

    startCollectorEngine();