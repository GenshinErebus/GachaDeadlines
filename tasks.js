// ============================================================
// PART 1: DAILY/WEEKLY TASK TRACKER
// ============================================================

// Add your games here - the UI updates automatically!
// This list drives BOTH the daily and the weekly section.
const GAMES_LIST = [
    "Genshin Impact",
    "Honkai: Star Rail",
    "Zenless Zone Zero",
    "Arknights Endfield",
    "Duet Night Abyss",
    "Neverness To Everness",
    "Reverse 1999",
    "Wuthering Waves"
];

/**
 * Get today's date string in YYYY-MM-DD format
 */
function getTodayString() {
    const today = new Date();
    return today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');
}

/**
 * Get the current week's identifier
 * Returns the date of the Monday of the current week (YYYY-MM-DD)
 * Resets when Monday 00:00 begins
 */
function getCurrentWeekString() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ...
    // Sunday (0) wraps back 6 days to the previous Monday
    const offsetToMonday = (day === 0) ? 6 : (day - 1);
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offsetToMonday);
    return monday.getFullYear() + '-' +
        String(monday.getMonth() + 1).padStart(2, '0') + '-' +
        String(monday.getDate()).padStart(2, '0');
}

/**
 * Generates a clean key for LocalStorage from the game name
 */
function getStorageKey(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Renders one card (daily or weekly) into the given container
 */
function renderCard(container, game, type) {
    const key = getStorageKey(game);
    
    // Weekly and daily keys stay separate in LocalStorage,
    // so a daily check-in does NOT count as the weekly one.
    const periodKey = type === 'weekly' ? `week_${key}` : `date_${key}`;

    if (type === 'weekly') {
        // Reset if the week is over (midnight Sunday → Monday)
        const lastWeek = localStorage.getItem(periodKey);
        if (lastWeek !== getCurrentWeekString()) {
            localStorage.removeItem(`status_${key}_weekly`);
        }
    } else {
        // Reset if midnight has passed since the last check-in
        const lastCheckInDate = localStorage.getItem(periodKey);
        if (lastCheckInDate !== getTodayString()) {
            localStorage.removeItem(`status_${key}_daily`);
        }
    }

    const statusId = `status_${key}_${type}`;
    const btnId = `btn_${key}_${type}`;
    const storedStatus = type === 'weekly'
        ? localStorage.getItem(`status_${key}_weekly`)
        : localStorage.getItem(`status_${key}_daily`);
    const isChecked = storedStatus === 'true';

    const card = document.createElement('div');
    card.className = type === 'weekly' ? 'game-card weekly-card' : 'game-card';
    card.id = `card_${key}_${type}`;

    card.innerHTML = `
        <h2 class="game-title">${game}</h2>
        <div id="${statusId}" class="status ${isChecked ? 'checked' : 'not-checked'}">
            ${isChecked ? '✅ Cleared' : '❌ To Do'}
        </div>
        <button id="${btnId}" onclick="doCheckIn('${game}', '${type}')" ${isChecked ? 'disabled' : ''}>
            ${isChecked ? (type === 'weekly' ? 'Done for the week' : 'Done for today') : 'Done?'}
        </button>
    `;
    container.appendChild(card);
}

/**
 * Initialize the task dashboard
 */
function initTaskTracker() {
    const dailyContainer = document.getElementById('gamesContainer');
    const weeklyContainer = document.getElementById('weeklyContainer');

    GAMES_LIST.forEach(game => renderCard(dailyContainer, game, 'daily'));
    GAMES_LIST.forEach(game => renderCard(weeklyContainer, game, 'weekly'));
}

/**
 * Handles the check-in event for a specific task (daily or weekly)
 */
function doCheckIn(name, type) {
    const key = getStorageKey(name);
    const statusId = `status_${key}_${type}`;
    const btnId = `btn_${key}_${type}`;

    // Save status + corresponding period identifier
    localStorage.setItem(`status_${key}_${type}`, 'true');
    if (type === 'weekly') {
        localStorage.setItem(`week_${key}`, getCurrentWeekString());
    } else {
        localStorage.setItem(`date_${key}`, getTodayString());
    }

    // Update the UI immediately
    const statusBox = document.getElementById(statusId);
    const button = document.getElementById(btnId);

    statusBox.textContent = "✅ Cleared";
    statusBox.className = "status checked";
    button.disabled = true;
    button.textContent = type === 'weekly' ? "Done for the week" : "Done for today";
}

// ============================================================
// PART 2: ENERGY TRACKER
// ============================================================

/**
 * Game Configuration with Energy Regeneration Rates
 */
const ENERGY_GAMES = {
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
        regenPerMinute: 1 / 7.2, // 1 energy each 7min 12s
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

/**
 * Energy Tracker Class - manages energy regeneration timers
 */
class EnergyTracker {
    constructor() {
        this.games = {};
        this.updateInterval = null;
        this.init();
    }

    /**
     * Initialize the energy tracker - load saved data from localStorage
     */
    init() {
        Object.keys(ENERGY_GAMES).forEach(key => {
            const stored = localStorage.getItem(ENERGY_GAMES[key].storedKey);
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    this.games[key] = {
                        currentEnergy: typeof parsed.currentEnergy === 'number' ? parsed.currentEnergy : ENERGY_GAMES[key].maxEnergy,
                        lastUpdate: typeof parsed.lastUpdate === 'number' ? parsed.lastUpdate : Date.now()
                    };
                } catch (e) {
                    this.games[key] = { currentEnergy: ENERGY_GAMES[key].maxEnergy, lastUpdate: Date.now() };
                }
            } else {
                this.games[key] = { currentEnergy: ENERGY_GAMES[key].maxEnergy, lastUpdate: Date.now() };
            }
        });

        this.render();
        this.startTimer();
    }

    /**
     * Start the timer update loop (runs every second)
     */
    startTimer() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        this.updateInterval = setInterval(() => {
            this.updateTimers();
        }, 1000);
    }

    /**
     * Update all timer displays with current calculated energy levels
     */
    updateTimers() {
        const now = Date.now();

        Object.keys(this.games).forEach(gameKey => {
            const timerElement = document.getElementById(`timer-${gameKey}`);
            const countElement = document.getElementById(`count-${gameKey}`);
            const progressElement = document.getElementById(`progress-${gameKey}`);

            if (!timerElement) return;

            const gameData = this.games[gameKey];
            const config = ENERGY_GAMES[gameKey];

            if (!gameData || !config) return;

            // Effective energy = stored value + regenerated points since last update
            const elapsedMinutes = (now - gameData.lastUpdate) / 60000;
            const regenerated = elapsedMinutes * config.regenPerMinute;
            const effectiveEnergy = Math.min(config.maxEnergy,
                gameData.currentEnergy + regenerated);

            // Live counter display (rounded down)
            if (countElement) {
                countElement.textContent = `${Math.floor(effectiveEnergy)} / ${config.maxEnergy}`;
            }

            // Update progress bar
            if (progressElement) {
                progressElement.style.width =
                    `${Math.min(100, (effectiveEnergy / config.maxEnergy) * 100)}%`;
            }

            if (effectiveEnergy >= config.maxEnergy) {
                timerElement.innerHTML = '<span class="full-energy-text">Fully Charged!</span>';

                // Clear timer label when fully charged
                const timerLabel = timerElement.nextElementSibling;
                if (timerLabel && timerLabel.classList.contains('timer-label')) {
                    timerLabel.textContent = '';
                }

                return;
            }

            // Set timer label when not full
            const timerLabel = timerElement.nextElementSibling;
            if (timerLabel && timerLabel.classList.contains('timer-label')) {
                timerLabel.textContent = 'Until Full Energy';
            }

            const deficit = config.maxEnergy - effectiveEnergy;
            const minutesNeeded = deficit / config.regenPerMinute;
            const millisecondsNeeded = minutesNeeded * 60 * 1000;

            timerElement.innerHTML = `<span>${this.formatTime(millisecondsNeeded)}</span>`;
        });
    }

    /**
     * Save game energy state to localStorage
     */
    save(gameKey) {
        localStorage.setItem(ENERGY_GAMES[gameKey].storedKey, JSON.stringify({
            currentEnergy: this.games[gameKey].currentEnergy,
            lastUpdate: this.games[gameKey].lastUpdate
        }));
    }

    /**
     * Manually update energy for a specific game
     */
    updateEnergy(gameKey, value) {
        const game = ENERGY_GAMES[gameKey];
        let current = parseInt(value, 10);

        if (isNaN(current) || !Number.isFinite(current)) {
            alert('Please enter a valid number');
            return;
        }

        // Clamp value between 0 and maxEnergy
        current = Math.min(Math.max(0, current), game.maxEnergy);

        this.games[gameKey] = {
            currentEnergy: current,
            lastUpdate: Date.now()
        };

        this.save(gameKey);
        this.render();
    }

    /**
     * Format milliseconds to HH:MM:SS display
     */
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

    /**
     * Render all energy tracker cards to the DOM
     */
    render() {
        const grid = document.getElementById("gameGrid");
        grid.innerHTML = "";

        Object.entries(ENERGY_GAMES).forEach(([key, config]) => {
            const gameData = this.games[key];

            if (!gameData || !config) return;

            const isFull = gameData.currentEnergy >= config.maxEnergy;

            const card = document.createElement("div");
            card.className = "energy-card";

            card.innerHTML = `
                <div class="energy-title">${config.name}</div>
                
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
                
                <div class="energy-count" id="count-${key}">
                    ${Math.floor(gameData.currentEnergy + ((Date.now() - gameData.lastUpdate) / 60000 * config.regenPerMinute))} / ${config.maxEnergy}
                </div>
            `;

            grid.appendChild(card);
        });
    }
}

// ============================================================
// INITIALIZATION ON PAGE LOAD
// ============================================================
let tracker;

window.onload = () => {
    // Initialize task tracker
    initTaskTracker();
    
    // Initialize energy tracker
    tracker = new EnergyTracker();
};