const inputField = document.getElementById('terminal-input');
const historyContainer = document.getElementById('history');

// Keep input field focused even if user clicks elsewhere on the page
document.addEventListener('click', () => inputField.focus());

// Command history for arrow up/down navigation
let commandHistory = [];
let historyIndex = -1;

// Handle user inputs
inputField.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    const command = this.value.trim().toLowerCase();

    // Save non-empty commands to history
    if (command !== '') {
      commandHistory.push(this.value);
      historyIndex = commandHistory.length;
    }

    // Print the typed command into history
    printLine(`guest@system:~# ${this.value}`);

    // Process the command
    processCommand(command);

    // Reset input and scroll down
    this.value = '';
    window.scrollTo(0, document.body.scrollHeight);
  }
});

// Arrow up - previous command
inputField.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (commandHistory.length > 0) {
      if (historyIndex === -1) {
        historyIndex = commandHistory.length - 1;
      }
      if (historyIndex >= 0 && historyIndex < commandHistory.length) {
        this.value = commandHistory[historyIndex];
      }
      historyIndex--;
    }
  }
});

// Arrow down - next command
inputField.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (commandHistory.length > 0) {
      historyIndex++;
      if (historyIndex >= commandHistory.length) {
        historyIndex = commandHistory.length;
        this.value = '';
      } else {
        this.value = commandHistory[historyIndex];
      }
    }
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
        '  joke   - Request a top-rated English joke\n' +
        '  gg     - Good game! Get a gaming joke\n' +
        '  facts  - Learn something new - random general fact\n' +
        '  tech   - Get an interesting technology fact');
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
      const topJokes = [
        "I told my wife she was drawing her eyebrows too high. She looked surprised.",
        "Why don't scientists trust atoms? Because they make up everything!",
        "I'm reading a book about anti-gravity. It's impossible to put down!",
        "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
        "Why don't skeletons fight each other? They don't have the guts.",
        "What do you call a fake noodle? An impasta!",
        "How do you organize a space party? You planet!",
        "Why did the scarecrow win an award? Because he was outstanding in his field!",
        "What do you call a bear with no teeth? A gummy bear!",
        "Why can't you give Elsa a balloon? Because she will let it go!",
        "I invented a new word! Plagiarism!",
        "Why don't eggs tell jokes? They'd crack each other up!",
        "What do you call a pile of cats? A meowtain!",
        "Why did the bicycle fall over? Because it was two-tired!",
        "What do you call cheese that isn't yours? Nacho cheese!",
        "I used to hate facial hair, but then it grew on me.",
        "The man who survived pepper spray and mustard gas is now a seasoned veteran.",
        "I'm on a seafood diet. I see food and I eat it.",
        "Why do fathers take an extra pair of socks when they go golfing? In case they get a hole in one!",
        "Singing in the shower is fun until you get soap in your mouth. Then it's a soap opera.",
        "What do a hammer and a spider have in common? They're both good at nails!",
        "What do you call an elephant that doesn't matter? An irrelephant!",
        "What do you get when you cross a snowman and a vampire? Frostbite!",
        "Why was the math book sad? Because it had too many problems!",
        "Where do fruits go on vacation? Pear-is!",
        "I asked my dog what's two minus two. He said nothing.",
        "What happens when a frog's car breaks down? It gets toad away!",
        "Why did the cookie go to the hospital? Because he felt crummy!",
        "What do you call a factory that makes good products? A satisfactory!",
        "Why don't oysters donate to charity? Because they are shellfish!",
        "How does a penguin build its house? Igloos it together!",
        "What did one wall say to the other? I'll meet you at the corner!",
        "What do you call a sleeping bull? A bulldozer!",
        "Why do cows wear bells? Because their horns don't work!",
        "What do you call a dog magician? A labracadabrador!",
        "Why was the stadium so cool? Because it was filled with fans!",
        "What do you call a fly without wings? A walk!",
        "How does a train eat? It goes chew chew!",
        "What do you call a fish made of two oranges? A sea-saw!",
        "Why don't some couples go to the gym? Because some relationships don't work out!",
        "What did the janitor say when he jumped out of the closet? Supplies!",
        "Have you heard about the chocolate record player? It sounds pretty sweet!",
        "What did the grape say when he got stepped on? Nothing, he just let out a little wine!",
        "Why don't vampires have many friends? Because they're such blood suckers!",
        "What did left eye say to right eye? Between you and me, something smells!",
        "Why did the tomato turn red? Because it saw the salad dressing!",
        "What did the ocean say to the beach? Nothing, it just waved!",
        "Why do seagulls fly over the ocean? Because if they flew over the bay, they'd be bagels!",
        "What do you call a pony with a cough? A little horse!",
        "I thought the dryer was shrinking my clothes. Turns out it was the refrigerator all along.",
        "Parallel lines have so much in common. It's a shame they'll never meet.",
        "I wondered why the frisbee kept getting bigger and bigger. Then it hit me.",
        "Why don't some fish swim in saltwater? They prefer saltines.",
        "What do you call a belt made of watches? A waist of time!",
        "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
        "I told my wife she should embrace her mistakes. She gave me a hug.",
        "What's brown and sticky? A stick.",
        "Why are elevator jokes so good? They work on so many levels.",
        "I'm terrified of elevators, so I'm going to start taking steps to avoid them.",
        "What do you call a fish wearing a bowtie? Sofishticated.",
        "Why don't mountains ever get cold? They wear snow caps!",
        "What do you call an avalanche with poor dental hygiene? A molar-avalanche!",
        "Why did the coffee file a police report? It got mugged!",
        "What do you call a sleeping pizza? A Pizzaiolo!",
        "Why do bees have sticky hair? Because they use honeycombs!",
        "What do you call a cat that eats a bowl of lemons? A sour puss!",
        "Why don't skeletons ever go out in bad weather? They have no body to go with!",
        "What do you call a cow with no legs? Ground beef!",
        "Why did the chicken join the band? Because it had the drumsticks!",
        "What do you call a dog that can perform magic? A Labracadabrador!",
        "Why can't you hear a pterodactyl use the bathroom? Because the P is silent!",
        "What do you call a group of musical whales? An orca-stra!",
        "Why was the blender so happy? It knew how to spin a good tale!",
        "What do you call a pig that does karate? A pork chop!",
        "Why don't demons like to pay taxes? They're already hell-bound!",
        "What do you call a lazy kangaroo? A pouch potato!",
        "Why did the smartphone need glasses? It lost its contacts!",
        "What's the difference between a hippo and a Zippo? One is really heavy, the other is a little lighter!",
        "Why did the picture go to jail? Because it was framed!",
        "What do you call a rabbit that tells jokes? A funny bunny!",
        "Why are frogs so happy? They eat whatever bugs them!",
        "What do you call a dinosaur that crashes his car? Tyrannosaurus Wrecks!",
        "Why did the cookie cry? Because his mom was a crumby!",
        "What do you call a snowman with a six-pack? An abdominal snowman!",
        "Why don't eggs tell secrets? They might crack!",
        "What do you call a fake stamp? A phony!",
        "Why did the peach go to school? To become a peach-ologist!",
        "What do you call a deer with no eyes? No eye-deer!",
        "Why did the orange stop? It ran out of juice!",
        "What do you call a sheep with no legs? A cloud!",
        "Why don't lobsters share? Because they're shellfish!",
        "What do you call a camel with three humps? Pregnant!",
        "Why was the broom late? It over-swept!",
        "What do you call a tooth in a glass? A molar one!",
        "Why don't skeletons ever fight? They don't have the guts!",
        "What do you call a bird that catches criminals? A police-nut!",
        "Why did the banana go to the doctor? It wasn't peeling well!",
        "What do you call a dog that can perform magic? A Labracadabrador!",
        "Why don't some countries use planes? They prefer ground transportation!",
        "What do you call a duck that gets all A's? A wise quacker!"
      ];
      const randomJoke = topJokes[Math.floor(Math.random() * topJokes.length)];
      printLine(`😄 Top Joke (${topJokes.length} total): "${randomJoke}"`);
      break;
    case 'gg':
      const gamingJokes = [
        "Why don't gamers ever get lost? Because they always follow the mini-map!",
        "What's a gamer's favorite hangout? The lobby!",
        "Why did the gamer break up with their keyboard? It wasn't their type.",
        "What do you call a fat pixel? A chunky sprite!",
        "Why don't zombies play FPS games? They can't aim with their hands!",
        "What's a ghost's favorite gaming platform? The PlayStation-Phantom!",
        "Why did the Minecraft player go to jail? For blockage of justice!",
        "What do you call a gamer who doesn't gamble? A loser!",
        "Why are gamers bad at hide and seek? They always respawn!",
        "What's a gamer's favorite tea? Dead-eye!",
        "Why did the Valorant player fail school? Because they couldn't defuse the pressure!",
        "What do you call a Fortnite player who builds badly? A brick house!",
        "Why don't Apex Legends players ever win? Because they're always in the drop!",
        "What's a CS:GO player's favorite weapon? A sharpie!",
        "Why did the League player bring a ladder to ranked? To climb!",
        "What do you call a Dota player who's always hungry? A carry!",
        "Why do gamers make good gardeners? They know how to grow plants in-game!",
        "What's a speedrunner's favorite music? Anything they can skip!",
        "Why did the streamer buy a chicken? For the cluck-chatter!",
        "What do you call a laggy connection? A delay-sever!",
        "Why don't gamers sleep? Too many quest-lines!",
        "What's a controller's favorite snack? Joy-stick crackers!",
        "Why did the RGB setup break up with the monitor? It needed more color in its life!",
        "What do you call a PC master race member? A high-resolution human!",
        "Why are gamers great at cooking? They know all about recipes and crafting!",
        "What's a VR headset's biggest fear? Reality!",
        "Why did the gamer bring a pencil to the tournament? To draw their enemies!",
        "What do you call an angry gaming chair? A rage-chair!",
        "Why do MMO players make good detectives? They're used to following quests!",
        "What's a competitive player's favorite dessert? Ranked cake!",
        "Why don't gamers like fast food? Too many seconds!",
        "What do you call a console that won't turn on? A bricked brick!",
        "Why was the game so good at math? It had too many levels!",
        "What do you call a gamer who only plays one character? Single-player!",
        "Why did the Twitch streamer bring a ladder? To reach higher subscribers!",
        "What's a gamer's least favorite exercise? Loading times!",
        "Why don't NPCs ever get tired? They just reload!",
        "What do you call a broken joystick? A control-freak!",
        "Why did the game developer go broke? They used up all their cache!",
        "What's a raid leader's favorite song? Party Rock Anthem!",
        "Why did the WoW player fail chemistry? Couldn't find the right combination!",
        "What do you call a Steam sale addict? A bargain hunter!",
        "Why don't gamers like to clean? Too many distractions in the backlog!",
        "What's an FPS player's favorite dance? The headshot shuffle!",
        "Why was the mobile gamer always broke? Too many microtransactions!",
        "What do you call a gaming mouse that's shy? A click-phobic!",
        "Why did the RPG character go to therapy? Had too many unresolved quests!",
        "What's a gamer's favorite type of shoe? Sneakers—they're already grinding!",
        "Why don't gamers ever feel alone? They've got NPCs everywhere!",
        "What do you call a lag spike during a boss fight? Performance anxiety!",
        "Why was the Esports team so good? They had perfect synergy!",
        "What do you call a gamer who never quits? A persistent player!",
        "Why did the Discord server crash? Too much toxicity!",
        "What's a retro gamer's favorite dessert? Pixel cookies!",
        "Why don't console gamers understand PC gamers? Different platforms!",
        "What do you call a gamer who wins every match? A glitch in the system!",
        "Why was the gaming setup so expensive? All the RGB money!",
        "What's a hardcore mode player's nightmare? Permadeath!",
        "Why did the Steam Deck get lost? Couldn't find the right dock!",
        "What do you call a controller with a broken trigger? A dead weight!",
        "Why don't gamers like nature? Too many real-world bugs!",
        "What's a strategy player's favorite game? Chess—the original RTS!",
        "Why did the achievement hunter get tired? Too many unlocks!",
        "What do you call a game with no story? A sandbox!",
        "Why was the gaming PC running slow? Too many background apps!",
        "What's a gamer's favorite vegetable? A loot-box!",
        "Why did the beta tester quit? Found too many bugs!",
        "What do you call a console generation? A version update!",
        "Why don't streamers like rain? Bad vibes for outdoor content!",
        "What's a sim's favorite activity? Sim-plifying life!",
        "Why did the GTA player get arrested? Real-life wanted a bounty!",
        "What do you call a gaming marathon? A LAN-party session!",
        "Why was the FPS so high? Smooth gameplay!",
        "What's a mobile gamer's worst enemy? Battery drain!",
        "Why did the indie game succeed? It had heart!",
        "What do you call a AAA game? Triple-A quality!",
        "Why don't gamers trust stairs? They're always up to something!",
        "What's a multiplayer game's favorite party trick? Invite everyone!",
        "Why did the co-op player get mad? Partner disconnected!",
        "What do you call a solo queue player? A lone wolf!",
        "Why was the tutorial so long? Teaching the basics!",
        "What's a gamer's favorite movie genre? Cutscene dramas!",
        "Why did the save file corrupt? Lost progress trauma!",
        "What do you call a game that crashed? A technical difficulty!",
        "Why don't gamers like Mondays? Weekend gaming ends!",
        "What's a competitive player's dream? Global elite rank!",
        "Why did the cosmetic item cost so much? Vanity tax!",
        "What do you call a gamer who loves lore? A completionist!",
        "Why was the patch so big? Quality of life improvements!",
        "What's a racing game's favorite song? Need for Speed!",
        "Why did the horror gamer scream? Jump scare!",
        "What do you call a puzzle game enthusiast? A brain trainer!",
        "Why don't gamers like waiting? Download speeds!",
        "What's a fighting game player's catchphrase? Combo breaker!",
        "Why did the battle royale winner celebrate? Chicken dinner!",
        "What do you call a gaming addiction? Dedication!",
        "Why was the mod so popular? Community-driven!",
        "What's a platformer's hardest level? The final boss!",
        "Why did the stealth player get caught? Too noisy!",
        "What do you call a rhythm game champion? Beat master!",
        "Why don't gamers like loading screens? Patience test!",
        "What's a simulator's best feature? Realism!",
        "Why did the open world feel endless? No loading!"
      ];
      const randomGamingJoke = gamingJokes[Math.floor(Math.random() * gamingJokes.length)];
      printLine(`🎮 GG Joke (${gamingJokes.length} total): "${randomGamingJoke}"`);
      break;
    case 'facts':
      const generalFacts = [
        "Honey never spoils. Archaeologists have found edible honey in ancient Egyptian tombs.",
        "Octopuses have three hearts and blue blood.",
        "Bananas are berries, but strawberries aren't.",
        "A day on Venus is longer than a year on Venus.",
        "Humans share 50% of their DNA with bananas.",
        "Wombat poop is cube-shaped to prevent it rolling away.",
        "The Eiffel Tower can be 15 cm taller during summer due to thermal expansion.",
        "There are more stars in the universe than grains of sand on all Earth's beaches.",
        "A cloud weighs around 500,000 kilograms.",
        "Sharks existed before trees evolved.",
        "The shortest war in history lasted 38 minutes (Britain vs Zanzibar, 1896).",
        "Cows have best friends and get stressed when separated.",
        "Scotland has 421 words for 'snow'.",
        "The longest English word is 189,819 letters long.",
        "Oxford University is older than the Aztec Empire.",
        "France was still executing people with the guillotine when the Star Wars films were released.",
        "The unicorn is Scotland's national animal.",
        "Australia is wider than the moon.",
        "A jiffy is an actual unit of time: 1/100th of a second.",
        "The total length of all blood vessels in your body is about 60,000 miles.",
        "Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.",
        "The human nose can detect over 1 trillion different scents.",
        "A teaspoonful of neutron star weighs around 6 billion tonnes.",
        "Water can boil and freeze simultaneously - this is called the triple point.",
        "The first computer bug was an actual moth trapped in a relay.",
        "Lightning strikes Earth 100 times every second.",
        "The heart of a shrimp is located in its head.",
        "Butterflies taste with their feet.",
        "Sloths hold their breath longer than dolphins - up to 40 minutes.",
        "Penguins propose to their mates with pebbles.",
        "Sea otters hold hands while sleeping to keep from drifting apart.",
        "A group of flamingos is called a 'flamboyance'.",
        "The tongue is the only muscle in the human body that attaches at one end.",
        "Golden eagles are capable of spotting prey from 2 miles away.",
        "Your stomach lining replaces itself every few days.",
        "A crocodile cannot stick its tongue out.",
        "Hummingbirds are the only birds that can fly backwards.",
        "Koalas have fingerprints almost identical to humans.",
        "The Amazon rainforest produces 20% of the world's oxygen.",
        "One million seconds equals about 11.5 days.",
        "A bolt of lightning is five times hotter than the surface of the sun.",
        "The average person spends about six months of their life waiting for red lights.",
        "There are more possible iterations of a game of chess than there are atoms in the observable universe.",
        "Your DNA can stretch to the sun and back 600 times.",
        "The world's oldest piece of chewing gum is 9,000 years old.",
        "Turtles can breathe through their buttocks.",
        "The strongest muscle in the human body is the masseter (jaw muscle).",
        "Elephants are the only mammals that can't jump.",
        "A snail can sleep for three years.",
        "The total weight of ants on Earth equals the total weight of humans.",
        "It is impossible to sneeze with your eyes open.",
        "A bullet fired from a gun on the Moon would travel 100 kilometers before falling.",
        "Cats spend 70% of their lives sleeping.",
        "Dolphins sleep with one eye open.",
        "The smell of freshly cut grass is actually a plant distress call.",
        "Fingernails grow nearly 4 times faster than toenails.",
        "You produce about 1 liter of saliva every day.",
        "A whale's heart beats only 9 times per minute.",
        "Bats always turn left when exiting their cave.",
        "The letter 'J' is the only letter not appearing in any U.S. state name.",
        "Mount Everest grows about 4mm every year.",
        "The Pacific Ocean covers more area than all landmasses combined.",
        "Blood is thicker than water - it's about 3x more viscous.",
        "The shortest war in history lasted 38 minutes.",
        "A single strand of spaghetti is called a 'spaghetto'.",
        "Nebraska is the only U.S. state with a unicameral legislature.",
        "Venus is the only planet that rotates clockwise.",
        "A jellyfish is 95% water.",
        "The Latin name for the Milky Way means 'milky circle'.",
        "There are more artificial satellites in orbit than real satellites.",
        "Goldfish have a memory span of at least 3 months.",
        "A day on Mercury is longer than its year.",
        "The universe is approximately 13.8 billion years old.",
        "Humans are bioluminescent - we glow, but it's too weak to see.",
        "There's a species of jellyfish that can live forever.",
        "The Atlantic Ocean is widening by about 2.5 cm per year.",
        "The human brain generates 12-25 watts of electricity.",
        "A blue whale's tongue weighs as much as an elephant.",
        "The smallest bone in the human body is in the ear.",
        "Diamonds can burn like coal if heated enough.",
        "Some worms can regenerate after being cut in half.",
        "The Great Barrier Reef is the largest living structure on Earth.",
        "There are more trees on Earth than stars in the Milky Way galaxy.",
        "Your bones are stronger than concrete - pound for pound.",
        "The ocean produces 70% of Earth's oxygen.",
        "A comet's tail can be millions of miles long.",
        "Shooting stars aren't actually stars - they're meteors burning up.",
        "The speed of light is 299,792,458 meters per second.",
        "Black holes bend light around them.",
        "The universe is expanding at an accelerating rate.",
        "Every second, the sun converts 600 million tons of hydrogen into helium.",
        "Sound travels 4 times faster in water than in air.",
        "Silent films were originally accompanied by piano music.",
        "The first photograph ever taken required an 8-hour exposure.",
        "Paper clips weren't patented until 1899.",
        "The first computer mouse was made of wood."
      ];
      const randomFact = generalFacts[Math.floor(Math.random() * generalFacts.length)];
      printLine(`🧠 Interesting Fact (${generalFacts.length} total): "${randomFact}"`);
      break;
    case 'tech':
      const techFacts = [
        "The first computer bug was an actual moth trapped in a Harvard Mark II computer in 1947.",
        "The world's first computer programmer was Ada Lovelace in the 1840s.",
        "The first computer virus appeared in 1971 and was called 'Creeper'.",
        "The QWERTY keyboard was designed in the 1870s to slow typists down and prevent jamming.",
        "The first hard drive, introduced in 1956, could store 5MB and weighed over a ton.",
        "The first USB flash drive was released in 2000 with just 8MB of storage.",
        "The first email was sent in 1971 and contained only 'QWERTYUIOP'.",
        "The World Wide Web was invented by Tim Berners-Lee in 1989.",
        "The first website went live in 1991 at CERN.",
        "Google was originally called 'Backrub' before being renamed.",
        "The first iPhone was announced in January 2007 by Steve Jobs.",
        "The term 'mouse' for pointing device was coined in 1964.",
        "Bluetooth is named after a 10th-century Danish king Harald Bluetooth.",
        "The Wi-Fi symbol was inspired by the Yggdrasil tree from Norse mythology.",
        "The first webcam was created to monitor a coffee pot at Cambridge University.",
        "Amazon started as an online bookstore in 1994.",
        "Netflix began mailing DVDs in 1998 before streaming existed.",
        "PayPal was originally called Confinity when founded in 1998.",
        "The first tweet was posted by Jack Dorsey on March 21, 2006.",
        "YouTube's first video 'Me at the zoo' was uploaded April 23, 2005.",
        "Facebook was launched from a dorm room at Harvard in February 2004.",
        "The first commercial cell phone call was made in 1983.",
        "The first mobile phone weighed 1.1 kg and had 30 minutes of talk time.",
        "The first laptop was the Epson HX-20 released in 1982.",
        "Linux kernel version 1.0 was released on March 14, 1994.",
        "Windows 1.0 was released on November 20, 1985.",
        "The first MP3 player was the MPMan F1 released in 1998.",
        "The iPod was introduced by Apple on October 23, 2001.",
        "The first digital camera was built in 1975 by Steven Sasson at Kodak.",
        "JPEG compression was standardized in 1992.",
        "The PNG image format was created in 1995 as an improved GIF replacement.",
        "The first social media site, SixDegrees, launched in 1997.",
        "LinkedIn was launched on May 5, 2003.",
        "Twitter's first prototype was developed in just two weeks in 2006.",
        "Instagram was launched in October 2010 and reached 25,000 users on day one.",
        "Snapchat was originally called 'Picaboo' when launched in 2011.",
        "TikTok merged with Musical.ly in August 2018.",
        "The first YouTube video received no views for the first two days.",
        "Cloud computing concept dates back to the 1960s.",
        "The first DNS server was deployed in 1983.",
        "IPv6 was developed in the mid-1990s to replace IPv4.",
        "The first blockchain transaction occurred on January 3, 2009.",
        "Bitcoin was created by Satoshi Nakamoto in 2009.",
        "The first Ethereum smart contract was deployed in 2015.",
        "Artificial intelligence research began in the 1950s.",
        "The Turing Test was proposed by Alan Turing in 1950.",
        "Deep Blue defeated Garry Kasparov in chess in 1997.",
        "The first chatbot ELIZA was created in 1966.",
        "The first voice assistant Siri was released in 2011.",
        "Alexa was launched by Amazon in November 2014.",
        "The first self-driving car test was conducted in 1995.",
        "Tesla Autopilot was introduced in October 2015.",
        "Virtual Reality dates back to the Sensorama in 1957.",
        "The first VR headset, Oculus Rift, launched in 2016.",
        "Augmented Reality concept began in 1990 with a Boeing researcher.",
        "The first ARKit was released by Apple in 2017.",
        "5G networks began commercial deployment in 2019.",
        "The first 3D printer was invented in 1984 by Chuck Hull.",
        "First commercial 3D printer was sold in 1992.",
        "Nvidia was founded in 1993 and revolutionized GPU computing.",
        "The first graphics card with hardware acceleration was S3 ViRGE in 1995.",
        "Intel released its first microprocessor, the 4004, in 1971.",
        "MOS Technology 6502 powered the Apple I in 1976.",
        "The Commodore 64 became the best-selling single computer model of all time.",
        "IBM PC XT was released in 1983 with a 10MB hard drive.",
        "The Pentium processor debuted in 1993.",
        "AMD Athlon was the first commercially available 7th-gen x86 processor in 1999.",
        "The first SSD was introduced by SanDisk in 1991.",
        "DDR RAM was first released in 2000.",
        "The first 1TB hard drive was released by Hitachi in 2007.",
        "Mechanical keyboards date back to the IBM Model M in 1985.",
        "The first gaming console, Magnavox Odyssey, was released in 1972.",
        "Atari released the first successful arcade game Pong in 1972.",
        "Game Boy was launched by Nintendo in 1989.",
        "PlayStation was Sony's first gaming console released in 1994.",
        "The Xbox launched in November 2001.",
        "Nintendo Switch was released on March 3, 2017.",
        "Steam platform launched by Valve in September 2003.",
        "Epic Games Store launched in December 2018.",
        "Discord was released in May 2015.",
        "Slack was publicly launched in August 2014.",
        "Zoom was founded in 2011 and gained popularity during COVID-19.",
        "Teams was launched by Microsoft in 2017.",
        "The first VoIP service Skype launched in 2003.",
        "VoLTE was introduced commercially in 2014.",
        "CD-ROM became standard in 1985.",
        "DVD was introduced in 1995.",
        "Blu-ray disc format was officially announced in 2000.",
        "The first Blu-ray player was released in 2003.",
        "HDMI 1.0 was released in December 2002.",
        "USB-C was released in 2014 with reversible connector design.",
        "Thunderbolt was first released by Intel in 2011.",
        "Wireless charging Qi standard was adopted in 2010.",
        "NFC technology originated from RFID in the 1980s.",
        "The first smartphone, IBM Simon, was announced in 1992.",
        "BlackBerry 850 was the first BlackBerry device released in 1999.",
        "Android was initially developed by Andy Rubin in 2003.",
        "The first Android phone, HTC Dream, launched in October 2008."
      ];
      const randomTechFact = techFacts[Math.floor(Math.random() * techFacts.length)];
      printLine(`💻 Tech Fact (${techFacts.length} total): "${randomTechFact}"`);
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