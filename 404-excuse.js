  const excusesList = [
    "Root Cause: A hamster chewed through the main optical cable. Technicians are currently feeding it. 🐹",
    "Root Cause: The website's AI submitted a vacation request and is currently relaxing on a virtual beach. 🌴",
    "Root Cause: This page exists, but only in an alternate dimension. Please recalibrate your quantum tuner. 🌌",
    "Root Cause: Spilled coffee onto the primary mainframe. The server is still shaking from the caffeine. ☕",
    "Root Cause: The administrator took the code home and accidentally left it on the public bus. 🚌",
    "Root Cause: Critical disruption in the space-time continuum. Please take three steps away from the monitor. 🕳️",
    "Root Cause: Solar flares are actively reorganizing our data index packages into random emojis. ☀️",
    "Root Cause: The server gnome is currently sleeping on the requested database sector. 🧝",
    "Root Cause: A rogue pixel escaped its rendering queue and caused a cascade failure. 🔲",
    "Root Cause: The cloud storage is actually just someone's laptop named 'Cloud'. It crashed. 💻",
    "Root Cause: Our firewall caught a cold and blocked all legitimate traffic by accident. 🤧",
    "Root Cause: The database forgot its own password and locked itself out permanently. 🔐",
    "Root Cause: An intern unplugged the 'server' thinking it was a space heater. ❄️",
    "Root Cause: The CDN got lost trying to find its way back from the content delivery trip. 🗺️",
    "Root Cause: DNS servers are undergoing existential therapy. They question their purpose. 🧘",
    "Root Cause: The load balancer distributed traffic unevenly, now one server is depressed. ⚖️",
    "Root Cause: A backup generator tried to backup a file that was already backed up. 🔄",
    "Root Cause: The cache expired so aggressively it deleted itself along with everything else. 🗑️",
    "Root Cause: Our uptime monitoring service is down, ironically monitoring its own outage. 📉",
    "Root Cause: A microservice had a microbreakdown. It's taking a micro-vacation. 🔬",
    "Root Cause: The API received too many compliments and decided to take a nap. 😴",
    "Root Cause: Bandwidth ran out halfway through loading this error message. You got cut off mid-crisis. 📶",
    "Root Cause: SSL certificates got confused about which identity to prove during verification. 🛂",
    "Root Cause: Git merge conflict on production. Someone typed 'theirs' instead of 'ours'. 🌳",
    "Root Cause: The web socket disconnected to go do some soul-searching. It'll be back. 🔌",
    "Root Cause: Container orchestration failed because the containers refused to dock. ⚓",
    "Root Cause: Load testing was too successful. The system now fears actual traffic. 🏋️"
  ];

    function renderRandomExcuse() {
      const displayField = document.getElementById("excuse-text");

      // FIXED: Using Date.now() as a seed modifier to completely bypass browser caching on first load
      const pseudoSeed = Date.now() + Math.random();
      const randomIndex = Math.floor((pseudoSeed * 13) % excusesList.length);

      displayField.innerText = excusesList[randomIndex];
    }

    // Fire the application up instantly
    renderRandomExcuse();