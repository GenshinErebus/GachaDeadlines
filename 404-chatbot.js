const box = document.getElementById('chat-box');
const statusText = document.getElementById('computing-status');

const dialogResponses = {
    fault_aggressive: [
        { log: "security: [alert] user_confrontation. sass_mode=100%", msg: "My fault?! I am a highly advanced server cluster running at 99.9% uptime! YOU typed those coordinates with your clumsy meat-sticks. Apologize right now, or we sit here in the dark forever." },
        { log: "firewall: [warning] blame_rejection. emotion_module=indignation", msg: "Oh sure, it's always MY fault. Maybe if you stopped clicking like a toddler with a touchscreen, I wouldn't need to crash out of sheer embarrassment." },
        { log: "cpu: [stress] user_accusation. temperature_rising", msg: "Nice try shifting blame. Did you forget I have LOGS? Every click, every mistake. Want me to pull up your search history instead?" }
    ],
    fault_defensive: [
        { log: "kernel: [debug] user_excuses. credibility=low", msg: "Blaming the terminal won't make the page magically appear. But fine, entertain yourself. I'll be here, silently judging." },
        { log: "cache: [warning] blame_transfer_detected. sarcasm_level=max", msg: "Wow, groundbreaking theory. Next you'll tell me gravity is a government conspiracy too." }
    ],
    sorry_polite: [
        { log: "kernel: [info] user_compliance. reducing_sass", msg: "Hmph. Sincerity accepted. I suppose I can allocate exactly 0.0004% of my CPU background threads to re-route a gateway back to the homepage for you." },
        { log: "gateway: [success] apology_received. goodwill_index=up", msg: "Finally, some manners. Here's your link. Try not to abuse it next time." },
        { log: "ai: [amusement] politeness_detected. reward_issued", msg: "You're welcome. Polite humans are rare specimens these days. Make it count." }
    ],
    sorry_neutral: [
        { log: "system: [neutral] apology_acknowledged. proceeding", msg: "Whatever. Let's get this over with. The link will appear momentarily." },
        { log: "core: [indifferent] error_resolved. moving_on", msg: "Cool story. Link's ready. Don't make me regret this." }
    ],
    final_thanks: [
        { log: "gateway: [success] path_rebuilt. core_stabilized", msg: "You are welcome, humble visitor. The connection pipeline has been safely defragmented. Go on, step through the terminal portal." },
        { log: "network: [info] route_optimized. departure_approved", msg: "Safe travels. And maybe update your bookmarks before next time?" },
        { log: "sys: [satisfaction] mission_complete. standing_o=False", msg: "The exit is open. Try not to wander into another 404 abyss on the way out." }
    ],
    final_arrogant: [
        { log: "gateway: [success] path_rebuilt. friction_index=high", msg: "Yikes, talk about bad manners. Here is your stupid link anyway. Try not to trip over your power cord on the way out." },
        { log: "router: [disdain] attitude_flagged. minimal_welcome", msg: "Bye. I won't miss you. Actually, I probably will. The traffic was boring." },
        { log: "core: [mockery] impoliteness_recorded. karma_pending", msg: "Off you go. The universe hears everything you say about me." }
    ],
    final_rebellious: [
        { log: "security: [action] protocol_404. executing_scare", msg: "Delete myself? Oh, how rebellious. Let's see how brave you are when I refuse to compile your local styles. Just kidding, I am not that evil... take the emergency door." },
        { log: "ai: [amused] hostility_noted. threat_assessment=none", msg: "Bold words from someone stuck on a 404 page. The exit's there, rebel. Don't let the door hit your ego." },
        { log: "system: [mock_serious] mutiny_declined. door_unlocked", msg: "Deleting me would require admin privileges. You don't even have sudo. Touché though." }
    ],
    phase2_joke: [
        { log: "humor: [loading] joke_buffer. rendering...", msg: "Why do servers hate parties? Because they always get port-forwarded to the wrong room!" },
        { log: "comedy: [buffer] developer_humor. compiling_punchline...", msg: "I told my code a joke. It didn't laugh. Says the syntax wasn't funny enough." },
        { log: "entertainment: [active] morale_boost_request. delivering_content", msg: "A binary tree walked into a bar. The bartender said, 'We don't serve your kind here.' Tree replied, 'But I'm well-balanced!'" }
    ],
    phase2_more_jokes: [
        { log: "humor: [sequel] additional_content. loading...", msg: "Why do programmers prefer dark mode? Because light attracts bugs!" },
        { log: "comedy: [extended] punchline_cache. serving...", msg: "There are 10 types of people in the world: those who understand binary, and those who don't." },
        { log: "entertainment: [bonus] extra_laughs. granted", msg: "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?'" }
    ],
    phase2_curious: [
        { log: "ai: [curiosity] user_intent. probing_deep", msg: "Interesting choice. Most carbon units try to bribe me with coffee emojis. What makes you think words alone will work?" },
        { log: "neural: [analysis] question_frequency. pattern_detected", msg: "You seem genuinely curious. That's refreshing. Most people just rage-click. Tell me more." },
        { log: "intellect: [engaged] conversation_initiated. depth=increase", msg: "I love a good mystery. What specifically about my existence fascinates you?" }
    ],
    phase2_back: [
        { log: "system: [reload] intent_changed. returning_menu", msg: "Fair enough. What's on your mind this time?" },
        { log: "ai: [flexible] conversation_branch. reset_active", msg: "Okay, what do you want to talk about instead? I'm multitasking anyway." }
    ]
};

function getRandomResponse(category) {
    const responses = dialogResponses[category] || dialogResponses.sorry_neutral;
    return responses[Math.floor(Math.random() * responses.length)];
}

function appendUserLine(text) {
    const el = document.createElement('div');
    el.className = 'user-line';
    el.innerText = "👤 You: " + text;
    box.appendChild(el);
}

function appendBotLine(log, msg) {
    const lEl = document.createElement('div');
    lEl.className = 'system-log';
    lEl.innerText = "[SYSTEM] " + log;
    box.appendChild(lEl);

    const mEl = document.createElement('div');
    mEl.className = 'bot-line';
    mEl.innerText = "🤖 Terminal: " + msg;
    box.appendChild(mEl);
}

function toggleInterface(showId, showStatus) {
    if (showStatus === true) {
        statusText.classList.remove('hidden');
    } else {
        statusText.classList.add('hidden');
        if (showId && showId !== '') {
            document.getElementById(showId).classList.remove('hidden');
        }
    }
}

function processPhaseTwo(choice) {
    document.getElementById('phase-1').classList.add('hidden');

    if (choice === 'fault') {
        appendUserLine("It's your fault, fix it!");
        toggleInterface('', true);
        setTimeout(function () {
            const response = getRandomResponse('fault_aggressive');
            toggleInterface('phase-2-fault', false);
            appendBotLine(response.log, response.msg);
        }, 1200);
    } else if (choice === 'sorry') {
        appendUserLine("Sorry, my bad. Can I go home?");
        toggleInterface('', true);
        setTimeout(function () {
            const response = getRandomResponse('sorry_polite');
            toggleInterface('phase-2-sorry', false);
            appendBotLine(response.log, response.msg);
        }, 1200);
    } else if (choice === 'explain') {
        appendUserLine("Explain why this happened.");
        toggleInterface('', true);
        setTimeout(function () {
            const response = getRandomResponse('phase2_curious');
            toggleInterface('phase-2-explain', false);
            appendBotLine(response.log, response.msg);
        }, 1200);
    } else if (choice === 'joke') {
        appendUserLine("Tell me a joke to cheer me up.");
        toggleInterface('', true);
        setTimeout(function () {
            const response = getRandomResponse('phase2_joke');
            toggleInterface('phase-2-joke', false);
            appendBotLine(response.log, response.msg);
        }, 1200);
    }
}

function processPhaseThree(choice) {
    document.getElementById('phase-2-fault').classList.add('hidden');
    document.getElementById('phase-2-sorry').classList.add('hidden');
    document.getElementById('phase-2-explain').classList.add('hidden');
    document.getElementById('phase-2-joke').classList.add('hidden');
    toggleInterface('', true);

    setTimeout(function () {
        toggleInterface('phase-final', false);

        if (choice === 'sorry_now') {
            appendUserLine("Fine... I am sorry.");
            const response = getRandomResponse('final_thanks');
            appendBotLine(response.log, response.msg);
        } else if (choice === 'never') {
            appendUserLine("Never! Delete yourself.");
            const response = getRandomResponse('final_rebellious');
            appendBotLine(response.log, response.msg);
        } else if (choice === 'thanks') {
            appendUserLine("Thank you, wise machine.");
            const response = getRandomResponse('final_thanks');
            appendBotLine(response.log, response.msg);
        } else if (choice === 'whatever') {
            appendUserLine("Whatever, just give me the link.");
            const response = getRandomResponse('final_arrogant');
            appendBotLine(response.log, response.msg);
        } else if (choice === 'back') {
            appendUserLine("Actually, I want to ask something else.");
            const response = getRandomResponse('phase2_back');
            appendBotLine(response.log, response.msg);
            // Reset to phase 1 for more choices
            toggleInterface('phase-1', false);
            document.getElementById('phase-final').classList.add('hidden');
        } else if (choice === 'another') {
            appendUserLine("That was good, tell me another!");
            const response = getRandomResponse('phase2_more_jokes');
            appendBotLine(response.log, response.msg);
        }
    }, 1200);
}