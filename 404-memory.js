   const gridContainer = document.getElementById('game-grid');
    const statusMsg = document.getElementById('status-msg');
    const escapeBtn = document.getElementById('escape-btn');

    // 8 Pairs of geek/dev terminal symbols
    const cardIcons = [
      'HTML', 'HTML',
      'CSS', 'CSS',
      'JSON', 'JSON',
      'NULL', 'NULL',
      '404', '404',
      'C#', 'C#',
      'GIT', 'GIT',
      'SUDO', 'SUDO'
    ];

    let flippedCards = [];
    let matchedPairsCount = 0;
    let totalTries = 0;
    let lockBoard = false;

    // Fisher-Yates Shuffle Engine
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // Generate Card Grid System
    function initializeGame() {
      const shuffledIcons = shuffle([...cardIcons]);
      gridContainer.innerHTML = '';

      shuffledIcons.forEach((icon) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.icon = icon;

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-face', 'card-front');

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-face', 'card-back');

        const contentDiv = document.createElement('span');
        contentDiv.classList.add('card-content');
        contentDiv.textContent = icon;
        cardBack.appendChild(contentDiv);

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);

        card.addEventListener('click', flipCard);
        gridContainer.appendChild(card);
      });
    }

    function flipCard() {
      if (lockBoard) return;
      if (this === flippedCards[0]) return;
      if (this.classList.contains('matched') || this.classList.contains('flipped')) return;

      this.classList.add('flipped');
      flippedCards.push(this);

      if (flippedCards.length === 2) {
        totalTries++;
        statusMsg.innerText = `Tries: ${totalTries}`;
        checkMatch();
      }
    }

    function checkMatch() {
      const [card1, card2] = flippedCards;
      const isMatch = card1.dataset.icon === card2.dataset.icon;

      if (isMatch) {
        disableCards();
      } else {
        unflipCards();
      }
    }

    function disableCards() {
      flippedCards[0].classList.add('matched');
      flippedCards[1].classList.add('matched');

      matchedPairsCount++;
      resetTracker();

      if (matchedPairsCount === cardIcons.length / 2) {
        statusMsg.innerHTML = "<span style='color: #00ff33; font-weight: bold;'>INDEX_REBUILT: System Stabilized!</span>";
        escapeBtn.classList.remove('hidden');
      }
    }

    function unflipCards() {
      lockBoard = true;
      setTimeout(() => {
        flippedCards[0].classList.remove('flipped');
        flippedCards[1].classList.remove('flipped');
        resetTracker();
      }, 900);
    }

    function resetTracker() {
      flippedCards = [];
      lockBoard = false;
    }

    initializeGame();