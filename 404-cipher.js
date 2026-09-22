const binaryDisplay = document.getElementById('binary-display');
const statusMsg = document.getElementById('status-msg');
const interfaceBox = document.getElementById('interface-box');
const escapeLink = document.getElementById('escape-link');

const wordPool = ["HOME", "EXIT", "LINK", "NODE", "SUDO", "ROOT", "DATA", "CODE", "HOST", "PORT", "GRID"];

let correctAnswer = "";
let choices = [];
let gameActive = true;

function convertTextToBinary(text) {
    let output = [];
    for (let i = 0; i < text.length; i++) {
        let bin = text.charCodeAt(i).toString(2);
        let padded = "00000000".substring(bin.length) + bin;
        output.push(padded);
    }
    return output.join(" ");
}

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

function initCodeBreaker() {
    gameActive = true;
    statusMsg.innerHTML = "Select the correct decryption cipher:";
    escapeLink.classList.add('hidden');
    interfaceBox.classList.remove('hidden');

    const randomIndex = Math.floor(Math.random() * wordPool.length);
    correctAnswer = wordPool[randomIndex];

    binaryDisplay.innerText = convertTextToBinary(correctAnswer);

    let decoys = wordPool.filter(w => w !== correctAnswer);
    decoys = FisherYatesShuffle(decoys);

    choices = [correctAnswer, decoys[0], decoys[1]];
    choices = FisherYatesShuffle(choices);

    for (let i = 0; i < 3; i++) {
        document.getElementById("choice-" + i).innerText = choices[i];
    }
}

function verifyDecryption(selectedIndex) {
    if (!gameActive) return;

    const userChoice = choices[selectedIndex];

    if (userChoice === correctAnswer) {
        gameActive = false;
        statusMsg.innerHTML = "<span style='color: #00ff33; font-weight: bold;'>DECRYPTION_SUCCESS: Unlocked!</span>";
        interfaceBox.classList.add('hidden');
        escapeLink.classList.remove('hidden');
    } else {
        statusMsg.innerHTML = "<span style='color: #ff3333;'>CIPHER_MISMATCH: Re-routing...</span>";
        gameActive = false;
        setTimeout(initCodeBreaker, 1200);
    }
}

initCodeBreaker();