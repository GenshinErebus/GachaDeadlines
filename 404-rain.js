    const canvas = document.getElementById('matrixCanvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('matrix-container');
    const targetWordEl = document.getElementById('target-word');
    const winScreen = document.getElementById('win-screen');

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-/<>[]{}";

    // Rain scale: smaller screens get slightly denser, finer rain
    function getRainFontSize() {
      return window.innerWidth < 360 ? 13 : 16;
    }

    let fontSize = getRainFontSize();
    let columns = 0;
    let rainDrops = [];

    const secretKeywords = ["HOME", "EXIT", "BACK", "404", "NEO", "GATEWAY", "ESCAPE"];
    let activeWord = "";
    let wordRect = null; // Live bounding box of the target word, kept in sync with the DOM
    let isGameOver = false;
    let wordTimer = null;

    // Make canvas fully responsive AND recompute the rain grid on every resize
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      fontSize = getRainFontSize();
      columns = Math.max(1, Math.floor(canvas.width / fontSize));

      // Preserve relative progress of drops so the rain keeps flowing naturally
      const oldDrops = rainDrops;
      rainDrops = Array.from({ length: columns }, (_, i) =>
        oldDrops.length ? oldDrops[Math.min(i, oldDrops.length - 1)] : Math.floor(Math.random() * (canvas.height / fontSize))
      );

      // Re-clamp the active word into the new viewport
      if (!isGameOver) repositionWord(false);
    }
    resizeCanvas();
    window.addEventListener('resize', () => {
      resizeCanvas();
      syncWordRect();
    });

    function generateNewTargetWord() {
      if (isGameOver) return;

      activeWord = secretKeywords[Math.floor(Math.random() * secretKeywords.length)];
      repositionWord(true);
      syncWordRect();

      // Re-shuffle coordinates automatically every 4 seconds if not clicked
      clearTimeout(wordTimer);
      wordTimer = setTimeout(generateNewTargetWord, 4000);
    }

    function repositionWord(isNewWord) {
      if (isNewWord) {
        targetWordEl.innerText = activeWord;
        targetWordEl.classList.remove('hidden');
      }

      // Measure the word's real pixel size to keep it fully inside the viewport
      const rect = targetWordEl.getBoundingClientRect();
      const wordW = rect.width || 60;
      const wordH = rect.height || 30;

      const marginX = Math.max(wordW / 2 + 10, canvas.width * 0.04);
      const marginY = Math.max(wordH / 2 + 10, canvas.height * 0.06);

      // Random center point within safe boundaries (percentage based, works on every screen)
      const minX = marginX, maxX = Math.max(minX + 1, canvas.width - marginX);
      const minY = Math.max(marginY, canvas.height * 0.12); // Keep clear of top hint zone expectations
      const maxY = Math.max(minY + 1, canvas.height - marginY - 40); // Keep clear of the bottom hint

      const cx = Math.floor(minX + Math.random() * (maxX - minX));
      const cy = Math.floor(minY + Math.random() * (maxY - minY));

      targetWordEl.style.left = cx + 'px';
      targetWordEl.style.top = cy + 'px';
    }

    // Cache the word's bounding box so the render loop can skip rain chars behind it
    function syncWordRect() {
      if (isGameOver || targetWordEl.classList.contains('hidden')) {
        wordRect = null;
        return;
      }
      const r = targetWordEl.getBoundingClientRect();
      // Small padding keeps an aura of calm around the word for readability
      wordRect = { left: r.left - 8, right: r.right + 8, top: r.top - 8, bottom: r.bottom + 8 };
    }

    function handleWordDiscovery() {
      if (isGameOver) return;
      isGameOver = true;
      clearTimeout(wordTimer);

      targetWordEl.classList.add('hidden');
      wordRect = null;
      winScreen.classList.remove('hidden');

      // Visual freeze matrix effect setup
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    targetWordEl.addEventListener('click', handleWordDiscovery);
    targetWordEl.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleWordDiscovery();
    }, { passive: false });

    // Core Canvas digital code rain rendering engine loop
    function renderMatrixStream() {
      if (isGameOver) return;

      // Creates trailing fade out overlay layer
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff33';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        const x = i * fontSize;
        const y = rainDrops[i] * fontSize;

        // Skip rendering characters inside the secret word bounding box
        const covered = wordRect &&
          x >= wordRect.left && x <= wordRect.right &&
          y >= wordRect.top && y <= wordRect.bottom;

        if (!covered) {
          ctx.fillText(text, x, y);
        }

        // Reset drop once it passes the bottom of the screen
        if (y > canvas.height && Math.random() * 100 > 97.5) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }

      requestAnimationFrame(renderMatrixStream);
    }

    // Launch configuration engine setup
    generateNewTargetWord();
    renderMatrixStream();