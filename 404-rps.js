    const logBox = document.getElementById('log-box');
    const interfaceBox = document.getElementById('interface-box');
    const escapeLink = document.getElementById('escape-link');
    const humanScoreEl = document.getElementById('human-score');
    const aiScoreEl = document.getElementById('ai-score');

    let humanScore = 0;
    let aiScore = 0;
    let isGameOver = false;

    const choices = ["rock", "paper", "scissors"];

    const winInsults = [
      "AI: Beginner's luck. My neural path suffered a minor cache lag.",
      "AI: You won that hand, but your biological computing remains inferior.",
      "AI: Impossible. Did you inspect my source variables?!"
    ];

    const loseInsults = [
      "AI: Human intelligence is highly overrated. Rock beats scissors effortlessly.",
      "AI: Outsmarted by a standard math equation. Pathetic.",
      "AI: Handshake failed. I read your synaptic pathways like an open config file."
    ];

    function printLogLine(text, styleClass) {
      const entry = document.createElement('div');
      entry.className = "log-entry " + (styleClass || "");
      entry.innerText = text;
      logBox.appendChild(entry);
      logBox.scrollTop = logBox.scrollHeight;
    }

    function playRound(humanChoice) {
      if (isGameOver) return;

      const aiChoice = choices[Math.floor(Math.random() * choices.length)];
      
      printLogLine("You: " + humanChoice.toUpperCase() + " | AI: " + aiChoice.toUpperCase());

      if (humanChoice === aiChoice) {
        printLogLine("RESULT: Tie - Grid synchronized.", "color: #ffcc00;");
      } else if (
        (humanChoice === "rock" && aiChoice === "scissors") ||
        (humanChoice === "paper" && aiChoice === "rock") ||
        (humanChoice === "scissors" && aiChoice === "paper")
      ) {
        humanScore++;
        humanScoreEl.innerText = humanScore;
        const insult = winInsults[Math.floor(Math.random() * winInsults.length)];
        printLogLine(insult, "log-win");
      } else {
        aiScore++;
        aiScoreEl.innerText = aiScore;
        const insult = loseInsults[Math.floor(Math.random() * loseInsults.length)];
        printLogLine(insult, "log-lose");
      }

      checkMatchEnd();
    }

    function checkMatchEnd() {
      if (humanScore >= 3) {
        isGameOver = true;
        interfaceBox.classList.add('hidden');
        escapeLink.classList.remove('hidden');
        printLogLine("🤖 AI: CRITICAL FAILURE... Security shield collapsed. Bypassing walls...", "log-win");
      } else if (aiScore >= 3) {
        printLogLine("🤖 AI: Match point. Re-indexing field... Try again.", "log-lose");
        humanScore = 0;
        aiScore = 0;
        humanScoreEl.innerText = humanScore;
        aiScoreEl.innerText = aiScore;
      }
    }