    const statusMsg = document.getElementById('status-msg');
    const popup = document.getElementById('badge-popup');
    const badgeEmoji = document.getElementById('badge-emoji');
    const badgeTitle = document.getElementById('badge-title');
    const escapeLink = document.getElementById('escape-link');
    const baitBtn = document.getElementById('click-bait-btn');

    let clickCount = 0;
    let achievementsUnlocked = 0;
    
    let unlockedList = { lost: false, clicker: false, platinum: false };
    let audioCtx = null;

    function playAchievementChime() {
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2);
        
        gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } catch(e) {}
    }

    function triggerPopupNotification(emoji, title) {
      playAchievementChime();
      
      badgeEmoji.innerText = emoji;
      badgeTitle.innerText = title;
      popup.classList.add('slide-in');

      setTimeout(function() {
        popup.classList.remove('slide-in');
      }, 3500);
    }

    function trackClicks() {
      if (unlockedList.platinum) return;

      clickCount++;

      if (clickCount >= 5 && !unlockedList.clicker) {
        unlockedList.clicker = true;
        achievementsUnlocked++;
        triggerPopupNotification("⚡", "Impatient Clicker");
        checkWinCondition();
      }
    }

    function checkWinCondition() {
      if (achievementsUnlocked === 2 && !unlockedList.platinum) {
        unlockedList.platinum = true;
        
        setTimeout(function() {
          triggerPopupNotification("👑", "Platinum: Found the Exit!");
          baitBtn.classList.add('hidden');
          escapeLink.classList.remove('hidden');
          statusMsg.innerHTML = "<span style='color: #ffaa00; font-weight: bold;'>100% COMPLETION: Security Matrix Overridden!</span><br>The final gate is compiled. Deploy completion package.";
        }, 4000);
      }
    }

    window.onload = function() {
      setTimeout(function() {
        if (unlockedList.lost) return;
        unlockedList.lost = true;
        achievementsUnlocked++;
        triggerPopupNotification("🧭", "Lost in the Mainframe");
        statusMsg.innerHTML = "Trophies collected: 1 / 2<br>Keep probing the network matrix environment to reveal hidden blocks.";
      }, 800);
    };