    const confessionField = document.getElementById("confession-text");
    const escapeBtn = document.getElementById("escape-link");
    const spinner = document.getElementById("spinner-line");

    function revealTheTruth() {
      // Change spinner text to freeze it at 99% confession state
      spinner.innerText = "❌ DECRYPTION_STUCK: 99%";
      spinner.style.color = "#ff3333";
      spinner.style.textShadow = "0 0 8px #ff3333";
      spinner.style.animation = "none";

      // Update info box confession message strings
      confessionField.innerText = "Alright, let's be honest. This is taking way too long. The page you are looking for is just completely gone. Tap below to give up.";

      // Unhide the exit routing link
      escapeBtn.classList.remove('hidden');
    }

    // Trigger the honesty fallback event after exactly 5.5 seconds of fake loading time
    setTimeout(revealTheTruth, 5500);