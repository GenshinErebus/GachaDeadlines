/** Game Configuration with Energy Regeneration Rates  */
const GAMES = {
  genshin: {
    name: "Genshin Impact",
    maxEnergy: 200,
    regenPerMinute: 1 / 8,
    storedKey: "energy_genshin"
  },
  hsr: {
    name: "Honkai: Star Rail",
    maxEnergy: 300,
    regenPerMinute: 1 / 6,
    storedKey: "energy_hsr"
  },
  zzz: {
    name: "Zenless Zone Zero",
    maxEnergy: 240,
    regenPerMinute: 1 / 6,
    storedKey: "energy_zzz"
  },
  arknights: {
    name: "Arknights Endfield",
    maxEnergy: 360,
    regenPerMinute: 1 / 7.2,  //1 energy each 7min 12s
    storedKey: "energy_arknights"
  },
  neverness: {
    name: "Neverness To Everness",
    maxEnergy: 360,
    regenPerMinute: 1 / 6,
    storedKey: "energy_neverness"
  },
  reverse1999: {
    name: "Reverse 1999",
    maxEnergy: 240,
    regenPerMinute: 1 / 6,
    storedKey: "energy_reverse1999"
  },
  wuthering: {
    name: "Wuthering Waves",
    maxEnergy: 240,
    regenPerMinute: 1 / 6,
    storedKey: "energy_wuthering"
  }
};

class EnergyTracker {
  constructor() {
    this.games = {};
    this.updateInterval = null;
    this.init();
  }

  init() {
    Object.keys(GAMES).forEach(key => {
      const stored = localStorage.getItem(GAMES[key].storedKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          this.games[key] = {
            currentEnergy: typeof parsed.currentEnergy === 'number' ? parsed.currentEnergy : GAMES[key].maxEnergy,
            lastUpdate: typeof parsed.lastUpdate === 'number' ? parsed.lastUpdate : Date.now()
          };
        } catch (e) {
          this.games[key] = { currentEnergy: GAMES[key].maxEnergy, lastUpdate: Date.now() };
        }
      } else {
        this.games[key] = { currentEnergy: GAMES[key].maxEnergy, lastUpdate: Date.now() };
      }
    });

    this.render();
    this.startTimer();
  }

  startTimer() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.updateInterval = setInterval(() => {
      this.updateTimers();
    }, 1000);
  }

  updateTimers() {
    const now = Date.now();

    Object.keys(this.games).forEach(gameKey => {
      const timerElement = document.getElementById(`timer-${gameKey}`);
      if (!timerElement) return;

      const gameData = this.games[gameKey];
      const config = GAMES[gameKey];

      if (!gameData || !config) return;

      const deficit = Math.max(0, config.maxEnergy - gameData.currentEnergy);

      if (deficit <= 0) {
        timerElement.innerHTML = '<span class="full-energy-text">Fully Charged!</span>';
        return;
      }

      const elapsedMinutes = (now - gameData.lastUpdate) / 60000;
      const elapsedPoints = elapsedMinutes * config.regenPerMinute;
      const effectiveDeficit = Math.max(0, deficit - elapsedPoints);

      if (effectiveDeficit <= 0) {
        timerElement.innerHTML = '<span class="full-energy-text">Fully Charged!</span>';
        return;
      }

      const minutesNeeded = effectiveDeficit / config.regenPerMinute;
      const millisecondsNeeded = minutesNeeded * 60 * 1000;

      timerElement.innerHTML = `<span>${this.formatTime(millisecondsNeeded)}</span>`;
    });
  }

  save(gameKey) {
    localStorage.setItem(GAMES[gameKey].storedKey, JSON.stringify({
      currentEnergy: this.games[gameKey].currentEnergy,
      lastUpdate: this.games[gameKey].lastUpdate
    }));
  }

  updateEnergy(gameKey, value) {
    const game = GAMES[gameKey];
    let current = parseInt(value, 10);

    if (isNaN(current) || !Number.isFinite(current)) {
      alert('Please enter a valid number');
      return;
    }

    current = Math.min(Math.max(0, current), game.maxEnergy);

    this.games[gameKey] = {
      currentEnergy: current,
      lastUpdate: Date.now()
    };

    this.save(gameKey);
    this.render();
  }

  formatTime(ms) {
    if (!ms || ms <= 0 || isNaN(ms) || !Number.isFinite(ms)) {
      return "Fully Charged!";
    }

    const totalSeconds = Math.ceil(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');

    return `~${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  }

  render() {
    const grid = document.getElementById("gameGrid");
    grid.innerHTML = "";

    Object.entries(GAMES).forEach(([key, config]) => {
      const gameData = this.games[key];

      if (!gameData || !config) return;

      const deficit = Math.max(0, config.maxEnergy - gameData.currentEnergy);
      const isFull = deficit <= 0;
      const regenerationMinutes = Math.round(1 / config.regenPerMinute);

      const card = document.createElement("div");
      card.className = "game-card";

      card.innerHTML = `
        <div class="game-title">${config.name}</div>
        
        <div class="regen-info">
          Max: ${config.maxEnergy} | Regen: 1/${regenerationMinutes}min
        </div>
        
        <div class="energy-input-group">
          <label>Current Energy:</label>
          <input type="number" 
                 id="input-${key}" 
                 min="0" 
                 max="${config.maxEnergy}" 
                 value="${gameData.currentEnergy}">
        </div>
        
        <button class="btn-update" onclick="tracker.updateEnergy('${key}', document.getElementById('input-${key}').value)">
          Update
        </button>
        
        <div class="timer-display">
          <div id="timer-${key}" class="timer-value ${isFull ? "full-energy-text" : ""}">
            ${isFull ? "Fully Charged!" : "~--:--:--"}
          </div>
          <div class="timer-label">${isFull ? "" : "Until Full Energy"}</div>
        </div>
        
        <div class="progress-bar">
          <div class="progress-fill" id="progress-${key}" style="width: ${Math.min(100, Math.max(0, (gameData.currentEnergy / config.maxEnergy) * 100))}%"></div>
        </div>
        
        <div class="energy-count">
          ${gameData.currentEnergy} / ${config.maxEnergy}
        </div>
      `;

      grid.appendChild(card);
    });
  }
}

let tracker;
document.addEventListener("DOMContentLoaded", () => {
  tracker = new EnergyTracker();
});