/* Global variable for the selected region (defaults to Europe) */
let currentRegion = 'eu';

/* Function to switch regions and update button styles */
function setRegion(region) {
    currentRegion = region;
    
    /* Update button glow styles based on selection */
    ['asia', 'eu', 'na'].forEach(r => {
        const btn = document.getElementById(`btn-${r}`);
        if (btn) {
            if (r === region) {
                btn.style.color = 'var(--matrix-light-green)';
                btn.style.fontWeight = 'bold';
            } else {
                btn.style.color = 'var(--matrix-dim-green)';
                btn.style.fontWeight = 'normal';
            }
        }
    });

    /* Trigger a recalculation of the timers immediately */
    loadGameEvents(); 
}

// Event database for all my games
const eventDatabase = {
    genshin: {
        name: "Genshin Impact",
        events: [
            {
                id: "gi_001",
                name: "Stygian Onslaught",
                endDate: "2026-07-18T02:00:00Z"
            },
            {
                id: "gi_002",
                name: "Sunny Summer Fontinalia",
                endDate: "2026-08-11T02:00:00Z"
            },
            {
                id: "gi_003",
                name: "To Temper Thyself and Journey Far",
                endDate: "2026-08-10T02:00:00Z"
            },
            {
                id: "gi_004",
                name: "When We Look Up at the Moon",
                endDate: "2026-09-22T13:00:00Z"
            },
            {
                id: "gi_005",
                name: "Test Run",
                endDate: "2026-07-21T16:00:00Z"
            },
            {
                id: "gi_006",
                name: "Nod-Krai: Where Roads Are Pledged to Cross",
                endDate: "2026-08-11T13:00:00Z"
            },
            {
                id: "gi_007",
                name: "Wonderland Treasures: Breezes Meet the Fatebound Sea",
                endDate: "2026-08-10T02:00:00Z"
            },
            {
                id: "gi_008",
                name: "Spiral Abyss",
                endDate: "2026-08-16T02:00:00Z"
            },
            {
                id: "gi_00",
                name: "Final Long-Range Sightlines",
                endDate: "2026-07-27T02:00:00Z"
            }
        ]
    },
    hsr: {
        name: "Honkai Star Rail",
        events: [
             {
                id: "hsr_001",
                name: "Antigraft Brickbuster",
                endDate: "2026-08-25T19:00:00Z"
            },
            {
                id: "hsr_002",
                name: "Anomaly Arbitration",
                endDate: "2026-08-25T21:00:00Z"
            },
            {
                id: "hsr_004",
                name: "Memory of Chaos",
                endDate: "2026-08-17T02:00:00Z"
            },
            {
                id: "hsr_005",
                name: "Pure Fiction",
                endDate: "2026-08-03T02:00:00Z"
            },
            {
                id: "hsr_006",
                name: "Apocalyptic Shadow",
                endDate: "2026-07-20T02:00:00Z"
            },
            {
                id: "hsr_007",
                name: "Currency Wars: Zero-Sum Game",
                endDate: "2026-11-10T21:00:00Z"
            },
            {
                id: "hsr_008",
                name: "Divergent Universe: Arcadian Chronicles",
                endDate: "2026-08-25T21:00:00Z"
            },
            {
                id: "hsr_009",
                name: "Aptitude Showcase",
                endDate: "2026-08-05T10:00:00Z"
            }
        ]
    },
    zzz: {
        name: "Zenless Zone Zero",
        events: [
            {
                id: "zzz_001",
                name: "Assemble Mock Exam Comeback Plan",
                endDate: "2026-07-26T03:00:00Z"
            },
            {
                id: "zzz_002",
                name: "Art is Bangboo!",
                endDate: "2026-07-26T03:00:00Z"
            },
            {
                id: "zzz_003",
                name: "Tales of the Hobbling Crow",
                endDate: "2026-07-20T02:00:00Z"
            },
            {
                id: "zzz_005",
                name: "Celestial Nexus Intelligence Dossier",
                endDate: "2026-07-28T03:00:00Z"
            },
            {
                id: "zzz_006",
                name: "The Final Callback",
                endDate: "2026-07-28T03:00:00Z"
            },
            {
                id: "zzz_007",
                name: "Deadly Assault",
                endDate: "2026-07-28T03:00:00Z"
            }
        ]
    },
    arknights: {
        name: "Arknights Endfield",
        events: [
           {
                id: "ark_001",
                name: "Fortune Connect-and-Win",
                endDate: "2026-07-31T08:00:00Z"
            }, 
             {
                id: "ark_002",
                name: "Gaze Towards the Northern Exclusion",
                endDate: "2026-08-09T16:00:00Z"
            }, 
             {
                id: "ark_003",
                name: "Combat Drills",
                endDate: "2026-08-09T16:00:00Z"
            }, 
        ]
    },
    duet: {
        name: "Duet Night Abyss",
        events: [
            {
                id: "dna_001",
                name: "Atlasia Calling",
                endDate: "2026-07-27T15:00:00Z"
            },
            {
                id: "dna_002",
                name: "Dance with the Sea",
                endDate: "2026-07-27T15:00:00Z"
            },
            {
                id: "dna_003",
                name: "To the Distant Shore",
                endDate: "2026-07-27T15:00:00Z"
            },
            {
                id: "dna_004",
                name: "Immersive Theatre",
                endDate: "2026-07-27T15:00:00Z"
            },
            {
                id: "dna_005",
                name: "Traces in the Sand",
                endDate: "2026-07-27T15:00:00Z"
            },
            {
                id: "dna_006",
                name: "Starry Sojourn",
                endDate: "2026-07-27T15:00:00Z"
            },
            {
                id: "dna_007",
                name: "Phoxhunter Summit",
                endDate: "2026-07-23T22:00:00Z"
            },
            {
                id: "dna_008",
                name: "Pulse of the Empire",
                endDate: "2026-07-27T15:00:00Z"
            },
            {
                id: "dna_010",
                name: "Silver Torrent, Rising Star",
                endDate: "2026-07-23T03:00:00Z"
            }
        ]
    },
    nte: {
        name: "Neverness To Everness",
        events: [
            {
                id: "nte_001",
                name: "Market Opening Rehearsal",
                endDate: "2026-07-28T21:00:00Z"
            },
            {
                id: "nte_002",
                name: "999 Nights",
                endDate: "2026-08-18T21:00:00Z"
            },
            {
                id: "nte_003",
                name: "Eibon Partner Program",
                endDate: "2026-08-18T21:00:00Z"
            },
            {
                id: "nte_004",
                name: "Mews Flash",
                endDate: "2026-08-18T21:00:00Z"
            },
            {
                id: "nte_005",
                name: "Beyond the Rails",
                endDate: "2026-07-29T21:00:00Z"
            },
            {
                id: "nte_006",
                name: "Stamina Recharge",
                endDate: "2026-07-20T02:00:00Z"
            },
            {
                id: "nte_007",
                name: "Shadow-n-Seek",
                endDate: "2026-08-18T21:00:00Z"
            }
        ]
    },
    mongil: {
        name: "MONGIL STAR DIVE",
        events: [
            {
                id: "msd_001",
                name: "Summer Lane",
                endDate: "2026-07-28T23:00:00Z"
            },
            {
                id: "msd_002",
                name: "Grand Summer Festival Missions",
                endDate: "2026-07-28T23:00:00Z"
            },
            {
                id: "msd_004",
                name: "An Unforgettable First Summer Drive",
                endDate: "2026-08-04T23:00:00Z"
            },
            {
                id: "msd_005",
                name: "Herald of Love, Festival Dreamer",
                endDate: "2026-07-28T23:00:00Z"
            },
            {
                id: "msd_006",
                name: "The Girl More Fiery than the Summer Heat",
                endDate: "2026-07-28T23:00:00Z"
            },
            {
                id: "msd_007",
                name: "Legendary Monster Reginula",
                endDate: "2026-08-18T23:00:00Z"
            },
            {
                id: "msd_008",
                name: "Monsterling Trait Change Support",
                endDate: "2026-08-18T23:00:00Z"
            },
            {
                id: "msd_009",
                name: "Gulgak",
                endDate: "2026-07-28T23:00:00Z"
            }
        ]
    },
    reverse1999: {
        name: "Reverse: 1999",
        events: [
            {
                id: "rev_001",
                name: "Last and First Principles",
                endDate: "2026-07-22T09:00:00Z"
            },
            {
                id: "rev_002",
                name: "Focused Flashback",
                endDate: "2026-07-23T09:00:00Z"
            },
            {
                id: "rev_003",
                name: "Mane's Bulletin",
                endDate: "2026-07-23T09:00:00Z"
            },
            {
                id: "rev_004",
                name: "Complete Induction",
                endDate: "2026-07-23T09:00:00Z"
            },
            {
                id: "rev_005",
                name: "Limbo",
                endDate: "2026-08-15T03:00:00Z"
            },
            {
                id: "rev_006",
                name: "Lucidscape",
                endDate: "2026-07-31T03:00:00Z"
            }
        ]
    },
    wuwa: {
        name: "Wuthering Waves",
        events: [
            {
                id: "wuwa_001",
                name: "Glamour Couture",
                endDate: "2026-08-19T10:00:00Z"
            },
            {
                id: "wuwa_002",
                name: "Ascendant Aces",
                endDate: "2026-07-30T08:00:00Z"
            },
            {
                id: "wuwa_003",
                name: "Tactical Hologram: Simulation",
                endDate: "2026-08-19T02:00:00Z"
            },
            {
                id: "wuwa_004",
                name: "Endstate Matrix",
                endDate: "2026-08-19T19:00:00Z"
            },
            {
                id: "wuwa_005",
                name: "Whimpering Wastes",
                endDate: "2026-08-03T02:00:00Z"
            },
            {
                id: "wuwa_006",
                name: "Hazard Revisited",
                endDate: "2026-07-20T02:00:00Z"
            },
            {
                id: "wuwa_007",
                name: "Lament Recon: Tacet Crisis",
                endDate: "2026-08-19T10:00:00Z"
            },
            {
                id: "wuwa_008",
                name: "Recaptured: Action Highlights",
                endDate: "2026-08-06T02:00:00Z"
            }
        ]
    }
};

// Global timer intervals
let countdownInterval = null;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Matrix Tracker] Initializing...');
    initUI();

    // Auto-load first game or default
    const select = document.getElementById('gameSelect');
    if (select && select.options.length > 1) {
        select.selectedIndex = 1; // Genshin Impact as default
        loadGameEvents();
    }
});

// UI initialization
function initUI() {
    console.log('[Matrix Tracker] Setting up UI...');

    let container = document.querySelector('.container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'container';
        document.body.appendChild(container);
    }

    createStatusBar();
}

// Creates the fixed status bar at the bottom
function createStatusBar() {
    if (document.querySelector('.status-bar')) return;

    const statusBar = document.createElement('div');
    statusBar.className = 'status-bar';
    statusBar.innerHTML = `
        <div class="status-indicator">
            <span class="status-dot"></span>
            <span>SYSTEM ONLINE</span>
        </div>
        <div class="timestamp">
            <span id="serverTime">LOADING...</span>
        </div>
        <div class="connection-status">
            <span>CONNECTION: <strong>ENCRYPTED</strong></span>
        </div>
    `;
    document.body.appendChild(statusBar);

    setInterval(updateServerTime, 1000);
}

// Updates server time in status bar
function updateServerTime() {
    const timeElement = document.getElementById('serverTime');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    }
}

// Main function: loads events for selected game
function loadGameEvents() {
    const select = document.getElementById('gameSelect');
    const gameKey = select.value;
    const container = document.querySelector('.container');

    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    container.innerHTML = '';

    if (!gameKey || !eventDatabase[gameKey]) {
        container.innerHTML += `
            <div class="loading-message">
                <span class="loading">▮ DATABASE READY. SELECT A GAME. ▮</span>
            </div>
        `;
        return;
    }

    const gameData = eventDatabase[gameKey];

    // Game header (ONLY ONCE - no badge needed)
    const header = document.createElement('h1');
    header.setAttribute('data-text', gameData.name.toUpperCase());
    header.textContent = gameData.name.toUpperCase();
    header.className = 'game-header';
    container.appendChild(header);

    // Stats overview
    const statsDiv = document.createElement('div');
    statsDiv.id = 'statsOverview';
    statsDiv.className = 'stats-overview';
    statsDiv.innerHTML = `
        <div class="stat-box">
            <span class="stat-label">ACTIVE EVENTS:</span>
            <span class="stat-value" id="activeCount">${gameData.events.length}</span>
        </div>
        <div class="stat-box">
            <span class="stat-label">ENDING SOON:</span>
            <span class="stat-value" id="urgentCount">0</span>
        </div>
    `;
    container.appendChild(statsDiv);

    // Events grid container
    const eventsGrid = document.createElement('div');
    eventsGrid.className = 'events-grid';
    eventsGrid.id = 'eventsGrid';

    gameData.events.forEach(event => {
        const card = createEventCard(event);
        eventsGrid.appendChild(card);
    });

    container.appendChild(eventsGrid);

    startCountdownTimers();

    console.log(`[Matrix Tracker] ${gameData.name} loaded - ${gameData.events.length} events`);
}

// Creates a single event card as HTML (KEIN STARTDATUM - NUR ENDDATUM)
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.dataset.eventId = event.id;

    const status = getEventStatus(event.endDate);
    const urgencyClass = status === 'urgent' ? 'urgent' : status === 'expired' ? 'expired' : '';

    const formattedDate = formatDate(event.endDate);

    card.innerHTML = `
        <h3 class="event-name">${event.name}</h3>
        <div class="event-meta">
            <!-- STARTDATUM ENTFERNT -->
            <div class="meta-row">
                <span class="meta-label">END:</span>
                <span class="meta-value">${formattedDate}</span>
            </div>
            <div class="meta-row">
                <span class="meta-label">STATUS:</span>
                <span class="meta-value status-${status}">${translateStatus(status)}</span>
            </div>
        </div>
        <div class="countdown ${urgencyClass}" id="countdown_${event.id}">
            <div class="countdown-item">
                <span class="countdown-value" id="${event.id}_days">00</span>
                <span class="countdown-label">DAYS</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-value" id="${event.id}_hours">00</span>
                <span class="countdown-label">HRS</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-value" id="${event.id}_minutes">00</span>
                <span class="countdown-label">MIN</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-value" id="${event.id}_seconds">00</span>
                <span class="countdown-label">SEC</span>
            </div>
        </div>
    `;

    return card;
}

/* Helper function to get the exact hour offset for each specific game and region */
function getGameOffset() {
    const select = document.getElementById('gameSelect');
    if (!select) return 0;
    const gameKey = select.value;

    /* Group 1: Standard Regional Server Offset (Asia -7h / America +6h) */
    if (gameKey === 'genshin' || gameKey === 'hsr' || gameKey === 'zzz' || gameKey === 'arknights' || gameKey === 'duet') {
        if (currentRegion === 'asia') return -7;
        if (currentRegion === 'na') return 6;
    }

    /* Group 2: Reverse 1999 (Specific Global Timezone Offset Rules) */
    if (gameKey === 'reverse1999') {
        if (currentRegion === 'asia') return -6;
        if (currentRegion === 'na') return 7;
    }

    /* Group 3: Global Simultaneous Reset (Wuthering Waves, NTE, Mongil) */
    /* These games end at the exact same second worldwide. Offset remains 0. */
    return 0;
}

// Determines event status based on end time
function getEventStatus(endDateString) {
    const now = new Date();
    let end = new Date(endDateString);
    
    /* Dynamically shift hours based on the specific game database rule */
    end.setHours(end.getHours() + getGameOffset());
    
    const diffMs = end - now;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    if (diffMs <= 0) {
        return 'expired';
    } else if (diffDays <= 2) {
        return 'urgent';
    } else {
        return 'active';
    }
}

// Translates status terms to English
function translateStatus(status) {
    const translations = {
        active: 'ACTIVE',
        urgent: 'URGENT',
        expired: 'EXPIRED'
    };
    return translations[status] || status;
}

// Formats date into readable format
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    let date = new Date(dateString);
    
    /* Dynamically shift hours based on the specific game database rule */
    date.setHours(date.getHours() + getGameOffset());
    
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    };
    return date.toLocaleDateString('en-US', options);
}

// Calculates remaining time
function getTimeRemaining(endtime) {
    const now = new Date();
    let end = new Date(endtime);
    
    /* Dynamically shift hours based on the specific game database rule */
    end.setHours(end.getHours() + getGameOffset());
    
    const totalSeconds = Math.floor((end - now) / 1000);

    if (totalSeconds <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return { days, hours, minutes, seconds, total: totalSeconds };
}

// Starts countdown timers for all active events
function startCountdownTimers() {
    console.log('[Matrix Tracker] Countdown system activated...');

    updateAllCountdowns();

    countdownInterval = setInterval(() => {
        updateAllCountdowns();
        updateUrgentCounts();
    }, 1000);
}

// Updates all countdown displays
function updateAllCountdowns() {
    const allCards = document.querySelectorAll('.event-card');

    allCards.forEach(card => {
        const eventId = card.dataset.eventId;
        const eventObj = findEventById(eventId);

        if (!eventObj) return;

        const timeRemaining = getTimeRemaining(eventObj.endDate);
        const status = getEventStatus(eventObj.endDate);

        const daysEl = document.getElementById(`${eventId}_days`);
        const hoursEl = document.getElementById(`${eventId}_hours`);
        const minutesEl = document.getElementById(`${eventId}_minutes`);
        const secondsEl = document.getElementById(`${eventId}_seconds`);

        if (daysEl && timeRemaining.total > 0) {
            daysEl.textContent = String(timeRemaining.days).padStart(2, '0');
            hoursEl.textContent = String(timeRemaining.hours).padStart(2, '0');
            minutesEl.textContent = String(timeRemaining.minutes).padStart(2, '0');
            secondsEl.textContent = String(timeRemaining.seconds).padStart(2, '0');
        } else if (timeRemaining.total <= 0) {
            if (daysEl) {
                daysEl.textContent = '00';
                hoursEl.textContent = '00';
                minutesEl.textContent = '00';
                secondsEl.textContent = '00';
            }
        }

        const countdownEl = card.querySelector('.countdown');
        if (countdownEl) {
            countdownEl.classList.remove('urgent', 'expired');
            if (status === 'urgent') {
                countdownEl.classList.add('urgent');
            } else if (status === 'expired') {
                countdownEl.classList.add('expired');
            }
        }
    });

    updateUrgentCounts();
}

// Updates urgent event count in statistics
function updateUrgentCounts() {
    const urgentEl = document.getElementById('urgentCount');
    if (!urgentEl) return;

    const allCards = document.querySelectorAll('.event-card');
    let urgentCount = 0;

    allCards.forEach(card => {
        const countdownEl = card.querySelector('.countdown');
        if (countdownEl && countdownEl.classList.contains('urgent')) {
            urgentCount++;
        }
    });

    urgentEl.textContent = urgentCount;

    const statusText = document.querySelector('.status-bar .connection-status strong');
    if (statusText) {
        if (urgentCount > 0) {
            statusText.textContent = `${urgentCount} WARNINGS`;
            statusText.style.color = '#ff3333';
        } else {
            statusText.textContent = 'ENCRYPTED';
            statusText.style.color = 'var(--matrix-green)';
        }
    }
}

// Helper function: finds event object from database
function findEventById(eventId) {
    for (const gameKey in eventDatabase) {
        const event = eventDatabase[gameKey].events.find(e => e.id === eventId);
        if (event) return event;
    }
    return null;
}

// Utility: Log message with Matrix aesthetic
function log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [MATRIX] ${message}`);
}

// Fallback for older browsers without Custom Elements
if (!window.customElements) {
    window.alert('[Matrix Tracker] Browser not supported. Please update.');
}

// Event listeners for additional interaction
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        log('Reloading...');
        location.reload();
    } else if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        exportEventData();
    }
});

// Exports event data as JSON (for debugging)
function exportEventData() {
    const dataStr = JSON.stringify(eventDatabase, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gacha_events_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    log('Data export successful!');
}

log('Script loaded and ready...');