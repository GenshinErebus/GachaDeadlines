    const boardContainer = document.getElementById('game-board');
    const statusMsg = document.getElementById('status-msg');
    const escapeBtn = document.getElementById('escape-btn');
    const resetBtn = document.getElementById('reset-btn');

    const COLS = 7;
    const ROWS = 6;

    let grid = [];
    let gameActive = true;
    const human = 1;
    const ai = 2;

    // Build the grid architecture nodes
    function createBoard() {
      boardContainer.innerHTML = '';
      grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const slot = document.createElement('div');
          slot.className = 'slot';
          slot.dataset.col = c;
          slot.id = `slot-${r}-${c}`;

          // Connect click listener directly to columns physics action
          slot.addEventListener('click', () => handleColumnClick(c));
          boardContainer.appendChild(slot);
        }
      }
    }

    function handleColumnClick(colIndex) {
      if (!gameActive) return;

      // Execute gravity find mechanics to place disk at lowest row slot available
      const rowIndex = getLowestEmptyRow(colIndex);
      if (rowIndex === -1) return; // Column is totally full

      makeMove(rowIndex, colIndex, human);

      if (checkWin(human)) {
        triggerEndState(true);
      } else if (checkDraw()) {
        triggerEndState(false, true);
      } else {
        gameActive = false; // Temporarily block input during AI computing step
        statusMsg.innerText = "AI calculating countermeasures...";
        setTimeout(aiMove, 500);
      }
    }

    function getLowestEmptyRow(colIndex) {
      for (let r = ROWS - 1; r >= 0; r--) {
        if (grid[r][colIndex] === 0) return r;
      }
      return -1;
    }

    function makeMove(r, c, player) {
      grid[r][c] = player;
      const targetSlot = document.getElementById(`slot-${r}-${c}`);
      targetSlot.classList.add(player === human ? 'player1' : 'player2');
    }

    function aiMove() {
      // AI Priority rules: 1. Win if possible, 2. Block user line, 3. Pick random
      let chosenCol = findStrategicColumn(ai) ?? findStrategicColumn(human) ?? getRandomColumn();

      if (chosenCol !== null) {
        const r = getLowestEmptyRow(chosenCol);
        makeMove(r, chosenCol, ai);

        if (checkWin(ai)) {
          triggerEndState(false);
          return;
        }
      }

      if (checkDraw()) {
        triggerEndState(false, true);
      } else {
        gameActive = true;
        statusMsg.innerText = "Your turn, User (Green)...";
      }
    }

    function findStrategicColumn(player) {
      for (let c = 0; c < COLS; c++) {
        let r = getLowestEmptyRow(c);
        if (r !== -1) {
          grid[r][c] = player; // Mock test move placement simulation
          let winState = checkWin(player);
          grid[r][c] = 0; // Wipe track
          if (winState) return c;
        }
      }
      return null;
    }

    function getRandomColumn() {
      let openCols = [];
      for (let c = 0; c < COLS; c++) {
        if (getLowestEmptyRow(c) !== -1) openCols.push(c);
      }
      if (openCols.length === 0) return null;
      return openCols[Math.floor(Math.random() * openCols.length)];
    }

    function checkWin(player) {
      // 1. Horizontal verification
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS - 3; c++) {
          if (grid[r][c] === player && grid[r][c + 1] === player && grid[r][c + 2] === player && grid[r][c + 3] === player) return true;
        }
      }
      // 2. Vertical verification
      for (let r = 0; r < ROWS - 3; r++) {
        for (let c = 0; c < COLS; c++) {
          if (grid[r][c] === player && grid[r + 1][c] === player && grid[r + 2][c] === player && grid[r + 3][c] === player) return true;
        }
      }
      // 3. Diagonal verification (down-right direction)
      for (let r = 0; r < ROWS - 3; r++) {
        for (let c = 0; c < COLS - 3; c++) {
          if (grid[r][c] === player && grid[r + 1][c + 1] === player && grid[r + 2][c + 2] === player && grid[r + 3][c + 3] === player) return true;
        }
      }
      // 4. Diagonal verification (up-right direction)
      for (let r = 3; r < ROWS; r++) {
        for (let c = 0; c < COLS - 3; c++) {
          if (grid[r][c] === player && grid[r - 1][c + 1] === player && grid[r - 2][c + 2] === player && grid[r - 3][c + 3] === player) return true;
        }
      }
      return false;
    }

    function checkDraw() {
      return grid[0].every(val => val !== 0);
    }

    function triggerEndState(humanWon, isDraw = false) {
      gameActive = false;
      resetBtn.classList.remove('hidden');

      if (isDraw) {
        statusMsg.innerText = "GRID_FULL: Neutral tie achieved.";
        escapeBtn.classList.remove('hidden');
      } else if (humanWon) {
        statusMsg.innerHTML = "<span style='color: #00ff33; font-weight: bold;'>BREACH_SUCCESS: Baseline Established!</span>";
        escapeBtn.classList.remove('hidden');
      } else {
        statusMsg.innerHTML = "<span style='color: #ff3333;'>BREACH_FAILED: Firewall locked down!</span>";
      }
    }

    function resetGame() {
      gameActive = true;
      statusMsg.innerText = "Your turn, User (Green)...";
      escapeBtn.classList.add('hidden');
      resetBtn.classList.add('hidden');
      createBoard();
    }

    // Launch configuration engine setup
    createBoard();