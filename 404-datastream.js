    const scoreEl = document.getElementById('current-score');
    const statusMsg = document.getElementById('status-msg');
    const escapeBtn = document.getElementById('escape-btn');
    const resetBtn = document.getElementById('reset-btn');

    const tracks = [
      document.getElementById('track-0'),
      document.getElementById('track-1'),
      document.getElementById('track-2')
    ];

    let score = 0;
    let gameActive = true;
    let nodes = [];
    let spawnTimer;
    let gameInterval;

    // Core settings
    const nodeSpeed = 4; // Falling pixels per frame step
    const targetMinY = 270; // Adjusted hit boundaries
    const targetMaxY = 320;
    const targetGoal = 25; // Points needed to pass

    function spawnNode() {
      if (!gameActive) return;

      const trackIdx = Math.floor(Math.random() * 3);

      const nodeEl = document.createElement('div');
      nodeEl.className = 'node';
      nodeEl.style.top = '0px';
      tracks[trackIdx].appendChild(nodeEl);

      nodes.push({
        element: nodeEl,
        track: trackIdx,
        y: 0
      });

      clearInterval(spawnTimer);
      const nextSpawn = Math.floor(Math.random() * 800) + 600;
      spawnTimer = setInterval(spawnNode, nextSpawn);
    }

    function updateEngine() {
      if (!gameActive) return;

      for (let i = nodes.length - 1; i >= 0; i--) {
        let node = nodes[i];
        node.y += nodeSpeed;
        node.element.style.top = node.y + 'px';

        if (node.y > 320) {
          node.element.remove();
          nodes.splice(i, 1);
          triggerMiss();
        }
      }
    }

    function triggerHitAttempt(trackIdx) {
      if (!gameActive) return;

      const laneNodes = nodes.filter(n => n.track === trackIdx);

      if (laneNodes.length > 0) {
        // Select the lowest/first node in that specific lane
        const targetNode = laneNodes[0];

        if (targetNode.y >= targetMinY && targetNode.y <= targetMaxY) {
          score++;
          scoreEl.innerText = score;

          targetNode.element.style.backgroundColor = '#ffffff';
          setTimeout(() => targetNode.element.remove(), 50);

          nodes = nodes.filter(n => n !== targetNode);
          checkWinCondition();
        } else {
          triggerMiss();
        }
      }
    }

    function triggerMiss() {
      if (score > 0) {
        score--;
        scoreEl.innerText = score;
      }
    }

    function checkWinCondition() {
      if (score >= targetGoal) {
        gameActive = false;
        clearInterval(spawnTimer);
        clearInterval(gameInterval);

        nodes.forEach(n => n.element.remove());
        nodes = [];

        statusMsg.innerHTML = "<span style='color: #00ff33; font-weight: bold;'>GRID_SYNC_COMPLETE: Stream Restored!</span>";
        escapeBtn.classList.remove('hidden');
      }
    }

    // DESKTOP: Keyboard inputs - FIX: Use capture phase and prevent default
    document.addEventListener('keydown', (e) => {
      if (!gameActive) return;

      // Prevent browser shortcuts for these keys
      if (['a', 's', 'd'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }

      if (e.key.toLowerCase() === 'a') triggerHitAttempt(0);
      if (e.key.toLowerCase() === 's') triggerHitAttempt(1);
      if (e.key.toLowerCase() === 'd') triggerHitAttempt(2);
    }, { capture: true });

    // SMARTPHONE: Touch inputs
    for (let i = 0; i < 3; i++) {
      const btn = document.getElementById(`btn-${i}`);

      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        triggerHitAttempt(i);
      }, { passive: false });

      btn.addEventListener('click', () => triggerHitAttempt(i));
    }

    function startGame() {
      gameActive = true;
      score = 0;
      scoreEl.innerText = score;
      statusMsg.innerText = '';
      escapeBtn.classList.add('hidden');
      resetBtn.classList.add('hidden');

      gameInterval = setInterval(updateEngine, 1000 / 60);
      spawnTimer = setInterval(spawnNode, 500);
    }

    function resetGame() {
      nodes.forEach(n => n.element.remove());
      nodes = [];
      clearInterval(spawnTimer);
      clearInterval(gameInterval);
      startGame();
    }

    startGame();