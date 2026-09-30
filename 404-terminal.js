const inputField = document.getElementById('terminal-input');
const historyContainer = document.getElementById('history');
const terminalElement = document.getElementById('terminal');

// Keep input field focused even if user clicks elsewhere on the page
document.addEventListener('click', () => inputField.focus());

// Command history for arrow up/down navigation
let commandHistory = [];
let historyIndex = -1;

// Auto-scroll helper function - scrolls terminal to show latest output
function scrollToBottom() {
  terminalElement.scrollTop = terminalElement.scrollHeight;
}

// Scroll to bottom after initial page loads to show latest boot message
window.addEventListener('load', () => {
  scrollToBottom();
});

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

    // Reset input and scroll down to show newest output
    this.value = '';
    scrollToBottom();
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
      scrollToBottom();
      break;
    case 'joke':
      const topJokes = [
        "On what grounds did the police arrest the devil? They got him on possession.",
        "How many telemarketers does it take to change a lightbulb? Only one, but he has to do it while you are eating dinner.",
        "What did one fish in a tank say to the other fish in the tank? “Do you know how to drive this thing?”",
        "What do rich people say when they tickle babies? “Gucci, Gucci, goo.”",
        "How many therapists does it take to change a lightbulb? Only one, but the lightbulb has to want to change.",
        "Why don’t anteaters ever get sick? Their anty-bodies keep them healthy.",
        "How many gorillas does it take to change a lightbulb? Just one … but it takes a whole lot of lightbulbs.",
        "Who was the roundest knight in King Arthur’s court? Sir Cumference.",
        "Why do cemeteries have fences around them? Because everyone’s dying to get in.",
        "How many optometrists does it take to change a lightbulb? Is it one or two? One … or two?",
        "What do you give a man who has everything? Penicillin.",
        "Why did the man bring his watch to the bank? He wanted to save time.",
        "Did you hear about the guy who got the left side of his body amputated? He’s all right now.",
        "Why should you knock on your refrigerator door before opening it? There may be salad dressing in there.",
        "Why are most people tired on April 1? They’ve just finished a 31-day March.",
        "Why did Mozart kill all of his chickens? When he asked who the best composer was, they all replied, “Bach, Bach, Bach.”",
        "Why did the employee go to work on stilts? He wanted a raise.",
        "What did one plate say to the other? “Lunch is on me!”",
        "Did you hear about the fire at the shoe factory? Unfortunately, many soles were lost.",
        "My mom died when we couldn’t remember her blood type. The last thing she said was, “Be positive.” But it’s hard without her.",
        "I wondered why the baseball kept getting bigger. Then it hit me.",
        "While digging in the garden, I found a chest full of gold coins. I wanted to tell my wife about it, but then I remembered why I was digging in our garden.",
        "Today at the bank, an old lady asked me to help check her balance. So I pushed her over.",
        "I childproofed my house. Somehow they still got in!",
        "A man walks into an enchanted forest and tries to cut down a talking tree. “You can’t cut me down,” the tree exclaims. “I’m a talking tree!” The man responds, “You may be a talking tree, but you will dialogue.”",
        "Today, I asked my phone, “Siri, why am I still single?” It activated the front-facing camera.",
        "Even people who are good for nothing have the capacity to bring a smile to your face. Like when you push them down the stairs.",
        "My grandma has the heart of a lion and a lifetime ban from the zoo.",
        "After the man who created the hokeypokey died, it took a while to get the body in the casket. They put his right foot in. They took his right foot out …",
        "When I told my date I worked with animals, she found it really sweet and asked more about my job. So I told her: “I’m a butcher.”",
        "Why is it that if you donate a kidney, people love you, but if you donate five kidneys, they call the police?",
        "Two cows were standing in a field. “Have you heard that mad cow disease is going around?” asked the first. “Yeah,” the other cow replied. “Makes me glad I’m a penguin.”",
        "“Your mother has been with us for 20 years,” said John. “Isn’t it time she got a place of her own?” Helen’s brow furrowed, and she replied, “I thought she was your mother.",
        "Yesterday, I couldn’t figure out whether someone was waving at me or the person behind me. In other news, I lost my lifeguarding job.",
        "“My son had to give up his career because of fallen arches,” said a man to his friend. “He’s an athlete?” the friend asked. The man shook his head and replied, “An architect.”",
        'A woman is walking along a beach when she sees a man splashing around feverishly in the ocean. "Help, shark! Help!" he cries. The woman laughs, because she knows the shark will never help that man.',
        "On what grounds did the police arrest the devil? They got him on possession.",
        "How many telemarketers does it take to change a lightbulb? Only one, but he has to do it while you are eating dinner.",
        'What did one fish in a tank say to the other fish in the tank? “Do you know how to drive this thing?”',
        "What do rich people say when they tickle babies? “Gucci, Gucci, goo.”",
        "How many therapists does it take to change a lightbulb? Only one, but the lightbulb has to want to change.",
        "Why don’t anteaters ever get sick? Their anty-bodies keep them healthy.",
        "How many gorillas does it take to change a lightbulb? Just one … but it takes a whole lot of lightbulbs.",
        "Who was the roundest knight in King Arthur’s court? Sir Cumference.",
        "Why do cemeteries have fences around them? Because everyone’s dying to get in.",
        "How many optometrists does it take to change a lightbulb? Is it one or two? One … or two?",
        "What do you give a man who has everything? Penicillin.",
        "Why did the man bring his watch to the bank? He wanted to save time.",
        "Did you hear about the guy who got the left side of his body amputated? He’s all right now.",
        "Why should you knock on your refrigerator door before opening it? There may be salad dressing in there.",
        "Why are most people tired on April 1? They’ve just finished a 31-day March.",
        "Why did Mozart kill all of his chickens? When he asked who the best composer was, they all replied, “Bach, Bach, Bach.”",
        "Why did the employee go to work on stilts? He wanted a raise.",
        "What did one plate say to the other? “Lunch is on me!”",
        "Did you hear about the fire at the shoe factory? Unfortunately, many soles were lost.",
        "My mom died when we couldn’t remember her blood type. The last thing she said was, “Be positive.” But it’s hard without her.",
        "I wondered why the baseball kept getting bigger. Then it hit me.",
        "While digging in the garden, I found a chest full of gold coins. I wanted to tell my wife about it, but then I remembered why I was digging in our garden.",
        "Today at the bank, an old lady asked me to help check her balance. So I pushed her over.",
        "I childproofed my house. Somehow they still got in!",
        "A man walks into an enchanted forest and tries to cut down a talking tree. “You can’t cut me down,” the tree exclaims. “I’m a talking tree!” The man responds, “You may be a talking tree, but you will dialogue.”",
        "Today, I asked my phone, “Siri, why am I still single?” It activated the front-facing camera.",
        "Even people who are good for nothing have the capacity to bring a smile to your face. Like when you push them down the stairs.",
        "My grandma has the heart of a lion and a lifetime ban from the zoo.",
        "After the man who created the hokeypokey died, it took a while to get the body in the casket. They put his right foot in. They took his right foot out …",
        "When I told my date I worked with animals, she found it really sweet and asked more about my job. So I told her: “I’m a butcher.”",
        "Why is it that if you donate a kidney, people love you, but if you donate five kidneys, they call the police?",
        "Two cows were standing in a field. “Have you heard that mad cow disease is going around?” asked the first. “Yeah,” the other cow replied. “Makes me glad I’m a penguin.”",
        "“Your mother has been with us for 20 years,” said John. “Isn’t it time she got a place of her own?” Helen’s brow furrowed, and she replied, “I thought she was your mother.",
        "Yesterday, I couldn’t figure out whether someone was waving at me or the person behind me. In other news, I lost my lifeguarding job.",
        "“My son had to give up his career because of fallen arches,” said a man to his friend. “He’s an athlete?” the friend asked. The man shook his head and replied, “An architect.”",
        'A woman is walking along a beach when she sees a man splashing around feverishly in the ocean. "Help, shark! Help!" he cries. The woman laughs, because she knows the shark will never help that man.',
        "Why don’t blind people skydive? - Because it scares the dog.",
        "What’s the difference between a snowman and a snowwoman? - Snowballs.",
        'I’ll never forget my granddad’s last words: “Stop shaking the ladder!”',
        "My therapist says time heals all wounds… so I stabbed my watch.",
        'My grandma’s last words before she kicked the bucket were, “Hey, how far do you think I can kick this bucket?”',
        "I started crying when my dad cut onions. - Onions was a good dog.",
        'The doctor gave me one year to live, so I shot him. The judge gave me 20 years.',
        "Why don’t hospitals have good Wi-Fi? - Because they don’t want patients to be cured too quickly.",
        "I told my doctor I broke my arm in two places. - He said, “Stop going to those places.”",
        "My parents raised me as an only child, which really annoyed my brother.",
        "My wife and I decided we don’t want children. We’ll tell them tomorrow.",
        "What’s the worst combination? Alzheimer’s and diarrhea. - You’re running, but you can’t remember where.",
        "My boss told me to have a good day… - so I went home.",
        "I quit my job at the helium factory. I won’t be spoken to in that tone.",
        "My girlfriend left me because I’m too insecure. - No wait, she’s back. She just went to the bathroom.",
        "I asked my wife what she wanted for Christmas. She said, “Nothing would make me happier than a diamond necklace.” - So I bought her nothing.",
        "I’m on a whiskey diet. - I’ve lost three days already."
      ];
      const randomJoke = topJokes[Math.floor(Math.random() * topJokes.length)];
      printLine(`😄 Top Joke (${topJokes.length} total): "${randomJoke}"`);
      break;
    case 'gg':
      const gamingJokes = [
        "💡 How many multiplayer gamers does it take to fix a lightbulb? – None, you can't pause a multiplayer game! 🎮",
        "Video games don't cause violence... - Lag does!",
        "Why did the gamer play so many video games after his breakup? - He needed to console himself.",
        "What do you call a pro gamer that tests politics simulator games? - A pro-tester!",
        "Why did the gamer refuse to join the Boy Scouts? - He hates camping!",
        "I broke up with my video game console, now it's my ex-box... - Nothing personal, it was just time for a switch.",
        "What did the gaming reporter say about the new Minecraft updates? - “They’re groundbreaking!”",
        "What is a gamers favourite fish? COD!",
        "How does a gamer girl introduce her boyfriend? “Meet my Player 2.”",
        "Why are garbage men the best gaming teammates? They’re used to carrying trash.",
        "Why doesn’t Mario like to use the internet? He’s afraid of the Browsers.",
        "My girlfriend told me our relationship was over because I was spending too much time playing games... I think it may have been my Destiny 2 breakup with her.",
        "Why are cats so good at video games? Because they have nine lives.",
        "What game do you play after eating Taco Bell? Fartnite!",
        "Video games ruined my life... Good thing I have 3 lives left.",
        "How do you know a party is for a gamer? There are loads of streamers!",
        "Why did the gamer bring a ladder to the bar? He heard the drinks were on the house.",
        "Me and my gamer girlfriend were in love but we couldn't be together... We weren't on the same level!",
        "What do gamers do when they see a bug? Report it.",
        "Gamers these days have no patience... When Jesus died, respawn wait times were three days.",
        "Video games are great, they let you try your craziest fantasies... For example, on The Sims, you can have a job and a house.",
        "What do Americans do after winning the World Cup? Turn off the PlayStation.",
        "Why did the neighbours come to the gamer's Minecraft party? It was a block party!",
        "Did you know Call of Duty is the most environmentally friendly video game franchise? It's made from 90% recycled material.",
        'I was playing video games last night while my son was sitting next to me watching. He said, "Dad, I wish real life was more like video games." So I locked him in his room and told him if he wants access to the rest of the house he will have to pay 99p for the DLC.',
        "Why don’t gamers ever get lost? Because they always follow the map.",
        "What did the gamer say when asked about exercise? “I press X to skip leg day.”",
        "People who play games always know what they want to do when they're older... They're used to playing the long game.",
        "I tried to go to a bar in Minecraft. The bartender wouldn't let me order a drink... He said they don't serve miners.",
        "Why aren't Call of Duty players allowed to play hide and seek? They always call in a UAV.",
        "How do gamers cheat on their partner? Left, Left, Triangle, Up, Circle, Circle, X, Square, X, Down, Down, Up.",
        "My wife says I'm obsessed with my games console... I personally think that's a load of PS.",
        "PlayStation has announced a new line of shoes for gamers... The first pair will be called Demon Soles.",
        "Yesterday I got an Xbox for my little brother... Best trade ever!",
        "Why do so many conservatives own game consoles? Because they hate PC culture.",
        "Why doesn't Mike Tyson play PlayStation? He's an ex-boxer.",
        "Why did the Xbox gamer cross the street? To render the buildings.",
        "Why couldn't the PC gamer stop crying? They refused to be consoled.",
        "I left my PC on all night and when I woke up, it was freezing... Turns out, I left the Windows open.",
        "I don't like sidescrolling games on PC... Most of the time it's just d-pressing.",
        "I tried teaching my mom how to build a gaming PC... But all it did was make my motherboard.",
        "My roommate completely smashed his keyboard when he died... - He definitely lost control!",
        "A wife walks in on her husband playing on his PlayStation. “The house is still filthy. I thought I asked you to sweep the house!” she exclaims. - “I did,” replied the husband. “I found no hostiles.”",
        "Why does no one own an Xbox in Pennsylvania? - Because it’s always Sony in Philadelphia!",
        "I met a very famous asian gamer today. - His name was Lo Ping.",
        'A gamer dies and goes to hell... After one week, the devil goes to God: - God?! What crazy person have you send me here? He destroyed all the cauldrons, killed all demons, running like crazy everywhere and yelling: "Where is the exit to LEVEL 2!!!"',
        "What does a gamer and a burn victim both say - I can’t wait to try out my new skin",
        "What is the only similarity between serial killers and gamer - **They collect skins**",
        "As a gamer I find it strange that Biden was declared the winner... - Trump had way more kills",
        "Why does doing illegal stuff in GTA feel so good? Because it’s the only time we’re ever wanted",
        "What do you call it when a gamer girl has her first period... - ...First blood",
        "A new hairdressers for angry gamers opened up in my town. - It's called 'Dye Dye Dye!'",
        "A Gamers perspective of Reality. - Great graphics, terrible gameplay.",
        "What did the gamer say when they were told they had to spend the next year inside their home, physically isolated from the rest of the world? - What's the catch?",
        "What does a gamer say when he get married? - GG.",
        "I play games to relax… - then I meet other players.",
        "Why did the gamer bring a flashlight to the tournament? - Because someone told him the competition was in the dark.",
        "Why did the gamer fail his driving test? - He kept looking for the waypoint and tried to fast travel.",
        "Life is just a battle royale with better graphics and worse loot."
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

// Helper function to append text blocks and auto-scroll to latest output
function printLine(text) {
  const line = document.createElement('div');
  line.className = 'output-line';
  line.innerText = text;
  historyContainer.appendChild(line);

  // Automatically scroll to show the newest output
  scrollToBottom();
}