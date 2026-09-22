 function calculateDeadline() {
            const gameSelect = document.getElementById('gameLogic');

            if (gameSelect.selectedIndex === 0) {
                alert("Please select a game first!");
                return;
            }

            const bannerEndUtcHour = parseInt(gameSelect.value);
            const inputStr = document.getElementById('remainingTime').value.trim();
            const outputDiv = document.getElementById('output');

            if (!inputStr) {
                outputDiv.innerText = "Please enter data!";
                return;
            }

            let targetDate = new Date();

            // CASE 1: Input is already an ISO string
            if (inputStr.includes('T')) {
                const match = inputStr.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
                if (!match) {
                    outputDiv.innerText = "Invalid ISO date format!";
                    return;
                }
                const utcDate = Date.UTC(
                    parseInt(match[1]),
                    parseInt(match[2]) - 1,
                    parseInt(match[3]),
                    parseInt(match[4]),
                    parseInt(match[5]),
                    parseInt(match[6])
                );
                targetDate = new Date(utcDate);
            }
            // CASE 2: Process relative time indications
            else {
                const daysMatch = inputStr.match(/(\d+)\s*d/i);
                const hoursMatch = inputStr.match(/(\d+)\s*h/i);

                const days = daysMatch ? parseInt(daysMatch[1]) : 0;
                const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;

                if (daysMatch && !hoursMatch) {
                    // DAYS ONLY — Hours/minutes unknown
                    // 1. Find next server reset from NOW
                    targetDate.setUTCHours(bannerEndUtcHour, 0, 0, 0);
                    if (targetDate.getTime() <= Date.now()) {
                        // Reset today already passed → take tomorrow
                        targetDate.setUTCDate(targetDate.getUTCDate() + 1);
                    }
                    // 2. Add built-in days ON TOP
                    targetDate.setUTCDate(targetDate.getUTCDate() + days);
                }
                else if (hoursMatch) {
                    // HOURS specified — maintain existing logic
                    const minutesToFullHour = 60 - targetDate.getUTCMinutes();
                    const totalHoursToAdd = (days * 24) + hours;
                    targetDate.setUTCHours(targetDate.getUTCHours() + totalHoursToAdd);
                    targetDate.setUTCMinutes(targetDate.getUTCMinutes() + minutesToFullHour);
                    targetDate.setUTCSeconds(0);
                    targetDate.setUTCMilliseconds(0);
                }
                else if (/^\d+$/.test(inputStr)) {
                    // Number only without 'd' — same logic as "Xd"
                    targetDate.setUTCHours(bannerEndUtcHour, 59, 0, 0);
                    if (targetDate.getTime() <= Date.now()) {
                        targetDate.setUTCDate(targetDate.getUTCDate() + 1);
                    }
                    targetDate.setUTCDate(targetDate.getUTCDate() + parseInt(inputStr));
                } else {
                    outputDiv.innerText = "Format not recognized!";
                    return;
                }
            }

            // APPLY WINTER TIME OFFSET (if checkbox checked)
            const winterOffsetEnabled = document.getElementById('winterTimeOffset').checked;
            if (winterOffsetEnabled) {
                targetDate.setUTCHours(targetDate.getUTCHours() - 1);
            }

            // MANUAL FORMATTING IN UTC
            const pad = (num) => String(num).padStart(2, '0');

            const year = targetDate.getUTCFullYear();
            const month = pad(targetDate.getUTCMonth() + 1);
            const day = pad(targetDate.getUTCDate());
            const hour = pad(targetDate.getUTCHours());
            const minute = pad(targetDate.getUTCMinutes());
            const second = pad(targetDate.getUTCSeconds());

            const cleanIsoOutput = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
            const formattedLineOutput = `endDate: "${cleanIsoOutput}"`;

            outputDiv.innerText = formattedLineOutput;

            navigator.clipboard.writeText(formattedLineOutput).then(() => {
                console.log("Zeile kopiert: " + formattedLineOutput);
            }).catch(err => {
                console.error('Fehler beim Kopieren: ', err);
            });
        }