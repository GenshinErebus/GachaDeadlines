    const logWindow = document.getElementById('log-window');
    
    let currentLineIdx = 0;
    let textInterval;

    // The Rickroll sequence payload array
    const rickrollPayload = [
      "STATUS: [DECRYPTION_STAGE_1_COMPLETE]",
      "ALERT: Unrecognized music transmission intercepted...",
      "------------------------------------------",
      "We're no strangers to love...",
      "You know the rules and so do I!",
      "A full commitment's what I'm thinking of...",
      "You wouldn't get this from any other guy!",
      "I just wanna tell you how I'm feeling...",
      "Gotta make you understand...",
      "------------------------------------------",
      "NEVER GONNA GIVE YOU UP! 🎤",
      "NEVER GONNA LET YOU DOWN! 🕺",
      "NEVER GONNA RUN AROUND AND DESERT YOU!",
      "NEVER GONNA MAKE YOU CRY! 💧",
      "NEVER GONNA SAY GOODBYE! 👋",
      "NEVER GONNA TELL A LIE AND HURT YOU!",
      "------------------------------------------",
      "STATUS: Connection fully Rickrolled.",
      "Recommendation: Click the button above before it loops."
    ];

    function appendStreamLog(text) {
      const line = document.createElement('div');
      
      // Highlight flags and system logs versus the actual lyrics
      if (text.includes("STATUS:") || text.includes("----------------")) {
        line.className = "log-line";
      } else if (text.includes("ALERT:")) {
        line.className = "log-line log-alert";
      } else {
        line.className = "log-line lyrics-line";
      }
      
      line.innerText = text;
      logWindow.appendChild(line);
      logWindow.scrollTop = logWindow.scrollHeight; // Force scroll to anchor bottom
    }

    function processNextPayloadStep() {
      if (currentLineIdx < rickrollPayload.length) {
        appendStreamLog(rickrollPayload[currentLineIdx]);
        currentLineIdx++;
      } else {
        clearInterval(textInterval); // End sequence cleanly
      }
    }

    // Launch configuration engine sequence with a subtle initialization delay
    setTimeout(function() {
      appendStreamLog("STATUS: Initializing decryptor array...");
      textInterval = setInterval(processNextPayloadStep, 1100); // Prints a new line every 1.1s
    }, 1200);