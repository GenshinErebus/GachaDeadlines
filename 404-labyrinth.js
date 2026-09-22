    const mazeContainer = document.getElementById('maze');
    const statusText = document.getElementById('status');
    const escapeBtn = document.getElementById('escape-btn');
    const resetBtn = document.getElementById('reset-btn');

    const width = 12;
    const height = 12;
    
    let layout = [];
    let playerIndex = 0;
    let goalIndex = 0;
    let gameActive = true;

    // ===========================================
    // GUARANTEED SOLVABLE MAZE GENERATOR
    // ===========================================
    function generateSolvedMaze() {
      // Step 1: Initialize full walls
      layout = new Array(width * height).fill(1);

      // Step 2: Recursive Backtracking (creates PERFECT maze)
      carvePassages(1, 1);

      // Step 3: Set start position (top-left inside border)
      playerIndex = 1 * width + 1;
      layout[playerIndex] = 0;

      // Step 4: Find valid goal position in bottom-right area
      goalIndex = findValidGoalPosition();
      layout[goalIndex] = 0;

      // Step 5: Verify path exists with BFS
      const pathExists = verifyPathExists(playerIndex, goalIndex);
      
      if (!pathExists) {
        console.error('Maze generation failed - no path exists');
        return false;
      }

      return true;
    }

    // DFS-based recursive backtracking
    function carvePassages(x, y) {
      layout[y * width + x] = 0;

      const directions = [
        { dx: 0, dy: -2 },
        { dx: 2, dy: 0 },
        { dx: 0, dy: 2 },
        { dx: -2, dy: 0 }
      ];

      shuffleArray(directions);

      for (const dir of directions) {
        const nx = x + dir.dx;
        const ny = y + dir.dy;

        if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1) {
          if (layout[ny * width + nx] === 1) {
            layout[(y + dir.dy / 2) * width + (x + dir.dx / 2)] = 0;
            carvePassages(nx, ny);
          }
        }
      }
    }

    function findValidGoalPosition() {
      const candidates = [];
      
      // Search bottom-right quadrant first
      for (let y = height - 3; y >= Math.floor(height / 2); y--) {
        for (let x = width - 3; x >= Math.floor(width / 2); x--) {
          const idx = y * width + x;
          if (layout[idx] === 0 && !(x === 1 && y === 1)) {
            candidates.push(idx);
          }
        }
      }

      // Fallback: any path cell except start
      if (candidates.length === 0) {
        for (let i = layout.length - 1; i >= 0; i--) {
          if (layout[i] === 0 && i !== playerIndex) {
            candidates.push(i);
          }
        }
      }

      return candidates.length > 0 
        ? candidates[Math.floor(Math.random() * candidates.length)]
        : (width - 2) * width + (width - 2);
    }

    function verifyPathExists(startIdx, goalIdx) {
      if (layout[startIdx] === 1 || layout[goalIdx] === 1) return false;

      const visited = new Array(layout.length).fill(false);
      const queue = [startIdx];
      visited[startIdx] = true;

      while (queue.length > 0) {
        const current = queue.shift();

        if (current === goalIdx) return true;

        const cx = current % width;
        const cy = Math.floor(current / width);

        const neighbors = [
          { dx: 0, dy: -1 },
          { dx: 0, dy: 1 },
          { dx: -1, dy: 0 },
          { dx: 1, dy: 0 }
        ];

        for (const { dx, dy } of neighbors) {
          const nx = cx + dx;
          const ny = cy + dy;

          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            const neighborIdx = ny * width + nx;
            if (!visited[neighborIdx] && layout[neighborIdx] === 0) {
              visited[neighborIdx] = true;
              queue.push(neighborIdx);
            }
          }
        }
      }

      return false;
    }

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    // ===========================================
    // RENDER MAZE (FIXED!)
    // ===========================================
    function renderMaze() {
      console.log('Rendering maze:', layout.length, 'cells');
      mazeContainer.innerHTML = '';
      
      for (let i = 0; i < layout.length; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');

        if (i === playerIndex) {
          cell.classList.add('path', 'player');
          console.log('Player at:', i);
        } else if (i === goalIndex) {
          cell.classList.add('path', 'goal');
          console.log('Goal at:', i);
        } else if (layout[i] === 1) {
          cell.classList.add('wall');
        } else {
          cell.classList.add('path');
        }

        mazeContainer.appendChild(cell);
      }
      
      console.log('Maze rendered successfully');
    }

    // ===========================================
    // PLAYER MOVEMENT
    // ===========================================
    function movePlayer(direction) {
      if (!gameActive) return;

      let newIndex = playerIndex;

      switch (direction) {
        case 'up':    newIndex = playerIndex - width; break;
        case 'down':  newIndex = playerIndex + width; break;
        case 'left':  newIndex = playerIndex - 1; break;
        case 'right': newIndex = playerIndex + 1; break;
      }

      if (newIndex >= 0 && newIndex < layout.length && layout[newIndex] !== 1) {
        const cells = document.querySelectorAll('.cell');
        cells[playerIndex].classList.remove('player');

        playerIndex = newIndex;
        cells[playerIndex].classList.add('player');

        checkWin();
      }
    }

    function checkWin() {
      if (playerIndex === goalIndex) {
        gameActive = false;
        statusText.innerHTML = "<span style='color:#00ff33;font-weight:bold'>✓ ROUTE_ESTABLISHED!</span>";
        escapeBtn.classList.remove('hidden');
        resetBtn.classList.remove('hidden');
      }
    }

    function generateNewMaze() {
      statusText.innerHTML = "Generating maze...";
      escapeBtn.classList.add('hidden');
      resetBtn.classList.add('hidden');
      
      // Generate the maze
      const success = generateSolvedMaze();
      
      if (!success) {
        statusText.innerHTML = "<span style='color:#ff3333'>ERROR: Failed to generate</span>";
        console.error('Maze generation failed!');
        return;
      }
      
      // CRITICAL: Render the maze AFTER generation
      gameActive = true;
      renderMaze();
      statusText.innerHTML = "<span style='color:#00ff33'>Maze ready - Navigate to red goal!</span>";
    }

    // ===========================================
    // EVENT LISTENERS
    // ===========================================
    document.addEventListener('keydown', (e) => {
      if (!gameActive) return;
      
      const key = e.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') { movePlayer('up'); e.preventDefault(); }
      if (key === 'arrowdown' || key === 's') { movePlayer('down'); e.preventDefault(); }
      if (key === 'arrowleft' || key === 'a') { movePlayer('left'); e.preventDefault(); }
      if (key === 'arrowright' || key === 'd') { movePlayer('right'); e.preventDefault(); }
    });

    ['btn-up', 'btn-down', 'btn-left', 'btn-right'].forEach(id => {
      const btn = document.getElementById(id);
      const direction = id.replace('btn-', '');
      
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        movePlayer(direction);
      }, { passive: false });
      
      btn.addEventListener('click', () => movePlayer(direction));
    });

    // ===========================================
    // INITIALIZATION (FIXED - Direct call)
    // ===========================================
    console.log('Initializing maze...');
    generateNewMaze();