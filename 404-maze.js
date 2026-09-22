    const titleField = document.getElementById('title-field');
    const articleField = document.getElementById('article-field');
    const statusMsg = document.getElementById('status-msg');
    const escapeLink = document.getElementById('escape-link');

    let clickDepth = 0;
    const maxDepthLimit = 6;

    const wikiArticles = {
      start: {
        title: "📚 Wiki: Link Dematerialization",
        html: "The requested URL has suffered an unexpected case of <b>Link Dematerialization</b>. This occurs when a network packet wanders off into the <span class='wiki-link' onclick='jumpToWikiArticle(\"void\")'>Mainframe Void</span>, often chased by rogue <span class='wiki-link' onclick='jumpToWikiArticle(\"gnomes\")'>Server Gnomes</span> who hoard strings of loose code."
      },
      void: {
        title: "🌌 Wiki: Mainframe Void",
        html: "The <b>Mainframe Void</b> is an unallocated digital space located somewhere between your local browser cache and an angry router stack. It is theorized that unclosed semicolons collapse here, generating localized <span class='wiki-link' onclick='jumpToWikiArticle(\"paradox\")'>Quantum Paradoxes</span> that dissolve front-end styles."
      },
      gnomes: {
        title: "🍄 Wiki: Server Gnomes",
        html: "<b>Server Gnomes</b> are microscopic carbon-silicon entities living inside legacy database racks. They are notorious for dragging unindexed directory paths into their underground tunnels. To appease them, engineers must broadcast a signal to the mythical <span class='wiki-link' onclick='jumpToWikiArticle(\"mainframe\")'>Destiny Mainframe</span>."
      },
      paradox: {
        title: "⏳ Wiki: Quantum Paradox",
        html: "A <b>Quantum Paradox</b> in web infrastructure manifests when a user simultaneously exists on a webpage and does not exist on it (Error 404). This breaks the laws of physics, forcing the hardware layers to consult the ancient <span class='wiki-link' onclick='jumpToWikiArticle(\"mainframe\")'>Destiny Mainframe</span>."
      },
      mainframe: {
        title: "🔮 Wiki: Destiny Mainframe",
        html: "The <b>Destiny Mainframe</b> is a legendary computing core rumored to be fueled entirely by spilled cold brew coffee and unapproved pull requests. Legend says it holds the master directory to all lost file indexes, guarded closely by the feared <span class='wiki-link' onclick='jumpToWikiArticle(\"cat\")'>Keyboard Cat</span> or deep inside the <span class='wiki-link' onclick='jumpToWikiArticle(\"archive\")'>StackOverflow Archive</span>."
      },
      cat: {
        title: "🐈 Wiki: Keyboard Cat",
        html: "<b>Keyboard Cat</b> is the localized guardian manifestations shell script patrolling the mainframe layers. It handles active buffer dumps by playing an upbeat 8-bit melody that rhythmically flushes corrupted sectors into the <span class='wiki-link' onclick='jumpToWikiArticle(\"void\")'>Mainframe Void</span>."
      },
      archive: {
        title: "💾 Wiki: StackOverflow Archive",
        html: "The <b>StackOverflow Archive</b> is a digital vault enclosing solutions to problems that haven't even been invented yet. It is mostly visited by desperate carbon-units hunting down answers posted by a user named 'CyberGuru99' who was last seen active in the <span class='wiki-link' onclick='jumpToWikiArticle(\"start\")'>First Terminal Era</span>."
      }
    };

    function jumpToWikiArticle(targetKey) {
      clickDepth++;

      if (clickDepth >= maxDepthLimit) {
        titleField.innerText = "⚠️ SYSTEM_ABORT: DEPTH_CRITICAL";
        titleField.style.color = "#ff3333";
        titleField.style.textShadow = "0 0 5px #ff3333";
        
        articleField.innerHTML = "<span style='color: #ff3333; font-weight: bold;'>[ACCESS_DENIED]</span><br><br>Warning: You are tumbling too deep into the web rabbit hole. Mainframe buffer capacity reached. Aborting data query to prevent brain-index corruption.";
        articleField.style.borderColor = "#ff3333";
        
        statusMsg.innerHTML = "<span style='color: #ff3333;'>Depth limit exceeded! Safely disconnect immediately.</span>";
        escapeLink.classList.remove('hidden');
        return;
      }

      const targetArticle = wikiArticles[targetKey];
      if (targetArticle) {
        titleField.innerText = targetArticle.title;
        articleField.innerHTML = targetArticle.html;
        statusMsg.innerText = "Click-hole depth: " + clickDepth + "/" + maxDepthLimit;
      }
    }

    window.onload = function() {
      titleField.innerText = wikiArticles.start.title;
      articleField.innerHTML = wikiArticles.start.html;
      statusMsg.innerText = "Click-hole depth: 0/" + maxDepthLimit;
    };