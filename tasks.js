        // 1. ADD YOUR GAMES HERE
        // Just add the names to this list. The UI updates automatically!
        // This list drives BOTH the daily and the weekly section.
        const GAMES_LIST = [
            "Genshin Impact",
            "Honkai: Star Rail",
            "Zenless Zone Zero",
            "Arknights Endfield",
            "Duet Night Abyss",
            "Neverness To Everness",
            "Reverse 1999",
            "Wuthering Waves"
        ];

        // Helper to get today's date string (YYYY-MM-DD)
        function getTodayString() {
            const today = new Date();
            return today.getFullYear() + '-' +
                String(today.getMonth() + 1).padStart(2, '0') + '-' +
                String(today.getDate()).padStart(2, '0');
        }

        // Helper to get the current week's identifier.
        // Returns the date of the Monday of the current week (YYYY-MM-DD).
        // As soon as Monday 00:00 begins, this key changes → weekly status resets.
        function getCurrentWeekString() {
            const now = new Date();
            const day = now.getDay(); // 0 = Sunday, 1 = Monday, ...
            // Sunday (0) wraps back 6 days to the previous Monday
            const offsetToMonday = (day === 0) ? 6 : (day - 1);
            const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offsetToMonday);
            return monday.getFullYear() + '-' +
                String(monday.getMonth() + 1).padStart(2, '0') + '-' +
                String(monday.getDate()).padStart(2, '0');
        }

        // Generates a clean key for LocalStorage from the name
        function getStorageKey(name) {
            return name.toLowerCase().replace(/[^a-z0-9]/g, '');
        }

        // Renders one card (daily or weekly) into the given container
        function renderCard(container, game, type) {
            const key = getStorageKey(game);
            // Weekly and daily keys stay separate in LocalStorage,
            // so a daily check-in does NOT count as the weekly one.
            const periodKey = type === 'weekly' ? `week_${key}` : `date_${key}`;

            if (type === 'weekly') {
                // Reset if the week is over (midnight Sunday → Monday)
                const lastWeek = localStorage.getItem(periodKey);
                if (lastWeek !== getCurrentWeekString()) {
                    localStorage.removeItem(`status_${key}_weekly`);
                }
            } else {
                // Reset if midnight has passed since the last check-in
                const lastCheckInDate = localStorage.getItem(periodKey);
                if (lastCheckInDate !== getTodayString()) {
                    localStorage.removeItem(`status_${key}_daily`);
                }
            }

            const statusId = `status_${key}_${type}`;
            const btnId = `btn_${key}_${type}`;
            const storedStatus = type === 'weekly'
                ? localStorage.getItem(`status_${key}_weekly`)
                : localStorage.getItem(`status_${key}_daily`);
            const isChecked = storedStatus === 'true';

            const card = document.createElement('div');
            card.className = type === 'weekly' ? 'game-card weekly-card' : 'game-card';
            card.id = `card_${key}_${type}`;

            card.innerHTML = `
            <h2 class="game-title">${game}</h2>
            <div id="${statusId}" class="status ${isChecked ? 'checked' : 'not-checked'}">
                ${isChecked ? '✅ Cleared' : '❌ To Do'}
            </div>
            <button id="${btnId}" onclick="doCheckIn('${game}', '${type}')" ${isChecked ? 'disabled' : ''}>
                ${isChecked ? (type === 'weekly' ? 'Done for the week' : 'Done for today') : 'Done?'}
            </button>
        `;
            container.appendChild(card);
        }

        // Initialize the dashboard
        function initDashboard() {
            const dailyContainer = document.getElementById('gamesContainer');
            const weeklyContainer = document.getElementById('weeklyContainer');

            GAMES_LIST.forEach(game => renderCard(dailyContainer, game, 'daily'));
            GAMES_LIST.forEach(game => renderCard(weeklyContainer, game, 'weekly'));
        }

        // Handles the check-in event for a specific item (daily or weekly)
        function doCheckIn(name, type) {
            const key = getStorageKey(name);
            const statusId = `status_${key}_${type}`;
            const btnId = `btn_${key}_${type}`;

            // Save status + corresponding period identifier
            localStorage.setItem(`status_${key}_${type}`, 'true');
            if (type === 'weekly') {
                localStorage.setItem(`week_${key}`, getCurrentWeekString());
            } else {
                localStorage.setItem(`date_${key}`, getTodayString());
            }

            // Update the UI immediately
            const statusBox = document.getElementById(statusId);
            const button = document.getElementById(btnId);

            statusBox.textContent = "✅ Cleared";
            statusBox.className = "status checked";
            button.disabled = true;
            button.textContent = type === 'weekly' ? "Done for the week" : "Done for today";
        }

        // Start everything when the page loads
        window.onload = initDashboard;