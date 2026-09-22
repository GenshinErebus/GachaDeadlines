    const canvas = document.getElementById('tetrisCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('current-score');
    const escapeBtn = document.getElementById('escape-btn');
    const resetBtn = document.getElementById('reset-btn');

    const COLS = 10;
    const ROWS = 20;
    const BLOCK_SIZE = 24;

    let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    let score = 0;
    let isGameOver = false;
    let dropCounter = 0;
    let dropInterval = 1000; 
    let lastTime = 0;

    const SHAPES = [
      [[1,1,1,1]],
      [[1,1,1],[0,1,0]],
      [[1,1,1],[1,0,0]],
      [[1,1,1],[0,0,1]],
      [[1,1],[1,1]],
      [[1,1,0],[0,1,1]],
      [[0,1,1],[1,1,0]]
    ];

    let piece = { matrix: null, x: 0, y: 0 };

    function createPiece() {
      const idx = Math.floor(Math.random() * SHAPES.length);
      piece.matrix = SHAPES[idx];
      piece.y = 0;
      piece.x = Math.floor((COLS - piece.matrix[0].length) / 2);

      if (checkCollision(piece.matrix, piece.x, piece.y)) {
        isGameOver = true;
        resetBtn.classList.remove('hidden');
      }
    }

    function checkCollision(matrix, offsetX, offsetY) {
      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
          if (matrix[r][c] !== 0) {
            let nextX = offsetX + c;
            let nextY = offsetY + r;
            if (nextX < 0 || nextX >= COLS || nextY >= ROWS) return true;
            if (nextY >= 0 && grid[nextY][nextX] !== 0) return true;
          }
        }
      }
      return false;
    }

    function mergePiece() {
      piece.matrix.forEach((row, r) => {
        row.forEach((value, c) => {
          if (value !== 0) grid[piece.y + r][piece.x + c] = 1;
        });
      });
    }

    function playerDrop() {
      if (isGameOver) return;
      piece.y++;
      if (checkCollision(piece.matrix, piece.x, piece.y)) {
        piece.y--;
        mergePiece();
        clearRows();
        createPiece();
      }
      dropCounter = 0;
    }

    function playerMove(dir) {
      if (isGameOver) return;
      piece.x += dir;
      if (checkCollision(piece.matrix, piece.x, piece.y)) piece.x -= dir;
    }

    function playerRotate() {
      if (isGameOver) return;
      const rotated = piece.matrix[0].map((_, i) => piece.matrix.map(row => row[i]).reverse());
      if (!checkCollision(rotated, piece.x, piece.y)) {
        piece.matrix = rotated;
      }
    }

    function clearRows() {
      let rowsCleared = 0;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (grid[r].every(value => value !== 0)) {
          grid.splice(r, 1);
          grid.unshift(Array(COLS).fill(0));
          r++; 
          rowsCleared++;
        }
      }
      if (rowsCleared > 0) {
        score += rowsCleared;
        scoreEl.innerText = score;
        if (score >= 2) escapeBtn.classList.remove('hidden');
      }
    }

    document.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') playerMove(-1);
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') playerMove(1);
      if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') playerDrop();
      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') playerRotate();
    });

    document.getElementById('left-btn').addEventListener('touchstart', (e) => { e.preventDefault(); playerMove(-1); });
    document.getElementById('right-btn').addEventListener('touchstart', (e) => { e.preventDefault(); playerMove(1); });
    document.getElementById('rotate-btn').addEventListener('touchstart', (e) => { e.preventDefault(); playerRotate(); });
    document.getElementById('drop-btn').addEventListener('touchstart', (e) => { e.preventDefault(); playerDrop(); });

    document.getElementById('left-btn').addEventListener('click', () => playerMove(-1));
    document.getElementById('right-btn').addEventListener('click', () => playerMove(1));
    document.getElementById('rotate-btn').addEventListener('click', () => playerRotate());
    document.getElementById('drop-btn').addEventListener('click', () => playerDrop());

    function drawGrid() {
      grid.forEach((row, r) => {
        row.forEach((value, c) => {
          if (value !== 0) {
            ctx.fillStyle = '#0c2c0e';
            ctx.strokeStyle = '#00ff33';
            ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
            ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
          }
        });
      });
    }

    function drawPiece() {
      if (!piece.matrix) return;
      ctx.fillStyle = '#00ff33';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00ff33';
      piece.matrix.forEach((row, r) => {
        row.forEach((value, c) => {
          if (value !== 0) {
            ctx.fillRect((piece.x + c) * BLOCK_SIZE, (piece.y + r) * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
          }
        });
      });
      ctx.shadowBlur = 0;
    }

    function showGameOverScreen() {
      ctx.fillStyle = '#ff3333';
      ctx.shadowColor = '#ff3333';
      ctx.shadowBlur = 8;
      ctx.font = '16px "Courier New"';
      ctx.textAlign = 'center';
      ctx.fillText('STACK_OVERFLOW', canvas.width / 2, canvas.height / 2 - 10);
      ctx.font = '12px "Courier New"';
      ctx.fillText('Click Reset to wipe buffer', canvas.width / 2, canvas.height / 2 + 15);
      ctx.shadowBlur = 0;
    }

    function renderLoop(time = 0) {
      const deltaTime = time - lastTime;
      lastTime = time;
      dropCounter += deltaTime;
      if (dropCounter > dropInterval) playerDrop();
      
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      drawGrid();
      drawPiece();
      
      if (isGameOver) showGameOverScreen();
      else requestAnimationFrame(renderLoop);
    }

    function resetGame() {
      grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
      score = 0;
      scoreEl.innerText = score;
      isGameOver = false;
      escapeBtn.classList.add('hidden');
      resetBtn.classList.add('hidden');
      createPiece();
      lastTime = performance.now();
      renderLoop();
    }

    resetGame();