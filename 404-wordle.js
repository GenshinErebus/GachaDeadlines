    const gridContainer = document.getElementById('wordle-grid');
    const statusMsg = document.getElementById('status-msg');
    const escapeBtn = document.getElementById('escape-btn');
    const resetBtn = document.getElementById('reset-btn');
    const keyboard = document.getElementById('v-keyboard');

    const maxTries = 6;
    const wordLength = 5;
    const TECH_WORDS = ["LINUX", "ARRAY", "CYBER", "LOGIC", "PROXY", "STACK", "NODES", "RESET", "ADMIN", "MOUSE", "PIXEL"];

    let secretWord = "";
    let currentTry = 0;
    let currentGuess = [];
    let gameActive = true;

    function initGame() {
      secretWord = TECH_WORDS[Math.floor(Math.random() * TECH_WORDS.length)];
      currentTry = 0;
      currentGuess = [];
      gameActive = true;

      statusMsg.innerText = "Tries left: " + maxTries;
      escapeBtn.classList.add('hidden');
      resetBtn.classList.add('hidden');
      keyboard.classList.remove('hidden');

      gridContainer.innerHTML = '';
      for (let r = 0; r < maxTries; r++) {
        const row = document.createElement('div');
        row.className = 'word-row';
        for (let c = 0; c < wordLength; c++) {
          const box = document.createElement('div');
          box.className = 'letter-box';
          box.id = "box-" + r + "-" + c;
          row.appendChild(box);
        }
        gridContainer.appendChild(row);
      }
    }

    keyboard.addEventListener('click', (e) => {
      if (!gameActive || !e.target.classList.contains('key')) return;
      const keyEl = e.target;
      if (keyEl.id === 'key-del') {
        handleDelete();
      } else if (keyEl.id === 'key-ent') {
        handleSubmit();
      } else {
        handleLetterInput(keyEl.innerText);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!gameActive) return;
      const key = e.key.toUpperCase();
      if (key === 'BACKSPACE') handleDelete();
      if (key === 'ENTER') handleSubmit();
      if (key.length === 1 && key >= 'A' && key <= 'Z') handleLetterInput(key);
    });

    function handleLetterInput(letter) {
      if (currentGuess.length < wordLength) {
        currentGuess.push(letter);
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
      for (let c = 0; c < wordLength; c++) {
        const box = document.getElementById("box-" + currentTry + "-" + c);
        box.innerText = currentGuess[c] !== undefined ? currentGuess[c] : '';
      }
    }

    function displayRemainingTries() {
      const remaining = maxTries - currentTry;
      statusMsg.innerText = "Tries left: " + remaining;
    }

    function handleSubmit() {
      if (currentGuess.length < wordLength) {
        statusMsg.innerText = "ERROR: Token length insufficient.";
        return;
      }

      let secretCopy = secretWord.split('');
      let rowStatuses = Array(wordLength).fill('absent');

      for (let i = 0; i < wordLength; i++) {
        if (currentGuess[i] === secretCopy[i]) {
          rowStatuses[i] = 'correct';
          secretCopy[i] = null;
          currentGuess[i] = null;
        }
      }

      for (let i = 0; i < wordLength; i++) {
        if (currentGuess[i] !== null) {
          let idx = secretCopy.indexOf(currentGuess[i]);
          if (idx !== -1) {
            rowStatuses[i] = 'present';
            secretCopy[idx] = null;
          }
        }
      }

      for (let i = 0; i < wordLength; i++) {
        const box = document.getElementById("box-" + currentTry + "-" + i);
        box.classList.add(rowStatuses[i]);
      }

      if (rowStatuses.every(status => status === 'correct')) {
        gameActive = false;
        statusMsg.innerHTML = "<span style='color:#00ff33;font-weight:bold;'>ACCESS_GRANTED! Decryption Successful!</span>";
        escapeBtn.classList.remove('hidden');
        keyboard.classList.add('hidden');
      } else {
        currentTry++;
        currentGuess = [];

        if (currentTry >= maxTries) {
          gameActive = false;
          statusMsg.innerHTML = "<span style='color:#ff3333;'>DECRYPTION_FAILED! Token was: " + secretWord + "</span>";
          resetBtn.classList.remove('hidden');
          keyboard.classList.add('hidden');
        } else {
          displayRemainingTries();
        }
      }
    }

    function resetGame() {
      initGame();
    }

    initGame();