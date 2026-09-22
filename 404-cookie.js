    const sprite = document.getElementById('monster-sprite');
    const logDisplay = document.getElementById('log-display');
    const feedBtn = document.getElementById('feed-btn');
    const escapeLink = document.getElementById('escape-link');

    let cookiesEaten = 0;

    // Funny server log reactions
    const logMessages = [
      "Log: LocalStorage sector devoured... Crunch.",
      "Log: Browser cache partition consumed... Omnomnom.",
      "Log: Session cookies wiped from heap memory.",
      "Log: History breadcrumbs digested successfully.",
      "Log: IndexDB storage space filled to maximum capacity!"
    ];

    // Character expressions mapping different sizes safely
    const monsterExpressions = [
      "[o_o]",
      "=[o_o]=",
      "==[O_O]==",
      "===[ ʘ_ Cullen ʘ_ ]===",
      "⚡===[ 🟢_ʘ ]==="
    ];

    function feedMonsterNode() {
      if (cookiesEaten >= 5) return;

      cookiesEaten++;

      // Update visual presentation sizes based on feed levels
      const scaleMultiplier = 1 + (cookiesEaten * 0.25);
      sprite.style.transform = "scale(" + scaleMultiplier + ")";

      // Update character face expression dynamically
      const expressionIndex = Math.min(cookiesEaten, monsterExpressions.length - 1);
      sprite.innerText = monsterExpressions[expressionIndex];

      if (cookiesEaten < 5) {
        logDisplay.innerText = logMessages[cookiesEaten - 1] + " (" + cookiesEaten + "/5)";
      } else {
        // Win threshold criteria passed
        feedBtn.classList.add('hidden');
        escapeLink.classList.remove('hidden');
        logDisplay.innerHTML = "<span style='color: #00ff33; font-weight: bold;'>FATAL_OVERLOAD: Entity is full! Path opened.</span>";
        sprite.innerText = "💥 STATUS: SATISFIED 💥";
        sprite.style.color = "#ffffff";
      }
    }