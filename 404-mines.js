    const gridContainer = document.getElementById('minefield');
    const statusMsg = document.getElementById('status-msg');
    const escapeBtn = document.getElementById('escape-btn');
    const resetBtn = document.getElementById('reset-btn');
    const modeRevealBtn = document.getElementById('mode-reveal-btn');
    const modeFlagBtn = document.getElementById('mode-flag-btn');

    const SIZE = 8;
    const MINE_COUNT = 10;

    let board = [];
    let gameActive = true;
    let currentMode = 'reveal';
    let safeCellsLeft = (SIZE * SIZE) - MINE_COUNT;

    modeRevealBtn.addEventListener('click', () => setMode('reveal'));
    modeFlagBtn.addEventListener('click', () => setMode('flag'));

    function setMode(mode) {
      currentMode = mode;
      if (mode === 'reveal') {
        modeRevealBtn.classList.add('active-mode');
        modeFlagBtn.classList.remove('active-mode');
      } else {
        modeFlagBtn.classList.add('active-mode');
        modeRevealBtn.classList.remove('active-mode');
      }
    }

    function initBoard() {
      gridContainer.innerHTML = '';
      board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      })));

      // Plant mines randomly
      let planted = 0;
      while (planted < MINE_COUNT) {
        const r = Math.floor(Math.random() * SIZE);
        const c = Math.floor(Math.random() * SIZE);
        if (!board[r][c].isMine) {
          board[r][c].isMine = true;
          planted++;
        }
      }

      // Calculate neighbor mines
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (board[r][c].isMine) continue;
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (r + i >= 0 && r + i < SIZE && c + j >= 0 && c + j < SIZE) {
                if (board[r + i][c + j].isMine) count++;
              }
            }
          }
          board[r][c].neighborMines = count;
        }
      }

      // Render cells
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          const cellEl = document.createElement('div');
          cellEl.className = 'cell';
          cellEl.id = `cell-${r}-${c}`;

          const contentSpan = document.createElement('span');
          contentSpan.className = 'cell-content';
          cellEl.appendChild(contentSpan);

          cellEl.addEventListener('click', () => handleCellClick(r, c));
          cellEl.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (gameActive) handleFlag(r, c);
          });

          gridContainer.appendChild(cellEl);
        }
      }
    }

    function handleCellClick(r, c) {
      if (!gameActive) return;
      if (currentMode === 'flag') {
        handleFlag(r, c);
      } else {
        handleReveal(r, c);
      }
    }

    function handleFlag(r, c) {
      const cell = board[r][c];
      if (cell.isRevealed) return;

      cell.isFlagged = !cell.isFlagged;
      const el = document.getElementById(`cell-${r}-${c}`);
      const contentSpan = el.querySelector('.cell-content');
      contentSpan.innerText = cell.isFlagged ? '🚩' : '';
      el.classList.toggle('flagged', cell.isFlagged);
    }

    function handleReveal(r, c) {
      const cell = board[r][c];
      if (cell.isRevealed || cell.isFlagged) return;

      cell.isRevealed = true;
      const el = document.getElementById(`cell-${r}-${c}`);
      const contentSpan = el.querySelector('.cell-content');
      el.classList.add('revealed');

      if (cell.isMine) {
        triggerGameOver();
        return;
      }

      safeCellsLeft--;
      statusMsg.innerText = `Safe sectors left: ${safeCellsLeft}`;

      if (cell.neighborMines > 0) {
        contentSpan.innerText = cell.neighborMines;
      } else {
        // Flood fill recursion
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (r + i >= 0 && r + i < SIZE && c + j >= 0 && c + j < SIZE) {
              handleReveal(r + i, c + j);
            }
          }
        }
      }

      checkWin();
    }

    function triggerGameOver() {
      gameActive = false;
      resetBtn.classList.remove('hidden');
      statusMsg.innerHTML = "<span style='color: #ff3333;'>FATAL_ERROR: Packet detonated! Buffer dump.</span>";

      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (board[r][c].isMine) {
            const el = document.getElementById(`cell-${r}-${c}`);
            const contentSpan = el.querySelector('.cell-content');
            contentSpan.innerText = '👾';
            el.classList.add('mine');
          }
        }
      }
    }

    function checkWin() {
      if (safeCellsLeft === 0 && gameActive) {
        gameActive = false;
        statusMsg.innerHTML = "<span style='color: #00ff33; font-weight: bold;'>SECTOR_CLEANSED: Network Node Sync!</span>";
        escapeBtn.classList.remove('hidden');
      }
    }

    function resetGame() {
      gameActive = true;
      safeCellsLeft = (SIZE * SIZE) - MINE_COUNT;
      statusMsg.innerText = `Safe sectors left: ${safeCellsLeft}`;
      escapeBtn.classList.add('hidden');
      resetBtn.classList.add('hidden');
      setMode('reveal');
      initBoard();
    }

    initBoard();