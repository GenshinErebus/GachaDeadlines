    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('status');
    const resetBtn = document.getElementById('reset-btn');
    const escapeBtn = document.getElementById('escape-btn');

    let gameState = ["", "", "", "", "", "", "", "", ""];
    let isGameActive = true;
    const humanPlayer = "X";
    const aiPlayer = "O";

    const winningConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', resetGame);

    function handleCellClick(e) {
      const clickedCell = e.target;
      const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

      if (gameState[clickedCellIndex] !== "" || !isGameActive) return;

      makeMove(clickedCell, clickedCellIndex, humanPlayer);
      
      if (!checkWin(humanPlayer) && !checkDraw()) {
        statusText.innerText = "AI processing next step...";
        isGameActive = false; 
        setTimeout(aiMove, 400); 
      }
    }

    function makeMove(cell, index, player) {
      gameState[index] = player;
      cell.innerText = player;
      cell.classList.add('taken');
    }

    function aiMove() {
      let move = findBestMove(aiPlayer) ?? findBestMove(humanPlayer) ?? pickRandomMove();

      if (move !== null) {
        const targetCell = document.querySelector(`[data-index="${move}"]`);
        makeMove(targetCell, move, aiPlayer);
      }

      isGameActive = true;

      if (!checkWin(aiPlayer)) {
        checkDraw();
      }
    }

    function findBestMove(player) {
      for (let condition of winningConditions) {
        let count = 0;
        let emptyIndex = null;
        for (let index of condition) {
          if (gameState[index] === player) count++;
          else if (gameState[index] === "") emptyIndex = index;
        }
        if (count === 2 && emptyIndex !== null) return emptyIndex;
      }
      return null;
    }

    function pickRandomMove() {
      let emptyCells = [];
      gameState.forEach((val, idx) => { if (val === "") emptyCells.push(idx); });
      if (emptyCells.length === 0) return null;
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    function checkWin(player) {
      let roundWon = false;
      for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') continue;
        if (a === b && b === c && a === player) {
          roundWon = true;
          break;
        }
      }

      if (roundWon) {
        isGameActive = false;
        if (player === humanPlayer) {
          statusText.innerHTML = "<span style='color: #00ff33;'>SUCCESS: Sentinel bypassed!</span>";
        } else {
          statusText.innerHTML = "<span style='color: #ff3333;'>FAILURE: Sentinel wins. Try again.</span>";
        }
        unlockEscape();
        return true;
      }
      return false;
    }

    function checkDraw() {
      if (!gameState.includes("")) {
        statusText.innerText = "TIE: Draw state achieved. Good enough.";
        isGameActive = false;
        unlockEscape();
        return true;
      }
      if (isGameActive && gameState.includes("")) {
        statusText.innerText = "Your turn, User (X)...";
      }
      return false;
    }

    function unlockEscape() {
      escapeBtn.classList.remove('hidden');
    }

    function resetGame() {
      gameState = ["", "", "", "", "", "", "", "", ""];
      isGameActive = true;
      statusText.innerText = "Your turn, User (X)...";
      cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove('taken');
      });
    }