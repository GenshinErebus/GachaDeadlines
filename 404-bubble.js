const field = document.getElementById('wrap-field');
const msg = document.getElementById('status-msg');

const totalBubbles = 24;
let bubblesLeft = totalBubbles;
let audioCtx = null;

function playPopSound() {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600 + Math.random() * 200, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) { }
}

function createBubbleWrap() {
    field.innerHTML = '';
    for (let i = 0; i < totalBubbles; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.innerText = 'O';

        const popAction = function () {
            if (bubble.classList.contains('popped')) return;

            bubble.classList.add('popped');
            bubble.innerText = 'X';
            playPopSound();

            bubblesLeft--;
            if (bubblesLeft > 0) {
                msg.innerText = "Bubbles remaining: " + bubblesLeft;
            } else {
                msg.innerHTML = "<span style='color:#00ff33;font-weight:bold;'>MAX_ZEN_ACHIEVED: Frustration cleared!</span>";
            }
        };

        bubble.addEventListener('click', popAction);
        bubble.addEventListener('touchstart', function (e) {
            e.preventDefault();
            popAction();
        }, { passive: false });

        field.appendChild(bubble);
    }
}

createBubbleWrap();