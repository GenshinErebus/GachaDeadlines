    const storyField = document.getElementById('story-field');
    const choicesPanel = document.getElementById('choices-panel');
    const escapeLink = document.getElementById('escape-link');

    let turnCounter = 0;

    function advanceAdventureStep(actionType) {
      turnCounter++;

      if (actionType === 'flee') {
        // Punish player if they choose to run away
        storyField.innerText = "You tried to flee, but the broken URL layout wraps around infinitely! You run in a loop and land right back in front of the glitch.";
        return;
      }

      // Progression tracking based on attack counters
      if (turnCounter === 1) {
        storyField.innerText = "You swing your mechanical keyboard. Your attack bounces off the firewall! You deal 0 damage. The glitch looks highly unimpressed.";
      } else if (turnCounter === 2) {
        storyField.innerText = "You unleash a localized script exploit! The glitch's health bar drops by 50%. It panics and begins throwing buffer allocation warnings at you!";
      } else {
        // Success final phase transition
        choicesPanel.classList.add('hidden');
        escapeLink.classList.remove('hidden');
        
        storyField.innerHTML = "<span style='color: #00ff33; font-weight: bold;'>CRITICAL_HIT! The glitch collapses into unallocated heap memory. Level Up! The link is clear.</span>";
      }
    }