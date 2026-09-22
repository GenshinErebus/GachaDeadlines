const codeBox = document.getElementById('code-box');
const statusMsg = document.getElementById('status-msg');
const interfaceBox = document.getElementById('interface-box');
const escapeLink = document.getElementById('escape-link');

function applyCompileFix(fixType) {
    interfaceBox.classList.add('hidden');

    // The humorous twist code injection update block
    codeBox.innerHTML = "TypeError: Cannot read properties of undefined (reading 'split')\n" +
        "  at compileServerIndex (router.js:142:32)\n" +
        "  at processTicksAndRejections (node:internal/process/task_queues:95:5)\n" +
        "  at async Promise.all (index 0)\n" +
        "Refusing to compile: 42 syntax warnings remaining.";

    codeBox.style.color = "#ff3333";
    codeBox.style.borderColor = "#ff3333";
    codeBox.style.boxShadow = "0 0 10px rgba(255, 51, 51, 0.2)";

    // Panic text state trigger response sequence
    statusMsg.innerHTML = "<span style='color: #ff3333; font-weight: bold;'>CRITICAL FAULT: " +
        (fixType === 'semicolon' ? "Semicolon added. " : "Bracket injected. ") +
        "Now there are 42 new secondary bugs!</span><br>" +
        "Server telemetry dropping. Commencing emergency fallback routing procedures...";

    // Instant bypass unlock trigger
    setTimeout(function () {
        escapeLink.classList.remove('hidden');
    }, 1500);
}