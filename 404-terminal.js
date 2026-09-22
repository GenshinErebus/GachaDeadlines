   const inputField = document.getElementById('terminal-input');
    const historyContainer = document.getElementById('history');

    // Keep input field focused even if user clicks elsewhere on the page
    document.addEventListener('click', () => inputField.focus());

    // Handle user inputs
    inputField.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        const command = this.value.trim().toLowerCase();

        // Print the typed command into history
        printLine(`guest@system:~# ${this.value}`);

        // Process the command
        processCommand(command);

        // Reset input and scroll down
        this.value = '';
        window.scrollTo(0, document.body.scrollHeight);
      }
    });

    // Terminal command logic
    function processCommand(cmd) {
      switch (cmd) {
        case '':
          break;
        case 'help':
          printLine('Available protocols:\n' +
            '  home   - Safely abort and return to the main base\n' +
            '  clear  - Wipe current terminal buffer\n' +
            '  joke   - Request a developer joke for morale boost\n' +
            '  matrix - Wake up, Neo...');
          break;
        case 'home':
          printLine('Initiating hyper-jump back to homepage...');
          setTimeout(() => {
            window.location.href = '/GachaDeadlines/';
          }, 1500);
          break;
        case 'clear':
          historyContainer.innerHTML = '';
          break;
        case 'joke':
          const jokes = [
            "Why do programmers wear glasses? Because they can't C#.",
            "There are 10 types of people in the world: those who understand binary, and those who don't.",
            "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?'",
            "How many programmers does it take to change a light bulb? None, it's a hardware problem.",
            "Why did the developer go broke? Because he used up all his cache.",
            "Why do Java developers wear glasses? To better see C#.",
            "Why do programmers prefer dark mode? Because light attracts bugs.",
            "There's nothing wrong with your code. It must be your computer.",
            "Programmers don't get tired. They just run out of stack space.",
            "I would tell you a joke about UDP, but you might not get it.",
            "A programmer's wife tells him: 'Go to the store and get a loaf of bread. If they have eggs, get a dozen.' He returns with 13 loaves of bread.",
            "Why don't zombies like to code? Because they can't handle the stack overflow.",
            "What's the object-oriented way to become wealthy? Inheritance.",
            "Why was the JavaScript developer sad? Because he didn't know how to 'null' his feelings.",
            "How does a programmer carve a pumpkin? With a pumpkin patch.",
            "Why did the function throw an error? Because it felt undefined.",
            "What do you call a programmer from Finland? Nerdic.",
            "Why do Python programmers prefer snakes? Because they're already comfortable with indentation.",
            "A good programmer is someone who always looks both ways before crossing a one-way street.",
            "Why was the cell phone wearing glasses? Because it lost its contacts.",
            "There are only two hard things in Computer Science: cache invalidation and naming things.",
            "Why did the developer quit his job? He didn't get arrays.",
            "What's a computer's favorite beat? An algorithm.",
            "Why was the web developer always calm? He knew how to handle the load.",
            "How do you comfort a JavaScript bug? You console it.",
            "Why do programmers mix up Halloween and Christmas? Because Oct 31 equals Dec 25.",
            "What did the router say to the doctor? It hurts when IP.",
            "Why was the math book sad? It had too many problems. Just like my code.",
            "A byte met another byte and said, 'Do you need a bit?'",
            "What do you call a sleeping bull in programming? A bulldozer.",
            "Why don't secrets last long in programming? Eventually everyone gets to read the source.",
            "How do you know if a programmer is an extrovert? They look at YOUR shoes when talking.",
            "What's a hacker's favorite season? Phish-ing season.",
            "Why did the developer stay cool? He kept his Windows open.",
            "What do you get when you cross a computer and a lifeguard? A screensaver.",
            "Why was the developer holding a ladder? To reach the high-level concepts.",
            "What's a program's favorite hangout spot? The Foo Bar.",
            "Why don't developers trust atoms? Because they make up everything, just like their comments.",
            "What do you call eight hobbits? A hobbyte.",
            "Why was the JavaScript developer late? There was a callback.",
            "What do you call a nervous javelin thrower? Shakespeare.",
            "Why did the coder get kicked off the bus? It was full of objects.",
            "How do you generate a random number between 1 and 6 in Java? Print 5, then die.",
            "Why do programmers hate nature? Too many bugs and no IDE.",
            "What's a programmer's favorite place in Hollywood? The Bit Bucket.",
            "Why did the function leave the loop? It wanted to break free.",
            "What do you call a factory that makes okay products? A satisfactory.",
            "Why don't oysters share? Because they're shellfish, just like some developers.",
            "What's the difference between a hippo and a Zippo? One is really heavy, the other is a little lighter.",
            "Why was the computer cold? It left its Windows open."
          ];
          const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
          printLine(`🤖 System: "${randomJoke}"`);
          break;
        case 'matrix':
          printLine('Knock, knock, Neo. 🐇');
          break;
        default:
          printLine(`❌ Unknown command: "${cmd}". Type "help" for valid parameters.`);
      }
    }

    // Helper function to append text blocks
    function printLine(text) {
      const line = document.createElement('div');
      line.className = 'output-line';
      line.innerText = text;
      historyContainer.appendChild(line);
    }