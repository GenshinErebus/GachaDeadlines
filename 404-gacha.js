    // =====================================================
    // GAME CONFIGURATION
    // =====================================================
    const dropScreen = document.getElementById('drop-screen');
    const gemsDisplay = document.getElementById('gems-display');
    const actionArea = document.getElementById('action-area');
    const recycleArea = document.getElementById('recycle-area');
    const recycleBtn = document.getElementById('recycle-all-btn');
    const recycleValueEl = document.getElementById('recycle-value');
    const escapeLink = document.getElementById('escape-link');
    const pityCounterEl = document.getElementById('pity-counter');
    const totalPullsEl = document.getElementById('total-pulls');
    const inv3StarEl = document.getElementById('inv-3star');
    const inv4StarEl = document.getElementById('inv-4star');
    const inv5StarEl = document.getElementById('inv-5star');

    // Game State
    let state = {
      gems:390,
      pityCounter: 0,
      totalPulls: 0,
      inventory: {
        '3star': 0,
        '4star': 0,
        '5star': 0
      },
      hasUnlockedEscape: false
    };

    // Constants - TRUE FRUSTRATION FREE!
    const PITY_LIMIT = 3;
    const COST_PER_PULL = 160;
    const REFUND_ON_PITY = 160;
    const RECYCLE_VALUES = {
      '3star': 50,
      '4star': 100,
      '5star': 160
    };

    // Drop Tables
    const drops3Star = [
      "[Orphaned Semicolon ;]",
      "[Corrupted Favicon.ico]",
      "[Broken Image Link]",
      "[Deprecated Font Tag]",
      "[Unused CSS Variable]",
      "[Missing Div Closing]",
      "[Malformed JSON]",
      "[404 Page Itself]",
      "[Console Error Log]",
      "[Empty Array []]"
    ];

    const drops4Star = [
      "SR: [Functional 404 Stylesheet]",
      "SR: [Server Morale Boost Token]",
      "SR: [LocalStorage Cleaner]",
      "SR: [Debug Console Output]",
      "SR: [Valid Meta Tag]",
      "SR: [SEO Keyword Generator]",
      "SR: [Responsive Breakpoint Fix]",
      "SR: [Git Commit Message]"
    ];

    const drops5Star = [
      "SSR: [SECURE_HOMEPAGE_GATEWAY]",
      "SSR: [FULL_SYSTEM_OVERRIDE]",
      "SSR: [ROOT_ACCESS_TOKEN]",
      "SSR: [ADMIN_PANEL_KEY]",
      "SSR: [DATABASE_BYPASS_PROTOCOL]"
    ];

    // =====================================================
    // UTILITY FUNCTIONS
    // =====================================================
    function calculateRecycleValue() {
      return (state.inventory['3star'] * RECYCLE_VALUES['3star']) +
             (state.inventory['4star'] * RECYCLE_VALUES['4star']) +
             (state.inventory['5star'] * RECYCLE_VALUES['5star']);
    }

    function updateDisplays() {
      gemsDisplay.textContent = state.gems;
      pityCounterEl.innerHTML = `${state.pityCounter}<span style="color:#888;">/${PITY_LIMIT}</span>`;
      totalPullsEl.textContent = state.totalPulls;
      inv3StarEl.textContent = state.inventory['3star'];
      inv4StarEl.textContent = state.inventory['4star'];
      inv5StarEl.textContent = state.inventory['5star'];

      // Visual warning when near pity
      if (state.pityCounter >= PITY_LIMIT - 1) {
        pityCounterEl.className = 'stat-value danger';
      } else if (state.pityCounter >= PITY_LIMIT - 2) {
        pityCounterEl.className = 'stat-value warning';
      } else {
        pityCounterEl.className = 'stat-value';
      }

      // Show recycle button when ANY items available
      const totalItems = state.inventory['3star'] + state.inventory['4star'] + state.inventory['5star'];
      if (totalItems > 0) {
        recycleBtn.classList.remove('hidden');
        const totalValue = calculateRecycleValue();
        recycleValueEl.textContent = totalValue;
        recycleBtn.innerHTML = `♻️ RECYCLE ALL → <span id="recycle-value">${totalValue}</span> 💎`;
      } else {
        recycleBtn.classList.add('hidden');
      }
    }

    function createSparkles(container) {
      for (let i = 0; i < 12; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.innerHTML = '✨';
        sparkle.style.left = `${Math.random() * 80 + 10}%`;
        sparkle.style.top = `${Math.random() * 80 + 10}%`;
        sparkle.style.animationDelay = `${Math.random() * 0.5}s`;
        container.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
      }
    }

    // =====================================================
    // ROLL MECHANICS - CORRECTED PITY LOGIC
    // =====================================================
    function calculateDrop() {
      const roll = Math.random() * 100;
      
      // Pity system: Guaranteed 5★ at limit
      if (state.pityCounter >= PITY_LIMIT - 1) {
        // NEXT pull will be guaranteed 5★
        state.pityCounter++;
        const drop = {
          rarity: 5,
          name: drops5Star[Math.floor(Math.random() * drops5Star.length)],
          guaranteed: true
        };
        state.pityCounter = 0; // Reset AFTER guarantee
        return drop;
      }
      
      // Normal RNG
      if (roll < 10) {
        // 10% chance for 5★
        state.pityCounter = 0;
        return {
          rarity: 5,
          name: drops5Star[Math.floor(Math.random() * drops5Star.length)],
          guaranteed: false
        };
      } else if (roll < 35) {
        // 25% chance for 4★
        state.pityCounter++;
        return {
          rarity: 4,
          name: drops4Star[Math.floor(Math.random() * drops4Star.length)],
          guaranteed: false
        };
      } else {
        // 65% chance for 3★
        state.pityCounter++;
        return {
          rarity: 3,
          name: drops3Star[Math.floor(Math.random() * drops3Star.length)],
          guaranteed: false
        };
      }
    }

    // =====================================================
    // RENDER FUNCTIONS
    // =====================================================
    function renderSingleDrop(drop, delay = 0) {
      return new Promise(resolve => {
        setTimeout(() => {
          state.inventory[`${drop.rarity}star`]++;
          
          if (drop.rarity === 5) {
            dropScreen.innerHTML = `
              <div class="stars-5">★★★★★</div>
              <div class="stars-5" style="font-size: 1rem; margin-top: 12px; animation-delay: 0.2s;">${drop.name}</div>
              ${drop.guaranteed ? '<div style="color: #ff9900; font-size: 0.7rem; margin-top: 8px;">[PITY GUARANTEED]</div>' : ''}
            `;
            createSparkles(dropScreen);
            if (!state.hasUnlockedEscape) {
              state.hasUnlockedEscape = true;
              escapeLink.classList.remove('hidden');
            }
          } else if (drop.rarity === 4) {
            dropScreen.innerHTML = `
              <div class="stars-4">★★★★</div>
              <div class="stars-4" style="font-size: 0.9rem; margin-top: 12px;">${drop.name}</div>
            `;
          } else {
            dropScreen.innerHTML = `
              <div class="stars-3">★★★</div>
              <div class="stars-3" style="font-size: 0.8rem; margin-top: 12px;">${drop.name}</div>
            `;
          }
          
          updateDisplays();
          resolve();
        }, delay);
      });
    }

    async function renderMultipleDrops(drops) {
      dropScreen.innerHTML = '<div class="drop-grid" id="drop-grid"></div>';
      const grid = document.getElementById('drop-grid');
      
      for (let i = 0; i < drops.length; i++) {
        state.inventory[`${drops[i].rarity}star`]++;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = `drop-item stars-${drops[i].rarity}`;
        itemDiv.style.animationDelay = `${i * 0.1}s`;
        itemDiv.innerHTML = `
          <div>${'★'.repeat(drops[i].rarity)}</div>
          <div style="font-size: 0.65rem; margin-top: 4px;">${drops[i].name}</div>
        `;
        grid.appendChild(itemDiv);
        
        if (drops[i].rarity === 5) {
          createSparkles(dropScreen);
          if (!state.hasUnlockedEscape) {
            state.hasUnlockedEscape = true;
            setTimeout(() => escapeLink.classList.remove('hidden'), 1500);
          }
        }
      }
      
      updateDisplays();
    }

    // =====================================================
    // UNIVERSAL RECYCLE MECHANIC
    // =====================================================
    function recycleAllItems() {
      const totalValue = calculateRecycleValue();
      
      if (totalValue === 0) return;

      dropScreen.innerHTML = '<div style="color:#888;">♻️ RECYCLING ALL ITEMS...</div>' +
                             '<div style="color:#888; margin-top:8px;">[- All inventory items]</div>';
      
      setTimeout(() => {
        // Reset inventory
        state.inventory['3star'] = 0;
        state.inventory['4star'] = 0;
        state.inventory['5star'] = 0;
        
        // Add crystals
        state.gems += totalValue;
        
        dropScreen.innerHTML = '<div style="color:#00ff33;">💎 +' + totalValue + ' CRYSTALS RECOVERED</div>' +
                               '<div style="color:#888; margin-top:8px; font-size:0.7rem;">[All materials repurposed successfully]</div>';
      }, 800);

      updateDisplays();
    }

    // =====================================================
    // MAIN PULL FUNCTION
    // =====================================================
    async function executeGachaPull(quantity) {
      const cost = quantity * COST_PER_PULL;
      
      // Check if player has enough gems
      if (state.gems < cost) {
        const totalItems = state.inventory['3star'] + state.inventory['4star'] + state.inventory['5star'];
        const totalValue = calculateRecycleValue();
        
        let msg = '<div style="color: #ff3333;">[INSUFFICIENT CRYSTALS]</div>';
        
        if (totalItems > 0) {
          msg += `<div style="color:#ffcc00; margin-top:8px; font-size:0.8rem;">You have ${totalItems} items worth ${totalValue} 💎</div>`;
          msg += '<div style="color:#888; margin-top:4px; font-size:0.75rem;">Click RECYCLE ALL below ↴</div>';
        } else {
          msg += '<div style="color:#888; margin-top:8px; font-size:0.8rem;">No items to recycle - try x10 pull next session</div>';
        }
        
        dropScreen.innerHTML = msg;
        return;
      }

      // Deduct gems
      state.gems -= cost;
      state.totalPulls += quantity;
      updateDisplays();

      // Show loading state
      actionArea.classList.add('hidden');
      dropScreen.innerHTML = `
        <div class="loading">
          <div class="spinner"></div>
          <div style="color: #ffcc00;">Summoning ${quantity}x data packets...</div>
        </div>
      `;

      // Wait for "simulation"
      await new Promise(resolve => setTimeout(resolve, 1000 + (quantity * 200)));

      // Generate drops
      const drops = [];
      for (let i = 0; i < quantity; i++) {
        drops.push(calculateDrop());
      }

      // Check if we got any 5★ and refund logic
      const got5Star = drops.some(d => d.rarity === 5);
      if (got5Star && quantity === 1) {
        state.gems += REFUND_ON_PITY;
      }

      // Render results
      if (quantity === 1) {
        await renderSingleDrop(drops[0]);
      } else {
        await renderMultipleDrops(drops);
      }

      // Refill gems if 5★ obtained
      if (got5Star) {
        state.gems += 160;
        updateDisplays();
      }

      // Show action buttons again
      setTimeout(() => {
        actionArea.classList.remove('hidden');
      }, quantity === 1 ? 500 : 1000);
    }

    // =====================================================
    // INITIALIZATION
    // =====================================================
    updateDisplays();