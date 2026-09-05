/* Global variable for the selected region (defaults to Europe) */
let currentRegion = 'eu';

/* daily server reset for each game (UTC) */
const serverResets = {
    genshin: { asia: "20:00", eu: "03:00", na: "09:00" },
    hsr: { asia: "20:00", eu: "03:00", na: "09:00" },
    zzz: { asia: "20:00", eu: "03:00", na: "09:00" },
    arknights: { asia: "20:00", eu: "03:00", na: "09:00" },
    duet: { asia: "21:00", eu: "04:00", na: "10:00" },
    nte: { asia: "21:00", eu: "04:00", na: "10:00" },
    mongil: { asia: "00:00", eu: "00:00", na: "00:00" },
    reverse1999: { asia: "10:00", eu: "10:00", na: "10:00" },
    wuwa: { asia: "20:00", eu: "03:00", na: "09:00" }
};

/* Global timer intervals */
let countdownInterval = null;
let resetInterval = null;
let maintenanceInterval = null;

// Event database for all games
const eventDatabase = {
    genshin: {
        name: "Genshin Impact",
        maintenance: [
            /*
            {
                id: "gi_maint_001",
                startDate: "2026-09-22T22:00:00Z",
                endDate: "2026-09-23T03:00:00Z"
            }
       */ ],
        events: [
            {
                id: "gi_001",
                name: "Heated Battle Mode: Tactical Formation",
                endDate: "2026-09-14T03:00:00Z"
            },
            {
                id: "gi_002",
                name: "Everwinter Without Mercy",
                endDate: "2026-09-22T14:00:00Z"
            },
            {
                id: "gi_003",
                name: "When We Look Up at the Moon",
                endDate: "2026-09-22T14:00:00Z"
            },
            {
                id: "gi_004",
                name: "The Godforsaken Frostlands",
                endDate: "2026-11-03T14:00:00Z"
            },
            {
                id: "gi_005",
                name: "To Temper Thyself and Journey Far",
                endDate: "2026-11-02T03:00:00Z"
            },
            {
                id: "gi_006",
                name: "Spiral Abyss",
                endDate: "2026-09-16T03:00:00Z"
            },
            {
                id: "gi_007",
                name: "Wonderland Treasures: Phantasmagoric Discourse",
                endDate: "2026-09-21T03:00:00Z"
            },
            {
                id: "gi_008",
                name: "Great Expeditionist Challenge",
                endDate: "2026-09-14T03:00:00Z"
            },
            {
                id: "gi_009",
                name: "Imaginarium Theater (Period)",
                endDate: "2026-10-01T03:00:00Z"
            },
            {
                id: "gi_011",
                name: "Stygan Onslaught",
                endDate: "2026-09-22T03:00:00Z"
            },
            // Trial
            {
                id: "gi_010",
                name: "Test Run",
                endDate: "2026-09-22T14:00:00Z"
            },
            // Banner
            {
                id: "gi_012",
                name: "Character Event Wish",
                endDate: "2026-09-22T14:00:00Z"
            },
            {
                id: "gi_013",
                name: "Character Event Wish-2",
                endDate: "2026-09-22T14:00:00Z"
            },
            {
                id: "gi_014",
                name: "Weapon Event Wish",
                endDate: "2026-09-22T14:00:00Z"
            }
        ]
    },
    hsr: {
        name: "Honkai Star Rail",
        maintenance: [ /*
            {
                id: "hsr_maint_001",
                startDate: "2026-08-25T22:00:00Z",
                endDate: "2026-08-26T03:00:00Z"
            } */
        ],
        events: [
            {
                id: "hsr_000",
                name: "Overdrive: Whirlwind Grand Prix",
                endDate: "2026-09-27T20:00:00Z"
            },
            {
                id: "hsr_001",
                name: "Gift of Odyssey",
                endDate: "2026-09-27T20:00:00Z"
            },
            {
                id: "hsr_002",
                name: "Anomaly Arbitration (Period)",
                endDate: "2026-09-27T22:00:00Z"
            },
            {
                id: "hsr_003",
                name: "Memory of Chaos (Period)",
                endDate: "2026-09-28T03:00:00Z"
            },
            {
                id: "hsr_004",
                name: "Pure Fiction (Period)",
                endDate: "2026-09-14T03:00:00Z"
            },
            {
                id: "hsr_005",
                name: "Apocalyptic Shadow (Period)",
                endDate: "2026-10-05T03:00:00Z"
            },
            {
                id: "hsr_006",
                name: "Currency Wars: Zero-Sum Game (Period)",
                endDate: "2026-09-07T03:00:00Z"
            },
            {
                id: "hsr_007",
                name: "Currency Wars: Zero-Sum Game (Expansion)",
                endDate: "2026-11-10T22:00:00Z"
            },
            {
                id: "hsr_008",
                name: "Divergent Universe: Arcadian Chronicles (Expansion)",
                endDate: "2027-03-16T22:00:00Z"
            },
            {
                id: "hsr_009",
                name: "Divergent Universe: Arcadian Chronicles (Period)",
                endDate: "2026-09-07T03:00:00Z"
            },
            // Trial
            {
                id: "hsr_011",
                name: "Aptitude Showcase",
                endDate: "2026-09-12T11:00:00Z"
            },
            // Banner
            {
                id: "hsr_013",
                name: "Character Event Warp",
                endDate: "2026-09-12T11:00:00Z"
            },
            {
                id: "hsr_014",
                name: "Character Event Warp (Rerun)",
                endDate: "2026-09-12T11:00:00Z"
            },
            {
                id: "hsr_015",
                name: "Light Cone Event Warp",
                endDate: "2026-09-12T11:00:00Z"
            },
            {
                id: "hsr_016",
                name: "Light Cone Event Warp (Rerun)",
                endDate: "2026-09-12T11:00:00Z"
            }
        ]
    },
    zzz: {
        name: "Zenless Zone Zero",
        maintenance: [
            {
                id: "zzz_maint_001",
                startDate: "2026-09-08T22:00:00Z",
                endDate: "2026-09-09T03:00:00Z"

            }
        ],
        events: [
            {
                id: "zzz_000",
                name: "The Great En-Nah Giveaway!",
                endDate: "2026-09-08T03:00:00Z"
            },
            {
                id: "zzz_001",
                name: "Summmer Waves Roll In",
                endDate: "2026-09-07T03:00:00Z"
            },
            {
                id: "zzz_002",
                name: "Potential Hypothesis: Hunting Game",
                endDate: "2026-09-09T03:00:00Z"
            },
            {
                id: "zzz_003",
                name: "Return to Ridu: Feathers of Reunion",
                endDate: "2026-09-09T03:00:00Z"
            },
            {
                id: "zzz_004",
                name: "Deadly Assault (Period)",
                endDate: "2026-09-11T03:00:00Z"
            },
            {
                id: "zzz_005",
                name: "Marcel Anniversary Gifts",
                endDate: "2026-09-09T03:00:00Z"
            },
            {
                id: "zzz_006",
                name: "Anniversary Selects",
                endDate: "2026-09-09T03:00:00Z"
            },
            {
                id: "zzz_007",
                name: "Phaethon's Grand Reveal of the Year",
                endDate: "2026-09-09T03:00:00Z"
            },
            {
                id: "zzz_008",
                name: "Gift From the Cloud",
                endDate: "2026-09-08T03:00:00Z"
            },
            {
                id: "zzz_009",
                name: "Festival Special",
                endDate: "2026-09-09T03:00:00Z"
            },
            {
                id: "zzz_010",
                name: "Enigma of the Labyrinth: Operation Bagel",
                endDate: "2026-09-09T03:00:00Z"
            },
            {
                id: "zzz_011",
                name: "Crispy Meal Deployment Plan",
                endDate: "2026-09-07T03:00:00Z"
            },
            {
                id: "zzz_012",
                name: "Dangerous Fugitive's Leisurely Vacation",
                endDate: "2026-09-07T03:00:00Z"
            },
            {
                id: "zzz_013",
                name: "Ding-Dong! Delivery Training in Progress",
                endDate: "2026-09-14T03:00:00Z"
            },
             {
                id: "zzz_014",
                name: "Combat Training: Triple Bounty",
                endDate: "2026-09-07T03:00:00Z"
            },
            // Banner
            {
                id: "zzz_015",
                name: "Channel Exclusive",
                endDate: "2026-09-08T03:00:00Z"
            },
            {
                id: "zzz_016",
                name: "Channel Exclusive 2",
                endDate: "2026-09-08T03:00:00Z"
            },
            {
                id: "zzz_017",
                name: "Exclusive Rescreaning",
                endDate: "2026-09-08T03:00:00Z"
            },
            {
                id: "zzz_018",
                name: "Channel W-Engine",
                endDate: "2026-09-08T03:00:00Z"
            },
            {
                id: "zzz_019",
                name: "Channel W-Engine 2",
                endDate: "2026-09-08T03:00:00Z"
            },
            {
                id: "zzz_020",
                name: "W-Engine Reverberation",
                endDate: "2026-09-08T03:00:00Z"
            }
        ]
    },
    arknights: {
        name: "Arknights Endfield",
        maintenance: [
            {
                id: "ark_maint_001",
                startDate: "2026-09-01T22:00:00Z",
                endDate: "2026-09-02T04:00:00Z"
            }
        ],
        events: [
            {
                id: "ark_001",
                name: "Fletched Irontip Sign-In",
                endDate: "2026-09-30T17:00:00Z"
            },
            {
                id: "ark_002",
                name: "Snow Over Deep Woods",
                endDate: "2026-09-30T17:00:00Z"
            },
            {
                id: "ark_003",
                name: "Combat Drills",
                endDate: "2026-09-30T17:00:00Z"
            },
            {
                id: "ark_004",
                name: "A Winter Dream Fogged Deep in the Woods",
                endDate: "2026-10-14T22:00:00Z"
            },            
            // Banner
            {
                id: "ark_007",
                name: "WINTER HUNT",
                endDate: "2026-10-01T03:00:00Z"
            },
            {
                id: "ark_008",
                name: "Military Grade Issue",
                endDate: "2026-10-01T03:00:00Z"
            }
        ]
    },
    duet: {
        name: "Duet Night Abyss",
        maintenance: [ /*
            {
                id: "dna_maint_001",
                startDate: "2026-09-29T06:00:00Z",
                endDate: "2026-09-29T11:00:00Z"
            } */
        ],
        events: [            
            {
                id: "dna_001",
                name: "Shh! The Parade Begins",
                endDate: "2026-09-15T04:00:00Z"
            },
            {
                id: "dna_002",
                name: "Snowveil Fairytale",
                endDate: "2026-09-07T16:00:00Z"
            },
            {
                id: "dna_003",
                name: "Traces in the Sand",
                endDate: "2026-09-07T16:00:00Z"
            },
            {
                id: "dna_004",
                name: "Bloomfield Station: Tales Untold",
                endDate: "2026-09-07T16:00:00Z"
            },
            {
                id: "dna_005",
                name: "Treasure Hunt Trials",
                endDate: "2026-09-08T04:00:00Z"
            },
            {
                id: "dna_006",
                name: "White Bunnies' Invitation",
                endDate: "2026-09-07T16:00:00Z"
            },
            {
                id: "dna_007",
                name: "Great Chaos of Mechapuppets",
                endDate: "2026-09-07T16:00:00Z"
            },
            {
                id: "dna_008",
                name: "Crimson Mirage",
                endDate: "2026-09-29T04:00:00Z"
            },
            {
                id: "dna_009",
                name: "Immersive Theatre - Ensemble Act",
                endDate: "2026-09-06T16:00:00Z"
            },
            {
                id: "dna_011",
                name: "Phoxhunter Summit (Shop)",
                endDate: "2026-09-12T04:00:00Z"
            },           
            {
                id: "dna_013",
                name: "Immersive Theatre - Legends of the Brave",
                endDate: "2026-09-07T16:00:00Z"
            },
            // Banner
            {
                id: "dna_015",
                name: "Event Esclusive",
                endDate: "2026-09-07T16:00:00Z"
            },
            {
                id: "dna_016",
                name: "Limited-Time Rerun",
                endDate: "2026-09-07T16:00:00Z"
            }
        ]
    },
    nte: {
        name: "Neverness To Everness",
        maintenance: [ /*
            {
                id: "nte_maint_001",
                startDate: "2026-09-30T05:00:00Z",
                endDate: "2026-09-30T10:00:00Z"
            } */
        ],
        events: [
            {
                id: "nte_001",
                name: "Summertime",
                endDate: "2026-09-29T22:00:00Z"
            },
            {
                id: "nte_002",
                name: "Circle gift",
                endDate: "2026-09-29T22:00:00Z"
            },
            {
                id: "nte_003",
                name: "Market Opening Rehearsal",
                endDate: "2026-09-29T22:00:00Z"
            },
            {
                id: "nte_004",
                name: "Hunter's Crucible",
                endDate: "2026-09-29T22:00:00Z"
            },
            {
                id: "nte_005",
                name: "Volley Star",
                endDate: "2026-09-29T22:00:00Z"
            },
            {
                id: "nte_006",
                name: "Surf Breaker",
                endDate: "2026-09-29T22:00:00Z"
            },
            {
                id: "nte_007",
                name: "Beyond the Rails (Period)",
                endDate: "2026-09-09T21:00:00Z"
            },
            {
                id: "nte_008",
                name: "Shipwreck Salvage",
                endDate: "2026-09-29T22:00:00Z"
            },
            {
                id: "nte_009",
                name: "Gold Clash",
                endDate: "2026-09-14T03:00:00Z"
            },
            // Banner
            {
                id: "nte_010",
                name: "Alluring Shadows",
                endDate: "2026-09-08T22:00:00Z"
            },
            {
                id: "nte_011",
                name: "The Ichi-daime",
                endDate: "2026-09-08T22:00:00Z"
            },
            {
                id: "nte_012",
                name: "Specialbound Special",
                endDate: "2026-09-08T22:00:00Z"
            }
        ]
    },
    mongil: {
        name: "MONGIL STAR DIVE",
        maintenance: [
            {
                id: "msd_maint_001",
                startDate: "2026-09-08T23:30:00Z",
                endDate: "2026-09-09T02:00:00Z"
            }
        ],
        events: [
            {
                id: "msd_001",
                name: "The Girl from the Void",
                endDate: "2026-09-09T00:00:00Z"
            },
            {
                id: "msd_002",
                name: "Th-this for beeing my friend...",
                endDate: "2026-09-09T00:00:00Z"
            },
            {
                id: "msd_003",
                name: "Brishshell's 7-Day Gifts",
                endDate: "2026-09-09T00:00:00Z"
            },
            {
                id: "msd_004",
                name: "Special Missions with Brishshell",
                endDate: "2026-09-09T00:00:00Z"
            },
            {
                id: "msd_005",
                name: "Doom's Lonely Herald",
                endDate: "2026-09-09T00:00:00Z"
            },
            {
                id: "msd_006",
                name: "El Dorado Guardian",
                endDate: "2026-09-09T00:00:00Z"
            },
            {
                id: "msd_007",
                name: "10-Day Check-In Missions",
                endDate: "2026-09-09T00:00:00Z"
            },
            {
                id: "msd_008",
                name: "An Invitation to Break the Ice",
                endDate: "2026-09-09T00:00:00Z"
            },
            {
                id: "msd_009",
                name: "Path Bonus Time",
                endDate: "2026-09-09T00:00:00Z"
            },
            {
                id: "msd_010",
                name: "Doom's Lonely Herald",
                endDate: "2026-09-09T00:00:00Z"
            },
            {
                id: "msd_011",
                name: "Monstrous Longing",
                endDate: "2026-09-09T00:00:00Z"
            },
            // Banner
            {
                id: "msd_012",
                name: "Heir to the Amethyst Eye",
                endDate: "2026-09-09T00:00:00Z"
            },
            {
                id: "msd_013",
                name: "Creator of Warm Melodies",
                endDate: "2026-09-09T00:00:00Z"
            }
        ]
    },
    reverse1999: {
        name: "Reverse: 1999",
        maintenance: [ /*
            {
                id: "rev_maint_001",
                startDate: "2026-09-24T10:00:00Z",
                endDate: "2026-09-24T15:00:00Z"
            } */
        ],
        events: [
            {
                id: "rev_000",
                name: "Return of a Special Guest",
                endDate: "2026-09-24T10:00:00Z"
            },
            {
                id: "rev_001",
                name: "On Another's Sorrow",
                endDate: "2026-09-21T10:00:00Z"
            },
            {
                id: "rev_002",
                name: "The You That's Meant to Be",
                endDate: "2026-09-24T10:00:00Z"
            },
            {
                id: "rev_003",
                name: "Mane's Bulletin",
                endDate: "2026-09-24T10:00:00Z"
            },
            {
                id: "rev_004",
                name: "Limbo",
                endDate: "2026-09-16T10:00:00Z"
            },
            {
                id: "rev_005",
                name: "Lucidscape",
                endDate: "2026-10-01T10:00:00Z"
            },
            {
                id: "rev_006",
                name: "Laplace Employee Handbook (EP. 07)",
                endDate: "2026-09-05T17:00:00Z"
            },
            {
                id: "rev_007",
                name: "Laplace Aesthetics",
                endDate: "2026-09-19T10:00:00Z"
            },
            {
                id: "rev_008",
                name: "8-Bit Arcade Remix",
                endDate: "2026-09-24T10:00:00Z"
            },
            {
                id: "rev_009",
                name: "The Syndrone of Silence",
                endDate: "2026-09-24T10:00:00Z"
            },
            {
                id: "rev_010",
                name: "Truth a Posteriori",
                endDate: "2026-09-24T10:00:00Z"
            },
            {
                id: "rev_011",
                name: "Focused Flashback",
                endDate: "2026-09-24T10:00:00Z"
            },
            {
                id: "rev_012",
                name: "Break Time Activity",
                endDate: "2026-09-24T10:00:00Z"
            },
            {
                id: "rev_013",
                name: "The Eaglet Takes Wing",
                endDate: "2026-09-05T10:00:00Z"
            },
             {
                id: "rev_014",
                name: "On Another's Sorrow",
                endDate: "2026-09-24T10:00:00Z"
            },
            {
                id: "rev_015",
                name: "A Stranger to Memory Lane",
                endDate: "2026-09-24T10:00:00Z"
            },
            // Banner
            {
                id: "rev_016",
                name: "Limited Banner",
                endDate: "2026-09-24T10:00:00Z"
            },
            {
                id: "rev_017",
                name: "Event Banner",
                endDate: "2026-09-24T10:00:00Z"
            },
            {
                id: "rev_018",
                name: "A Shell on the Waves",
                endDate: "2026-09-08T10:00:00Z"
            },
            {
                id: "rev_019",
                name: "Ripples on the Water",
                endDate: "2026-09-24T10:00:00Z"
            },            
            {
                id: "rev_020",
                name: "Rerun Banner",
                endDate: "2026-09-24T10:00:00Z"
            }
        ]
    },
    wuwa: {
        name: "Wuthering Waves",
        maintenance: [ /*
            {
                id: "wuwa_maint_001",
                startDate: "2026-09-30T04:00:00Z",
                endDate: "2026-09-30T11:00:00Z"
            } */
        ],
        events: [
            {
                id: "wuwa_001",
                name: "Gifts of Drifting Mist",
                endDate: "2026-09-29T03:00:00Z"
            },
            {
                id: "wuwa_002",
                name: "Ascedant Aces",
                endDate: "2026-09-10T09:00:00Z"
            },
            {
                id: "wuwa_003",
                name: "Tactical Hologram: Simulation",
                endDate: "2026-09-29T03:00:00Z"
            },
            {
                id: "wuwa_004",
                name: "Endstate Matrix (Period)",
                endDate: "2026-09-29T20:00:00Z"
            },
            {
                id: "wuwa_005",
                name: "Whimpering Wastes (Period)",
                endDate: "2026-09-28T03:00:00Z"
            },
            {
                id: "wuwa_006",
                name: "Hazard Revisited (Period)",
                endDate: "2026-09-14T03:00:00Z"
            },
            {
                id: "wuwa_007",
                name: "Resonance Sim Realm",
                endDate: "2026-09-29T11:00:00Z"
            },
            {
                id: "wuwa_008",
                name: "Second Coming of Solaris: Coded Deception",
                endDate: "2026-09-14T03:00:00Z"
            },
            {
                id: "wuwa_009",
                name: "The Strings Remember",
                endDate: "2026-09-21T03:00:00Z"
            },
            {
                id: "wuwa_010",
                name: "Bountiful Crescendo",
                endDate: "2026-09-10T03:00:00Z"
            },
            // Banner
            {
                id: "wuwa_012",
                name: "Featured Resonator Convene",
                endDate: "2026-09-10T09:00:00Z"
            },
            {
                id: "wuwa_013",
                name: "Featured Resonator Convene Rerun",
                endDate: "2026-09-10T09:00:00Z"
            },
            {
                id: "wuwa_015",
                name: "Featured Weapon Convene",
                endDate: "2026-09-10T09:00:00Z"
            },
            {
                id: "wuwa_016",
                name: "Featured Weapon Convene Rerun",
                endDate: "2026-09-10T09:00:00Z"
            }
        ]
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Matrix Tracker] Initializing...');

    // Load saved region from localStorage
    const savedRegion = localStorage.getItem('selectedRegion');
    if (savedRegion && ['asia', 'eu', 'na'].includes(savedRegion)) {
        currentRegion = savedRegion;
        updateRegionButtons();
    }

    initUI();

    const select = document.getElementById('gameSelect');
    if (select) {
        select.value = "";
    }

    loadGameEvents();
});

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

// Stats page through server online text
function createStatusBar() {
    if (document.querySelector('.status-bar')) return;

    const statusBar = document.createElement('div');
    statusBar.className = 'status-bar';
    statusBar.innerHTML = `
        <div class="status-indicator">
            <span class="status-dot"></span>
            <a href="https://gachatracker.critic1985.workers.dev/stats" 
               class="system-online-link">
                SYSTEM ONLINE
            </a>
        </div>
        <div class="timestamp">
            <span id="serverTime">LOADING...</span>
        </div>
        <div class="connection-status">
            <span>CONNECTION: </span>
            <a href="research.html" class="encrypted-link">ENCRYPTED</a>
        </div>
    `;
    document.body.appendChild(statusBar);

    setInterval(updateServerTime, 1000);
}

function updateServerTime() {
    const timeElement = document.getElementById('serverTime');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    }
}

// ============================================================
// NEW FUNCTION: Region Switching Logic 
// ============================================================
function setRegion(region) {
    console.log(`[Matrix Tracker] Changing region to: ${region.toUpperCase()}`);

    // Validate region
    if (!['asia', 'eu', 'na'].includes(region)) {
        console.error(`[Matrix Tracker] Invalid region: ${region}`);
        return;
    }

    // Update global variable
    currentRegion = region;

    // Save to localStorage
    localStorage.setItem('selectedRegion', region);

    // Update button styles
    updateRegionButtons();

    // Reload current game events to reflect new timezone offsets
    loadGameEvents();
}

function updateRegionButtons() {
    const buttons = ['asia', 'eu', 'na'];
    buttons.forEach(btn => {
        const el = document.getElementById(`btn-${btn}`);
        if (el) {
            if (btn === currentRegion) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        }
    });
}

function loadGameEvents() {
    const select = document.getElementById('gameSelect');
    const gameKey = select.value;
    const container = document.querySelector('.container');

    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }

    if (resetInterval) {
        clearInterval(resetInterval);
        resetInterval = null;
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

    const header = document.createElement('h1');
    header.setAttribute('data-text', gameData.name.toUpperCase());
    header.textContent = gameData.name.toUpperCase();
    header.className = 'game-header';
    container.appendChild(header);

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

    const gameLinks = {
        genshin: { wiki: "https://genshin-impact.fandom.com/wiki/Event#Upcoming", videos: "https://www.youtube.com/watch?v=W67SGl5f-pQ&list=PLaIcRoqjRStY_M0Z5nZKoSdJDBB24vptc" },
        hsr: { wiki: "https://honkai-star-rail.fandom.com/wiki/Events#Upcoming", videos: "https://www.youtube.com/watch?v=km1GiY0bL-0&list=PLaIcRoqjRStZ0kJBnQ5n_eIJwWqOFPCzF" },
        zzz: { wiki: "https://zenless-zone-zero.fandom.com/wiki/Event", videos: "https://www.youtube.com/watch?v=km1GiY0bL-0&list=PLaIcRoqjRStZ0kJBnQ5n_eIJwWqOFPCzF" },
        arknights: { wiki: "https://endfield.wiki.gg/wiki/Event", videos: "https://www.youtube.com/watch?v=rmROLmiIbxw&list=PLaIcRoqjRStZlRec3E-rBI1FrkNG4hKqu" },
        duet: { wiki: "https://www.facebook.com/DNAbyss.Official/", videos: "https://www.youtube.com/watch?v=OZjV2_BfKPQ&list=PLaIcRoqjRStblGWClhd6beCNPpDNL89R5" },
        nte: { wiki: "https://www.ntebuild.com/events", videos: "https://www.youtube.com/watch?v=WgKBf6WFQ-M&list=PLaIcRoqjRStagdMPEuG_tKQFm6mfHyESW" },
        mongil: { wiki: "https://forum.netmarble.com/stardive_gl/list/6/1", videos: "https://www.youtube.com/watch?v=UTB4I4pR0s8&list=PLaIcRoqjRStZpkKZNn8FkHcnZyM1PK34p" },
        reverse1999: { wiki: "https://reverse1999.fandom.com/wiki/Events", videos: "https://www.youtube.com/watch?v=VJ3LrUzv1fM&list=PLaIcRoqjRStal3cgomG7Hf3aP6tDllaBA" },
        wuwa: { wiki: "https://wuwatracker.com/timeline", videos: "https://www.youtube.com/watch?v=B-zJc2W4acU&list=PLaIcRoqjRStaGFEb_oMvIc-SCrXgCg4Fx" }
    };

    if (gameLinks[gameKey]) {
        statsDiv.innerHTML += `
        <div class="stat-box btn-box"><a href="${gameLinks[gameKey].wiki}" target="_blank" class="events-btn">MORE INFO ⧉</a></div>
        <div class="stat-box btn-box"><a href="${gameLinks[gameKey].videos}" target="_blank" class="events-btn youtube-btn">CODE VIDEOS ▶</a></div>
    `;
    }

    const eventsGrid = document.createElement('div');
    eventsGrid.className = 'events-grid';
    eventsGrid.id = 'eventsGrid';

    const resetCard = createServerResetCard(gameKey);
    eventsGrid.appendChild(resetCard);

    const maintCard = createMaintenanceCard(gameKey);
    eventsGrid.appendChild(maintCard);

    gameData.events.forEach(event => {
        const card = createEventCard(event);
        eventsGrid.appendChild(card);
    });

    container.appendChild(eventsGrid);

    startCountdownTimers();
    startResetCountdown(gameKey);
    startMaintenanceCountdown(gameKey);

    console.log(`[Matrix Tracker] ${gameData.name} loaded - ${gameData.events.length} events + maintenance`);
}

function createServerResetCard(gameKey) {
    const card = document.createElement('div');
    card.className = 'event-card server-reset-card';
    card.dataset.eventId = `reset_${gameKey}`;
    card.dataset.isReset = "true";
    card.dataset.gameKey = gameKey;

    const region = currentRegion || 'eu';
    const resetTime = serverResets[gameKey]?.[region] || "04:00";
    const nextReset = getNextResetTime(gameKey, region);
    const formattedDate = formatDateServerReset(nextReset);

    card.innerHTML = `
        <h3 class="event-name">🔄 DAILY RESET - ${region.toUpperCase()}</h3>
        <div class="event-meta">
            <div class="meta-row">
                <span class="meta-label">NEXT:</span>
                <span class="meta-value">${formattedDate}</span>
            </div>
            <div class="meta-row">
                <span class="meta-label">TIME:</span>
                <span class="meta-value reset-time">${resetTime} UTC</span>
            </div>
        </div>
        <div class="countdown reset-countdown" id="countdown_reset_${gameKey}">
            <div class="countdown-item">
                <span class="countdown-value" id="reset_days">00</span>
                <span class="countdown-label">DAYS</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-value" id="reset_hours">00</span>
                <span class="countdown-label">HRS</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-value" id="reset_minutes">00</span>
                <span class="countdown-label">MIN</span>
            </div>
            <div class="countdown-item">
                <span class="countdown-value" id="reset_seconds">00</span>
                <span class="countdown-label">SEC</span>
            </div>
        </div>
    `;

    return card;
}

function getNextResetTime(gameKey, region) {
    const now = new Date();
    const resetTime = serverResets[gameKey]?.[region] || "04:00";
    const [hours, minutes] = resetTime.split(':').map(Number);

    let nextReset = new Date(now);
    nextReset.setHours(hours, minutes, 0, 0);

    if (nextReset <= now) {
        nextReset.setDate(nextReset.getDate() + 1);
    }

    return nextReset;
}

function formatDateServerReset(date) {
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

function createMaintenanceCard(gameKey) {
    const card = document.createElement('div');
    card.className = 'event-card maintenance-card';
    card.dataset.eventId = `maint_${gameKey}`;
    card.dataset.isMaintenance = "true";
    card.dataset.gameKey = gameKey;

    const maintenance = getCurrentMaintenance(gameKey);
    let contentHtml = '';

    if (!maintenance) {
        contentHtml = `
            <h3 class="event-name">🔧 MAINTENANCE OVER</h3>
            <div class="event-meta">
                <div class="meta-row">
                    <span class="meta-label">STATUS:</span>
                    <span class="meta-value" style="color: #666;">NEXT MAINTENANCE TIME UNKNOWN</span>
                </div>
            </div>
            <div class="countdown maintenance-no-data">
                <div class="countdown-item">
                    <span class="countdown-value">--</span>
                    <span class="countdown-label">NO DATA</span>
                </div>
            </div>
        `;
    } else if (maintenance.state === 'upcoming') {
        contentHtml = `
            <h3 class="event-name">🔧 NEXT MAINTENANCE</h3>
            <div class="event-meta">
                <div class="meta-row">
                    <span class="meta-label">STATUS:</span>
                    <span class="meta-value status-active">ONLINE</span>
                </div>
            </div>
            <div class="countdown maintenance-upcoming" id="countdown_maint_${gameKey}">
                <div class="countdown-item">
                    <span class="countdown-value" id="maint_days">00</span>
                    <span class="countdown-label">DAYS</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value" id="maint_hours">00</span>
                    <span class="countdown-label">HRS</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value" id="maint_minutes">00</span>
                    <span class="countdown-label">MIN</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value" id="maint_seconds">00</span>
                    <span class="countdown-label">SEC</span>
                </div>
            </div>
        `;
    } else {
        contentHtml = `
            <h3 class="event-name maintenance-active">⚠️ MAINTENANCE ACTIVE</h3>
            <div class="event-meta">
                <div class="meta-row">
                    <span class="meta-label">STATUS:</span>
                    <span class="meta-value status-urgent">SERVER OFFLINE</span>
                </div>
            </div>
            <div class="countdown maintenance-active" id="countdown_maint_${gameKey}">
                <div class="countdown-item">
                    <span class="countdown-value" id="maint_days">00</span>
                    <span class="countdown-label">DAYS</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value" id="maint_hours">00</span>
                    <span class="countdown-label">HRS</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value" id="maint_minutes">00</span>
                    <span class="countdown-label">MIN</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value" id="maint_seconds">00</span>
                    <span class="countdown-label">SEC</span>
                </div>
            </div>
        `;
    }

    card.innerHTML = contentHtml;
    return card;
}

function getCurrentMaintenance(gameKey) {
    const now = new Date();
    const gameData = eventDatabase[gameKey];
    const region = currentRegion || 'eu';

    if (!gameData.maintenance || gameData.maintenance.length === 0) {
        return null;
    }

    // Specialcase: Arknights Endfield EU und NA share Server
    const effectiveRegion = (gameKey === 'arknights' && region === 'na') ? 'eu' : region;

    // sort by Starttime, first earliest
    const sorted = [...gameData.maintenance].sort((a, b) =>
        new Date(a.startDate) - new Date(b.startDate)
    );

    for (const maint of sorted) {
        // Filter after Region - if none then all
        if (maint.region && maint.region !== effectiveRegion) {
            continue;
        }

        const start = new Date(maint.startDate);
        const end = new Date(maint.endDate);

        if (now >= start && now <= end) {
            // right now in Maintenance
            return { ...maint, state: 'active' };
        } else if (now < start) {
            // next maintence
            return { ...maint, state: 'upcoming' };
        }
    }

    // all maintence are over
    return null;
}

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

function getGameOffset() {
    const select = document.getElementById('gameSelect');
    if (!select) return 0;
    const gameKey = select.value;

    if (gameKey === 'genshin' || gameKey === 'hsr' || gameKey === 'zzz' || gameKey === 'nte' || gameKey === 'wuwa') {
        if (currentRegion === 'asia') return -7;
        if (currentRegion === 'na') return 6;
    }

    if (gameKey === 'reverse1999') {
        if (currentRegion === 'asia') return -6;
        if (currentRegion === 'na') return 7;
    }

    if (gameKey === 'arknights' || gameKey === 'duet') {
        if (currentRegion === 'asia') return -7;
    }

    return 0;
}

function getEventStatus(endDateString) {
    const now = new Date();
    let end = new Date(endDateString);

    end.setHours(end.getHours() + getGameOffset());

    const diffMs = end - now;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    if (diffMs <= 0) {
        return 'expired';
    } else if (diffDays <= 2) {
        return 'urgent';
    } else if (diffDays <= 7) {
        return 'warning';
    } else {
        return 'active';
    }
}

function translateStatus(status) {
    const translations = {
        active: 'ACTIVE',
        warning: 'WARNING',
        urgent: 'URGENT',
        expired: 'EXPIRED'
    };
    return translations[status] || status;
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    let date = new Date(dateString);

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

function getTimeRemaining(endtime) {
    const now = new Date();
    let end = new Date(endtime);

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

function getTimeRemainingForReset(gameKey) {
    const region = currentRegion || 'eu';
    const nextReset = getNextResetTime(gameKey, region);
    const now = new Date();

    const totalSeconds = Math.floor((nextReset - now) / 1000);

    if (totalSeconds <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return { days, hours, minutes, seconds, total: totalSeconds };
}

function startCountdownTimers() {
    console.log('[Matrix Tracker] Countdown system activated...');

    updateAllCountdowns();

    countdownInterval = setInterval(() => {
        updateAllCountdowns();
        updateUrgentCounts();
    }, 1000);
}

function updateAllCountdowns() {
    const allCards = document.querySelectorAll('.event-card');

    allCards.forEach(card => {
        const eventId = card.dataset.eventId;

        if (card.dataset.isReset === "true" || card.dataset.isMaintenance === "true") return;

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
            countdownEl.classList.remove('urgent', 'warning', 'expired');

            if (status === 'urgent') {
                countdownEl.classList.add('urgent');
                card.classList.remove('has-expired-timer', 'has-warning-timer');
            } else if (status === 'warning') {
                countdownEl.classList.add('warning');
                card.classList.add('has-warning-timer');
                card.classList.remove('has-expired-timer');
            } else if (status === 'expired') {
                countdownEl.classList.add('expired');
                card.classList.add('has-expired-timer');
                card.classList.remove('has-warning-timer');
            } else {
                card.classList.remove('has-expired-timer', 'has-warning-timer');
            }
        }
    });

    updateUrgentCounts();
}

function updateResetCountdown(gameKey) {
    const timeRemaining = getTimeRemainingForReset(gameKey);

    const daysEl = document.getElementById('reset_days');
    const hoursEl = document.getElementById('reset_hours');
    const minutesEl = document.getElementById('reset_minutes');
    const secondsEl = document.getElementById('reset_seconds');

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
}

function startResetCountdown(gameKey) {
    if (resetInterval) {
        clearInterval(resetInterval);
        resetInterval = null;
    }

    updateResetCountdown(gameKey);

    resetInterval = setInterval(() => {
        updateResetCountdown(gameKey);
    }, 1000);
}

function updateMaintenanceCountdown(gameKey) {
    const maintenance = getCurrentMaintenance(gameKey);

    const card = document.querySelector(`[data-game-key="${gameKey}"][data-is-maintenance="true"]`);
    if (!card) {
        console.warn(`[Matrix Tracker] Maintenance card not found for ${gameKey}`);
        return;
    }

    const daysEl = card.querySelector('#maint_days');
    const hoursEl = card.querySelector('#maint_hours');
    const minutesEl = card.querySelector('#maint_minutes');
    const secondsEl = card.querySelector('#maint_seconds');
    const titleEl = card.querySelector('.event-name');
    const statusEl = card.querySelector('.meta-value');

    if (!maintenance) {
        if (titleEl) titleEl.textContent = '🔧 MAINTENANCE OVER';
        if (statusEl) statusEl.textContent = 'NEXT MAINTENANCE TIME UNKNOWN';
        if (daysEl) daysEl.textContent = '--';
        if (hoursEl) hoursEl.textContent = '--';
        if (minutesEl) minutesEl.textContent = '--';
        if (secondsEl) secondsEl.textContent = '--';
        card.classList.remove('maintenance-active');
        return;
    }

    let targetDate;

    if (maintenance.state === 'upcoming') {
        targetDate = new Date(maintenance.startDate);
        if (titleEl) titleEl.textContent = '🔧 NEXT MAINTENANCE';
        if (statusEl) statusEl.textContent = 'ONLINE';
        card.classList.remove('maintenance-active');
    } else {
        targetDate = new Date(maintenance.endDate);
        if (titleEl) titleEl.textContent = '⚠️ MAINTENANCE ACTIVE';
        if (statusEl) statusEl.textContent = 'SERVER OFFLINE';
        card.classList.add('maintenance-active');
    }

    const now = new Date();
    const diffMs = targetDate - now;

    if (diffMs <= 0) {
        if (titleEl) titleEl.textContent = '🔧 MAINTENANCE OVER';
        if (statusEl) statusEl.textContent = 'NEXT MAINTENANCE TIME UNKNOWN';
        if (daysEl) daysEl.textContent = '--';
        if (hoursEl) hoursEl.textContent = '--';
        if (minutesEl) minutesEl.textContent = '--';
        if (secondsEl) secondsEl.textContent = '--';
        card.classList.remove('maintenance-active');
    } else {
        const totalSeconds = Math.floor(diffMs / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }
}

function startMaintenanceCountdown(gameKey) {
    updateMaintenanceCountdown(gameKey);

    maintenanceInterval = setInterval(() => {
        updateMaintenanceCountdown(gameKey);
    }, 1000);
}

function updateUrgentCounts() {
    const urgentEl = document.getElementById('urgentCount');
    if (!urgentEl) return;

    const allCards = document.querySelectorAll('.event-card:not([data-is-reset="true"]):not([data-is-maintenance="true"])');
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

function findEventById(eventId) {
    for (const gameKey in eventDatabase) {
        const event = eventDatabase[gameKey].events.find(e => e.id === eventId);
        if (event) return event;
    }
    return null;
}

function log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [MATRIX] ${message}`);
}

if (!window.customElements) {
    window.alert('[Matrix Tracker] Browser not supported. Please update.');
}

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

/* ============================================
   REPORT MISSING EVENTS/FEATURES - MODAL LOGIC
   ============================================ */

const REPORT_EMAIL = 'genshinerebus@web.de';

function initReportModal() {
    const reportBtn = document.getElementById('reportBtn');
    const modal = document.getElementById('reportModal');
    const closeBtn = document.getElementById('closeModal');
    const form = document.getElementById('missingEventForm');
    const btnMailto = document.getElementById('btnMailto');
    const btnDirect = document.getElementById('btnDirectSend');

    if (!reportBtn || !modal || !form) return;

    /* ============================================
       OPEN MODAL
       ============================================ */
    reportBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Pre-fill current game and region if available
        const currentGame = document.getElementById('gameSelect')?.value;
        if (currentGame) {
            document.getElementById('reportGame').value = currentGame;
        }
        document.getElementById('reportRegion').value = currentRegion;
    });

    /* ============================================
       CLOSE MODAL
       ============================================ */
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        form.reset();
        setFeedback('', '');
    }

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    /* ============================================
       VALIDATE FORM INPUT
   ============================================ */
    function validateForm() {
        const topic = document.getElementById('reportGame').value;
        const title = document.getElementById('reportEventName').value.trim();

        if (!topic) {
            return false;
        }

        // For Bug Reports and Feature Requests: Title is required, Notes optional
        if (topic === 'bug_report' || topic === 'feature_request') {
            return title.length > 0;
        }

        // For Game Events: Both topic and title are required
        if (!title || !eventDatabase[topic]) {
            return false;
        }

        return true;
    }

    /* ============================================
       OPTION A: MAILTO - Sends via Local Email Client
       ============================================ */
    btnMailto.addEventListener('click', () => {
        if (!validateForm()) {
            setFeedback('Please select a topic and enter details.', 'error');
            return;
        }

        const topic = document.getElementById('reportGame').value;
        const title = document.getElementById('reportEventName').value.trim();
        const region = document.getElementById('reportRegion').value || 'Any';
        const notes = document.getElementById('reportNotes').value.trim();
        const timestamp = new Date().toISOString();

        let subject, body;

        if (topic === 'bug_report') {
            subject = encodeURIComponent('[BUG REPORT] ' + title);
            body = encodeURIComponent(
                `Type: Bug Report\n` +
                `Title: ${title}\n` +
                `Region: ${region}\n` +
                `Description: ${notes || 'No description provided'}\n\n` +
                `---\n` +
                `Reported via GachaDeadlines.com\n` +
                `${timestamp}`
            );
        } else if (topic === 'feature_request') {
            subject = encodeURIComponent('[FEATURE REQUEST] ' + title);
            body = encodeURIComponent(
                `Type: Feature Request\n` +
                `Title: ${title}\n` +
                `Details: ${notes || 'No additional details'}\n\n` +
                `---\n` +
                `Reported via GachaDeadlines.com\n` +
                `${timestamp}`
            );
        } else {
            // Existing game event logic
            const gameName = eventDatabase[topic]?.name || topic;
            subject = encodeURIComponent(`[Missing Event] ${gameName}: ${title}`);
            body = encodeURIComponent(
                `Game: ${gameName}\n` +
                `Missing Event: ${title}\n` +
                `Region: ${region}\n` +
                `Notes: ${notes || 'None'}\n\n` +
                `---\n` +
                `Reported via GachaDeadlines.com\n` +
                `${timestamp}`
            );
        }

        window.location.href = `mailto:${REPORT_EMAIL}?subject=${subject}&body=${body}`;
        setFeedback('Email client opened. Please remember to send the email.', 'success');
        setTimeout(closeModal, 3000);
    });

    /* ============================================
       OPTION B: FORMSUBMIT.DIRECT - Sends via API
       ============================================ */
    btnDirect.addEventListener('click', async () => {
        if (!validateForm()) {
            setFeedback('Please select a topic and enter details.', 'error');
            return;
        }

        const topic = document.getElementById('reportGame').value;
        const title = document.getElementById('reportEventName').value.trim();
        const region = document.getElementById('reportRegion').value || 'Any';
        const notes = document.getElementById('reportNotes').value.trim();

        btnDirect.disabled = true;
        btnDirect.textContent = 'SENDING...';

        const formData = new FormData();
        formData.append('_to', REPORT_EMAIL);

        // Set dynamic subject based on report type
        if (topic === 'bug_report') {
            formData.append('_subject', '[BUG REPORT] ' + title);
            formData.append('type', 'Bug Report');
        } else if (topic === 'feature_request') {
            formData.append('_subject', '[FEATURE REQUEST] ' + title);
            formData.append('type', 'Feature Request');
        } else {
            const gameName = eventDatabase[topic]?.name || topic;
            formData.append('_subject', `[Missing Event] ${gameName}: ${title}`);
            formData.append('type', 'Missing Event');
            formData.append('game_key', topic);
        }

        // Common fields
        formData.append('title', title);
        formData.append('region', region);
        formData.append('description', notes || '');
        formData.append('timestamp', new Date().toISOString());

        try {
            const response = await fetch(`https://formsubmit.co/ajax/${REPORT_EMAIL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(Object.fromEntries(formData))
            });

            if (response.ok) {
                setFeedback('Report submitted successfully! Thank you.', 'success');
                setTimeout(closeModal, 3000);
            } else {
                const err = await response.json().catch(() => ({}));
                setFeedback(`Error: ${err.error || 'Submission failed'}`, 'error');
            }
        } catch (error) {
            setFeedback('Network error. Please try again.', 'error');
            console.error('[Report Modal]', error);
        }

        btnDirect.disabled = false;
        btnDirect.textContent = '> SEND DIRECTLY';
    });

    /* ============================================
       PREVENT DEFAULT FORM SUBMISSION
       ============================================ */
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        btnMailto.click();
    });
}

/* ============================================
   HELPER FUNCTION - SET FEEDBACK MESSAGE
   ============================================ */
function setFeedback(message, type) {
    const el = document.getElementById('formFeedback');
    if (!el) return;
    el.textContent = message;
    el.className = 'form-feedback' + (type ? ` ${type}` : '');
}

/* ============================================
   HOOK INTO EXISTING DOMContentLoaded
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    initReportModal();
});

/* ============================================
   CLICK ON TIMESTAMP - NAVIGATE TO CALCULATOR
   ============================================ */
function initTimestampClick() {
    const timestampEl = document.querySelector('.timestamp');
    if (timestampEl) {
        timestampEl.style.cursor = 'pointer';
        timestampEl.title = 'Click to view calculator';

        timestampEl.addEventListener('click', () => {
            window.location.href = 'Calculator.html';
        });
    }
}

/* HOOK INTO EXISTING DOMContentLoaded */
document.addEventListener('DOMContentLoaded', () => {
    initTimestampClick();
});

log('Script loaded and ready...');