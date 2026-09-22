   const rangeZone = document.getElementById('aim-zone');
    const hitEl = document.getElementById('hit-count');
    const msgEl = document.getElementById('terminal-msg');
    const escapeLink = document.getElementById('escape-link');
    const resetBtn = document.getElementById('reset-btn');

    let hits = 0;
    let isGameOver = false;
    let activeTarget = null;
    let despawnTimeout;

    function startWarmupEngine() {
      hits = 0;
      isGameOver = false;
      activeTarget = null;

      hitEl.innerText = hits;
      msgEl.innerText = "Tracking sensor array active. Calibrating targeting grids...";

      escapeLink.classList.add('hidden');
      resetBtn.classList.add('hidden');
      rangeZone.innerHTML = '';

      spawnNewTrackingTarget();
    }

    function spawnNewTrackingTarget() {
      if (isGameOver) return;

      if (activeTarget) activeTarget.remove();

      const el = document.createElement('div');
      el.className = 'aim-target';

      const maxWidth = rangeZone.clientWidth;
      const maxHeight = rangeZone.clientHeight;

      const xPos = Math.floor(Math.random() * (maxWidth - 60)) + 30;
      const yPos = Math.floor(Math.random() * (maxHeight - 60)) + 30;

      el.style.left = xPos + 'px';
      el.style.top = yPos + 'px';

      el.addEventListener('mousedown', registerTargetHit);
      el.addEventListener('touchstart', function (e) {
        e.preventDefault();
        registerTargetHit();
      }, { passive: false });

      rangeZone.appendChild(el);
      activeTarget = el;

      const despawnDelay = Math.max(700, 1600 - (hits * 150));
      despawnTimeout = setTimeout(handleTargetDespawn, despawnDelay);
    }

    function registerTargetHit() {
      if (isGameOver) return;

      clearTimeout(despawnTimeout);
      hits++;
      hitEl.innerText = hits;

      if (hits >= 5) {
        triggerWinState();
      } else {
        msgEl.innerText = "Log: Node lock captured. Sequence index moving...";
        spawnNewTrackingTarget();
      }
    }

    function handleTargetDespawn() {
      if (isGameOver) return;
      triggerCoresCrash();
    }

    function triggerCoresCrash() {
      isGameOver = true;
      clearTimeout(despawnTimeout);
      if (activeTarget) {
        activeTarget.style.borderColor = '#ff3333';
        activeTarget = null;
      }
      resetBtn.classList.remove('hidden');
      msgEl.innerHTML = "<span style='color: #ff3333;'>CALIBRATION_FAILED: Target tracking lost. Synchronization dropped.</span>";
    }

    function triggerWinState() {
      isGameOver = true;
      clearTimeout(despawnTimeout);
      if (activeTarget) activeTarget.remove();

      escapeLink.classList.remove('hidden');
      msgEl.innerHTML = "<span style='color: #00ff33; font-weight: bold;'>CALIBRATION_COMPLETE: Index aligned perfectly! Core stable.</span>";
    }

    function restartWarmupEngine() {
      startWarmupEngine();
    }

    startWarmupEngine();