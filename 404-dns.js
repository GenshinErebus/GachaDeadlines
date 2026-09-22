    const logBox = document.getElementById('log-box');
    const pingBtn = document.getElementById('ping-btn');
    const escapeLink = document.getElementById('escape-link');

    let pingCount = 0;
    let isFinished = false;

    // A collection of humorous server irritation logs
    const networkResponses = [
      "PING genshinerebus.github.io: packet loss 100% (gateway unreachable)",
      "PING genshinerebus.github.io: timeout! Request expired on hop 14.",
      "WARN: Server load high. Stop multi-threading requests.",
      "ALERT: Packet flood detected! Security wall warning generated.",
      "CRITICAL: Router thread cache buffer full. Core melting.",
      "FINE! Stop spamming the gateway button. Take the link..."
    ];

    function printLogLine(text, statusClass) {
      const line = document.createElement('div');
      line.className = "log-entry " + (statusClass || "");
      line.innerText = "[" + new Date().toLocaleTimeString() + "] " + text;
      logBox.appendChild(line);
      logBox.scrollTop = logBox.scrollHeight;
    }

    function floodPingQuery() {
      if (isFinished) return;

      pingCount++;

      if (pingCount < 8) {
        const responseIdx = Math.min(pingCount - 1, networkResponses.length - 2);
        printLogLine(networkResponses[responseIdx], "log-fail");
      } else {
        isFinished = true;
        pingBtn.classList.add('hidden');
        escapeLink.classList.remove('hidden');

        printLogLine(networkResponses[networkResponses.length - 1], "log-success");
        printLogLine("STATUS_200: Temporary bypass route established successfully.", "log-success");
      }
    }