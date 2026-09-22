    const codeBox = document.getElementById('code-box');
    const statusMsg = document.getElementById('status-msg');
    const interfaceBox = document.getElementById('interface-box');
    const escapeLink = document.getElementById('escape-link');

    function resolveConflict(strategy) {
      interfaceBox.classList.add('hidden');

      if (strategy === 'head') {
        // Punish option: User stays locked in the 404 state screen
        codeBox.innerHTML = '<span style="color: #ff3333;">URL_STATUS = "404_NOT_FOUND";\nUSER_STATE = "LOST_IN_SPACE";</span>';
        statusMsg.innerHTML = "<span style='color: #ff3333;'>Conflict resolved. Still lost. Re-routing loop active.</span>";

        // Re-open choices layout automatically after a brief delay
        setTimeout(() => {
          codeBox.innerHTML = '<span class="git-head">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</span>\n<span style="color: #ff3333;">URL_STATUS = "404_NOT_FOUND";</span>\n<span style="color: #ff3333;">USER_STATE = "LOST_IN_SPACE";</span>\n<span class="git-middle">=======</span>\n<span style="color: #00ff33;">URL_STATUS = "200_OK";</span>\n<span style="color: #00ff33;">USER_STATE = "RETURNING_HOME";</span>\n<span class="git-incoming">&gt;&gt;&gt;&gt;&gt;&gt;&gt; main</span>';
          statusMsg.innerText = "Choose code resolution option:";
          interfaceBox.classList.remove('hidden');
        }, 2200);

      } else {
        // Win option: The code updates to the clean home routing path configurations
        codeBox.innerHTML = '<span style="color: #00ff33;">URL_STATUS = "200_OK";\nUSER_STATE = "RETURNING_HOME";</span>';
        statusMsg.innerHTML = "<span style='color: #00ff33; font-weight: bold;'>Conflict resolved! Staging updates...</span>";
        escapeLink.classList.remove('hidden');
      }
    }