    const promptDisplay = document.getElementById('prompt-display');
    const inputSelector = document.getElementById('input-selector');
    const escapeLink = document.getElementById('escape-link');
    const logFooter = document.getElementById('log-footer');

    function selectDialogueOption(lifepathKey) {
      inputSelector.classList.add('hidden');

      if (lifepathKey === 'corp') {
        promptDisplay.innerHTML = "Corporate credentials processed. Arasaka-level data handshake verification accepted.<br>" +
                                   "<span style='color: #00ffcc;'>'Thank you for traveling premium tier. Clearing connection pipeline lanes now.'</span>";
        logFooter.innerText = "Subnet trace status: CORPORATE_OVERRIDE // Code: 200_OK";
      } else if (lifepathKey === 'runner') {
        promptDisplay.innerHTML = "Uploading icebreaker daemon... Matrix sequence injected. Firewall node completely subverted.<br>" +
                                   "<span style='color: #ffcc00;'>'Nice exploit, kid. The mainframe didn't even notice the backdoor compile.'</span>";
        logFooter.innerText = "Subnet trace status: CYBER_EXPLOIT_COMPILED // Code: 200_OK";
      } else {
        promptDisplay.innerHTML = "Hardware structural impact registered. Server rack fan rattling loudly... Spark emitted.<br>" +
                                   "<span style='color: #ff0055;'>'Huh, incredible. Physical percussive maintenance actually worked. The routing rail snapped back into place.'</span>";
        logFooter.innerText = "Subnet trace status: HARDWARE_FORCED_REBOOT // Code: 200_OK";
      }

      setTimeout(function() {
        escapeLink.classList.remove('hidden');
      }, 1000);
    }