const catScreen = document.getElementById('cat-screen');
const logBox = document.getElementById('log-box');
const actionBox = document.getElementById('action-box');
const escapeLink = document.getElementById('escape-link');

let interactions = 0;
let isHappy = false;
let audioCtx = null;

// Generates a cozy synthetic cat purr frequency chip tone purely via Web Audio API
function playPurrSound() {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80 + Math.random() * 20, audioCtx.currentTime); // Low purr hz frequency
        gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) { }
}

function printTerminalLog(text, isAlert) {
    const entry = document.createElement('div');
    entry.className = "log-entry " + (isAlert ? "log-success" : "");
    entry.innerText = "[" + new Date().toLocaleTimeString() + "] " + text;
    logBox.appendChild(entry);
    logBox.scrollTop = logBox.scrollHeight; // Auto-scroll focus down
}

function interactWithServerCat(actionType) {
    if (isHappy) return;

    interactions++;
    playPurrSound();

    if (actionType === 'feed') {
        catScreen.innerText = "(=^·^=) *munch*";
        printTerminalLog("Entity consumed data packet. Buffer payload optimized.");
    } else if (actionType === 'pet') {
        catScreen.innerText = "(=*·*=) *purr*";
        printTerminalLog("Core pinged successfully. Entity resonance levels increasing.");
    }

    // Check win validation trigger threshold (3 interactions)
    if (interactions >= 3) {
        isHappy = true;
        actionBox.classList.add('hidden');
        escapeLink.classList.remove('hidden');

        catScreen.innerText = "💾 (=^🖏^=) 🚀";
        catScreen.style.color = "#ffffff";
        catScreen.style.textShadow = "0 0 15px #00ff33";
        printTerminalLog("MAX_AFFECTION_REACHED: Server Cat compiled the homepage bridge link!", true);
    } else {
        // Return back to static default idle position safely after brief animation frame window
        setTimeout(function () {
            if (!isHappy) {
                catScreen.innerText = "(=^·^=) *idle*";
            }
        }, 1000);
    }
}