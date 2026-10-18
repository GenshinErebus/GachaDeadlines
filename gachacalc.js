   // ============================================================
    // CONFIGURATION: Game-specific data
    // Each game stores its own values under its own storage keys,
    // so entries never bleed from one game into another.
    // ============================================================
    const GAMES = [
      {
        id: 'genshin',
        emoji: '✨',
        name: 'Genshin Impact',
        ticketName: 'Intertwined Fate',
        currencyName: 'Primogems',
        ratio: 160
      },
      {
        id: 'hsr',
        emoji: '🚂',
        name: 'Honkai Star Rail',
        ticketName: 'Star Rail Special Pass',
        currencyName: 'Stellar Jade',
        ratio: 160
      },
      {
        id: 'zzz',
        emoji: '📼',
        name: 'Zenless Zone Zero',
        ticketName: 'Encrypted Master Tape',
        currencyName: 'Polychrome',
        ratio: 160
      },
      {
        id: 'arknights',
        emoji: '🏗️',
        name: 'Arknights Endfield',
        ticketName: 'Chartered HH Permit',
        currencyName: 'Oroberyl',
        ratio: 500
      },
      {
        id: 'dna',
        emoji: '🌙',
        name: 'Duet Night Abyss',
        ticketName: 'Prismatic Hourglass',
        currencyName: 'Phoxene Plumule',
        ratio: 160
      },
      {
        id: 'nte',
        emoji: '🎲',
        name: 'Neverness To Everness',
        ticketName: 'Solid Dice / Tri-Key',
        currencyName: 'Annulith',
        ratio: 160
      },
      {
        id: 'reverse1999',
        emoji: '⏳',
        name: 'Reverse 1999',
        ticketName: 'Unilog',
        currencyName: 'Clear Drop',
        ratio: 180
      },
      {
        id: 'wuwa',
        emoji: '🌊',
        name: 'Wuthering Waves',
        ticketName: 'Radiant Tide / Forging Tide',
        currencyName: 'Astrite',
        ratio: 160
      }
    ];

    // LocalStorage key for the currently selected game
    const LS_KEY_GAME = 'gacha_selected_game';

    // DOM Elements
    const gameListEl = document.getElementById('gameList');
    const inputSectionEl = document.getElementById('inputSection');
    const resultSectionEl = document.getElementById('resultSection');
    const ticketLabelEl = document.getElementById('ticketLabel');
    const currencyLabelEl = document.getElementById('currencyLabel');
    const ticketInputEl = document.getElementById('ticketInput');
    const currencyInputEl = document.getElementById('currencyInput');
    const resultMainEl = document.getElementById('resultMain');
    const resultSubEl = document.getElementById('resultSub');
    const statusMsgEl = document.getElementById('statusMsg');
    const resetBtnEl = document.getElementById('resetBtn');
    const clockEl = document.getElementById('clock');

    // Currently selected game id
    let currentGameId = null;

    // ============================================================
    // INITIALIZATION
    // ============================================================
    function init() {
      renderGameList();
      restoreSelectedGame();
      startClock();

      document.getElementById('calculatorForm').addEventListener('submit', handleCalculate);
      resetBtnEl.addEventListener('click', handleReset);

      // Save immediately on every keystroke. No debounce, because a
      // delayed write could land in the wrong game's slot after a switch.
      ticketInputEl.addEventListener('input', saveGameData);
      currencyInputEl.addEventListener('input', saveGameData);
    }

    // ============================================================
    // STORAGE KEYS
    // Every game gets its own isolated pair of keys.
    // ============================================================
    function getStorageKey(gameId, type) {
      return `gacha_${type}_${gameId}`;
    }

    // ============================================================
    // GAME LIST
    // ============================================================
    function renderGameList() {
      gameListEl.innerHTML = '';
      GAMES.forEach(game => {
        const btn = document.createElement('button');
        btn.className = 'game';
        btn.dataset.id = game.id;
        btn.innerHTML = `<span class="emoji">${game.emoji}</span>${game.name}`;
        btn.addEventListener('click', () => selectGame(game.id));
        gameListEl.appendChild(btn);
      });
      updateGameSelectionUI();
    }

    function selectGame(gameId) {
      // Persist whatever is currently typed before leaving the old game.
      saveGameData();

      currentGameId = gameId;
      localStorage.setItem(LS_KEY_GAME, gameId);

      updateGameSelectionUI();
      inputSectionEl.classList.remove('hidden');
      updateLabels();

      // Swap in THIS game's values (or blanks if it has none yet).
      loadGameData();
      calculateResult();
    }

    function updateGameSelectionUI() {
      gameListEl.querySelectorAll('.game').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.id === currentGameId);
      });
    }

    // ============================================================
    // PER-GAME LOAD / SAVE
    // ============================================================
    function loadGameData() {
      if (!currentGameId) return;

      const savedTickets = localStorage.getItem(getStorageKey(currentGameId, 'tickets'));
      const savedCurrency = localStorage.getItem(getStorageKey(currentGameId, 'currency'));

      // Explicitly fall back to an empty string, never to the previous game's value.
      ticketInputEl.value = savedTickets !== null ? savedTickets : '';
      currencyInputEl.value = savedCurrency !== null ? savedCurrency : '';
    }

    function saveGameData() {
      if (!currentGameId) return;

      localStorage.setItem(getStorageKey(currentGameId, 'tickets'), ticketInputEl.value);
      localStorage.setItem(getStorageKey(currentGameId, 'currency'), currencyInputEl.value);
    }

    function restoreSelectedGame() {
      const savedGame = localStorage.getItem(LS_KEY_GAME);
      if (savedGame && GAMES.some(g => g.id === savedGame)) {
        currentGameId = savedGame;
        updateGameSelectionUI();
        inputSectionEl.classList.remove('hidden');
        updateLabels();
        loadGameData();
        calculateResult();
      }
    }

    function updateLabels() {
      const game = GAMES.find(g => g.id === currentGameId);
      if (!game) return;
      ticketLabelEl.textContent = game.ticketName;
      currencyLabelEl.textContent = game.currencyName;
    }

    // ============================================================
    // CALCULATION
    // ============================================================
    function handleCalculate(e) {
      e.preventDefault();
      saveGameData();
      calculateResult();
      showStatus('Calculation updated successfully!', 'info');
    }

    function calculateResult() {
      if (!currentGameId) return;

      const game = GAMES.find(g => g.id === currentGameId);
      if (!game) return;

      const tickets = Math.max(0, parseInt(ticketInputEl.value, 10) || 0);
      const currency = Math.max(0, parseInt(currencyInputEl.value, 10) || 0);

      // Whole pulls only: an incomplete pull is not a pull.
      const convertedPulls = Math.floor(currency / game.ratio);
      const totalPulls = tickets + convertedPulls;
      const remainder = currency % game.ratio;

      resultSectionEl.classList.remove('hidden');
      resultMainEl.textContent = totalPulls.toLocaleString();

      // Breakdown line
      const parts = [];
      if (convertedPulls > 0) {
        parts.push(`${convertedPulls.toLocaleString()} from ${game.currencyName}`);
      }
      if (tickets > 0) {
        parts.push(`${tickets.toLocaleString()} ${game.ticketName}`);
      }

      let subText = parts.length ? parts.join(' + ') : 'No entries yet';
      if (remainder > 0) {
        subText += ` (${remainder.toLocaleString()} ${game.currencyName} left over)`;
      }
      resultSubEl.textContent = subText;
    }

    // ============================================================
    // RESET (current game only)
    // ============================================================
    function handleReset() {
      if (!currentGameId) return;

      const game = GAMES.find(g => g.id === currentGameId);
      const label = game ? game.name : 'this game';

      if (confirm(`Clear all saved data for ${label}?`)) {
        localStorage.removeItem(getStorageKey(currentGameId, 'tickets'));
        localStorage.removeItem(getStorageKey(currentGameId, 'currency'));
        ticketInputEl.value = '';
        currencyInputEl.value = '';
        calculateResult();
        showStatus(`Data cleared for ${label}.`, 'info');
      }
    }

    // ============================================================
    // UI HELPERS
    // ============================================================
    function showStatus(message, type = 'info') {
      statusMsgEl.textContent = message;
      statusMsgEl.className = `status ${type}`;
      statusMsgEl.classList.remove('hidden');
      setTimeout(() => statusMsgEl.classList.add('hidden'), 3000);
    }

    function startClock() {
      function updateTime() {
        clockEl.textContent = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      updateTime();
      setInterval(updateTime, 1000);
    }

    init();