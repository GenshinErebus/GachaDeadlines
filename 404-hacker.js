    const attemptsContainer = document.getElementById('attempts-box');
    const statusMsg = document.getElementById('status-msg');
    const escapeBtn = document.getElementById('escape-btn');
    const resetBtn = document.getElementById('reset-btn');
    const keypad = document.getElementById('terminal-keypad');

    const maxAttempts = 6;
    const codeLength = 4;

    let secretCode = [];
    let currentAttempt = 0;
    let currentGuess = [];
    let gameActive = true;

    function generateSecretCode() {
      secretCode = [];
      for (let i = 0; i < codeLength; i++) {
        secretCode.push(Math.floor(Math.random() * 10).toString());
      }
    }

    function createGrid() {
      attemptsContainer.innerHTML = '';
      for (let r = 0; r < maxAttempts; r++) {
        const row = document.createElement('div');
        row.className = 'attempt-row';
        row.id = `row-${r}`;

        for (let c = 0; c < codeLength; c++) {
          const box = document.createElement('div');
          box.className = 'digit-box';
          box.id = `box-${r}-${c}`;
          row.appendChild(box);
        }
        attemptsContainer.appendChild(row);
      }
    }

    function setupKeypad() {
      keypad.addEventListener('click', (e) => {
        if (!gameActive || !e.target.classList.contains('key')) return;

        const val = e.target.getAttribute('data-val');

        if (val === 'del') {
          handleDelete();
        } else if (val === 'ent') {
          handleSubmit();
        } else {
          handleNumberInput(val);
        }
      });

      document.addEventListener('keydown', (e) => {
        if (!gameActive) return;
        if (e.key >= '0' && e.key <= '9') handleNumberInput(e.key);
        if (e.key === 'Backspace') handleDelete();
        if (e.key === 'Enter') handleSubmit();
      });
    }

    function handleNumberInput(num) {
      if (currentGuess.length < codeLength) {
        currentGuess.push(num);
        updateVisualRow();
      }
    }

    function handleDelete() {
      if (currentGuess.length > 0) {
        currentGuess.pop();
        updateVisualRow();
      }
    }

    function updateVisualRow() {
      for (let c = 0; c < codeLength; c++) {
        const box = document.getElementById(`box-${currentAttempt}-${c}`);
        box.innerText = currentGuess[c] !== undefined ? currentGuess[c] : '';
      }
    }

    function handleSubmit() {
      if (currentGuess.length < codeLength) {
        statusMsg.innerText = "ERROR: Code length insufficient.";
        return;
      }

      let secretCopy = [...secretCode];
      let guessCopy = [...currentGuess];
      let rowStatuses = Array(codeLength).fill('wrong');

      // Pass 1: Exact matches
      for (let i = 0; i < codeLength; i++) {
        if (guessCopy[i] === secretCopy[i]) {
          rowStatuses[i] = 'correct';
          secretCopy[i] = null;
          guessCopy[i] = null;
        }
      }

      // Pass 2: Partial matches (wrong place)
      for (let i = 0; i < codeLength; i++) {
        if (guessCopy[i] !== null) {
          let matchIndex = secretCopy.indexOf(guessCopy[i]);
          if (matchIndex !== -1) {
            rowStatuses[i] = 'wrong-place';
            secretCopy[matchIndex] = null;
          }
        }
      }

      // Update grid box colors
      for (let i = 0; i < codeLength; i++) {
        const box = document.getElementById(`box-${currentAttempt}-${i}`);
        box.classList.add(rowStatuses[i]);
      }

      const isCorrect = rowStatuses.every(status => status === 'correct');

      if (isCorrect) {
        gameActive = false;
        statusMsg.innerHTML = "<span style='color: #00ff33; font-weight: bold;'>ACCESS_GRANTED: Path Unlocked!</span>";
        escapeBtn.classList.remove('hidden');
        keypad.classList.add('hidden');
      } else {
        currentAttempt++;
        currentGuess = [];

        if (currentAttempt >= maxAttempts) {
          gameActive = false;
          statusMsg.innerHTML = `<span style='color: #ff3333;'>DECRYPTION_FAILED! PIN: ${secretCode.join('')}</span>`;
          resetBtn.classList.remove('hidden');
          keypad.classList.add('hidden');
        } else {
          statusMsg.innerText = `Attempts remaining: ${maxAttempts - currentAttempt}`;
        }
      }
    }

    function resetGame() {
      currentAttempt = 0;
      currentGuess = [];
      gameActive = true;
      statusMsg.innerText = `Attempts remaining: ${maxAttempts}`;
      escapeBtn.classList.add('hidden');
      resetBtn.classList.add('hidden');
      keypad.classList.remove('hidden');
      generateSecretCode();
      createGrid();
    }

    generateSecretCode();
    createGrid();
    setupKeypad();