const binaryDisplay = document.getElementById('binary-display');
const statusMsg = document.getElementById('status-msg');
const interfaceBox = document.getElementById('interface-box');
const escapeLink = document.getElementById('escape-link');

const wordPool = ["HOME", "EXIT", "LINK", "NODE", "SUDO", "ROOT", "DATA", "CODE", "HOST", "PORT", "GRID"];

let correctAnswer = "";
let choices = [];
let gameActive = true;
let score = 0;
let escapeUnlocked = false; // Track if escape was ever unlocked

// Load highscore from localStorage
function loadHighScore() {
    const saved = localStorage.getItem('cipher_highscore');
    return saved ? parseInt(saved) : 0;
}

// Save highscore if new record
function saveHighScore(newScore) {
    const currentHigh = loadHighScore();
    if (newScore > currentHigh) {
        localStorage.setItem('cipher_highscore', newScore);
        return true;
    }
    return false;
}

// Generate highscore display text
function showHighScore(currentScore) {
    const highScore = loadHighScore();
    const isNewRecord = currentScore >= highScore && currentScore > 0;
    
    let msg = `SCORE: ${currentScore}`;
    if (isNewRecord) {
        msg += ' | 🏆 NEW RECORD!';
    } else if (highScore > 0) {
        msg += ` | BEST: ${highScore}`;
    }
    return msg;
}

// Convert text to binary representation
function convertTextToBinary(text) {
    let output = [];
    for (let i = 0; i < text.length; i++) {
        let bin = text.charCodeAt(i).toString(2);
        let padded = "00000000".substring(bin.length) + bin;
        output.push(padded);
    }
    return output.join(" ");
}

// Shuffle array using Fisher-Yates algorithm
function FisherYatesShuffle(array) {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        let temp = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temp;
    }
    return array;
}

// ========== HELP SYSTEM ==========
const helpOverlay = document.createElement('div');
helpOverlay.id = 'help-overlay';
helpOverlay.className = 'hidden';
helpOverlay.innerHTML = `
  <div class="help-content">
    <h2>📖 MANUAL: BINARY TO ASCII CONVERSION</h2>
    <div class="help-body">
<pre style="text-align:left;margin:0;white-space:pre-wrap;">
===================================================================
1. HOW TO READ BINARY (8-BIT BYTES)
-------------------------------------------------------------------
Each bit from right to left has a fixed decimal value (doubles each time).
Only add up the values where you see a "1".

[ 128 ] [ 64 ] [ 32 ] [ 16 ] [  8 ] [  4 ] [  2 ] [  1 ]

   |      |      |      |      |      |      |      |
   0      1      0      0      0      1      0      1  

          |                           |             |
         64    +                      4    +        1   =  [ 69 ]

===================================================================
2. ASCII REFERENCE TABLE (UPPERCASE)
-------------------------------------------------------------------
65 = A      71 = G      77 = M      83 = S      89 = Y
66 = B      72 = H      78 = N      84 = T      90 = Z
67 = C      73 = I      79 = O      85 = U
68 = D      74 = J      80 = P      86 = V
69 = E      75 = K      81 = Q      87 = W
70 = F      76 = L      82 = R      88 = X
===================================================================
Press ESC or click outside to close
</pre>
    </div>
  </div>
`;
document.body.appendChild(helpOverlay);

function toggleHelp(show) {
    if (show) {
        helpOverlay.classList.remove('hidden');
    } else {
        helpOverlay.classList.add('hidden');
    }
}

// F1 Key Listener
document.addEventListener('keydown', (e) => {
    if (e.key === 'F1') {
        e.preventDefault();
        toggleHelp(true);
    }
    if (e.key === 'Escape') {
        toggleHelp(false);
    }
});

// Click outside to close
helpOverlay.addEventListener('click', (e) => {
    if (e.target === helpOverlay) {
        toggleHelp(false);
    }
});
// ========== END HELP SYSTEM ==========

// Initialize the code breaker round
function initGameRound() {
    gameActive = true;
    // DON'T hide escape button here - keep it visible once unlocked!

    const randomIndex = Math.floor(Math.random() * wordPool.length);
    correctAnswer = wordPool[randomIndex];
    choices = [];

    binaryDisplay.innerText = convertTextToBinary(correctAnswer);

    let decoys = wordPool.filter(w => w !== correctAnswer);
    FisherYatesShuffle(decoys);

    choices = [correctAnswer, decoys[0], decoys[1]];
    FisherYatesShuffle(choices);

    // Update buttons with new choices
    for (let i = 0; i < 3; i++) {
        document.getElementById("choice-" + i).innerText = choices[i];
    }

    // Show current best score
    statusMsg.innerHTML = `Select the correct decryption cipher:<br>BEST: ${loadHighScore()}`;
}

// Verify user's decryption choice
function verifyDecryption(selectedIndex) {
    if (!gameActive) return;
    
    gameActive = false; // Lock input immediately
    const userChoice = choices[selectedIndex];

    if (userChoice === correctAnswer) {
        // Correct answer
        score++;
        escapeUnlocked = true; // Mark escape as unlocked
        
        saveHighScore(score);
        statusMsg.innerHTML = `<span style='color: #00ff33; font-weight: bold;'>DECRYPTION_SUCCESS: Unlocked!</span><br>${showHighScore(score)}`;
        
        // Show escape link permanently now
        escapeLink.classList.remove('hidden');
        
        // After short delay, start new round
        setTimeout(() => {
            initGameRound();
        }, 1500);
        
    } else {
        // Wrong answer
        statusMsg.innerHTML = `<span style='color: #ff3333;'>CIPHER_MISMATCH: Re-routing...</span>`;
        setTimeout(() => () => {
            initGameRound();
        }, 1500);
    }
}

// Start the game - hide escape initially
escapeLink.classList.add('hidden');
initGameRound();