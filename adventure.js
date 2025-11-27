// Get out of here and solve it the right way, coward. 
// (inspecting the code isn't really in-bounds for the puzzle, but what can I do?)

const term = document.getElementById('terminal');
const terminal_input = document.getElementById('terminal-input');

const destination = 13;
const hazards = [4, 9, 12];
const edges = {
    0: [ 
        { f:[1,0] }, 
        { b:[1,0] }
    ],
    1: [
        { f:[2,0], r:[10,2], b:[0,1] },
        { f:[0,1], l:[10,2], b:[2,0] },
        { l:[0,1], r:[2,0], b:[10,2] }
    ],
    2: [
        { f:[6,1], l:[3,0], r:[5,0], b:[1,1] },
        { f:[1,1], l:[5,0], r:[3,0], b:[6,1] },
        { f:[5,0], l:[6,1], r:[1,1], b:[3,0] },
        { f:[3,0], l:[1,1], r:[6,1], b:[5,0] }
    ],
    3: [
        { f:[4,0], r:[6,0], b:[2,2] },
        { f:[2,2], l:[6,0], b:[4,0] },
        { l:[2,2], r:[4,0], b:[6,0] }
    ],
    4: [
        { b:[3,1] },
        { f:[3,1] }
    ],
    5: [
        { l:[10,1], b:[2,3] },
        { r:[2,3], b:[10,1] }
    ],
    6: [
        { f:[10,0], l:[7,0], r:[2,1], b:[3,2] },
        { f:[7,0], l:[3,2], r:[10,0], b:[2,1] },
        { f:[2,1], l:[10,0], r:[3,2], b:[7,0] },
        { f:[3,2], l:[2,1], r:[7,0], b:[10,0] }
    ],
    7: [
        { f:[9,0], r:[8,0], b:[6,2] },
        { f:[6,2], l:[8,0], b:[9,0] }
    ],
    8: [
        { b:[7,2] },
        { f:[7,2] }
    ],
    9: [
        { r:[11,0], b:[7,1] },
        { l:[7,1], b:[11,0] }
    ],
    10: [
        { f:[1,2], l:[11,1], r:[5,1], b:[6,3] },
        { f:[11,1], l:[6,3], r:[1,2], b:[5,1] },
        { f:[6,3], l:[5,1], r:[11,1], b:[1,2] },
        { f:[5,1], l:[1,2], r:[6,3], b:[11,1] }
    ],
    11: [
        { f:[12,0], l:[13,0], r:[10,3], b:[9,1] },
        { f:[13,0], l:[9,1], r:[12,0], b:[10,3] },
        { f:[9,1], l:[10,3], r:[13,0], b:[12,0] },
        { f:[10,3], l:[12,0], r:[9,1], b:[13,0] }
    ],
    12: [
        { b:[11,2] },
        { f:[11,2] }
    ],
    13: [
        { b:[11,3] },
        { f:[11,3] }
    ]
};

const directionNames = { f:"forward", b:"backward", l:"left", r:"right" };

let pos = 0;
let orientation = 0;
let prev_failed = false;
let finalSequence = 0;

function print(text) {
    term.innerHTML += text + "\n";
    term.scrollTop = term.scrollHeight;
}

function getOptions() {
    return edges[pos][orientation];
}

function optionsToMessage(options) {
    const items = Object.entries(options); 

    if (items.length === 1) {
        const k = items[0][0];
        if (k === "b") {
            return "Before you is a dead end. You may go backwards. What would you like to do?";
        }
        return "Before you lies a path " + directionNames[k] + ". What would you like to do?";
    }

    if (items.length === 2) {
        return "Before you lie paths " +
            directionNames[items[0][0]] +
            " and " +
            directionNames[items[1][0]] +
            ". What would you like to do?";
    }

    const human = items.map(i => directionNames[i[0]]);
    const last = human.pop();
    return "Before you lie paths " + human.join(", ") + ", and " + last + ". What would you like to do?";
}

function parseCommand(cmd) {
    cmd = cmd.trim().toLowerCase();

    if (cmd === "help") return "help";

    if (["go forward","forward","f"].includes(cmd)) return "f";
    if (["go backward","backward","b"].includes(cmd)) return "b";
    if (["go left","left","l"].includes(cmd)) return "l";
    if (["go right","right","r"].includes(cmd)) return "r";

    return cmd;
}

// Lockout helper
const LOCKOUT_KEY = "pwLockoutDate";

function todayString() {
    const d = new Date();
    return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function isLockedOut() {
    const saved = localStorage.getItem(LOCKOUT_KEY);

    if (!saved) {
        return false;
    }

    return saved === todayString();
}

function applyDailyLockout() {
    localStorage.setItem(LOCKOUT_KEY, todayString());
}

const titleElement = document.getElementById('adventureTitle');

function setTitle(title) {
    console.log("SETTING TITLE TO ", title);
    titleElement.innerHTML = title;
}

if (isLockedOut()) {
    setTitle("You Are Dead");
}

function killPlayer() {
    print("You have died! Chart a path before trying again. The forest is closed to you until tomorrow.");
    applyDailyLockout();
    setTitle("You Are Dead");
}

function completePuzzle() {
    print("Before you is a cabin. Would you like to enter?");
    finalSequence = 1;
}

function isYes(input) {
    cmd = input.toLowerCase();
    return cmd == "yes" || cmd == "y";
}

function isNo(input) {
    cmd = input.toLowerCase();
    return cmd == "no" || cmd == "n";
}

function processFinalSequence(inputCmd) {
    if (finalSequence == 1) {
        if (isYes(inputCmd)) {
            print("The door creaks open and you see a desk, covered in cobwebs. On the desk is a tattered and yellowed page. Do you read it?")
            finalSequence = 2;
        } else if (isNo(inputCmd)) {
            print("You are swallowed by the forest.");
            killPlayer();
        } else {
            print("Yes or no?");
        }
    } else if (finalSequence == 2) {
        if (isYes(inputCmd)) {
            print("\"Sorry we missed you! Send us an e-mail letting us know you missed us and we'll be sure to get back at our earliest convenience. And don't forget to come back in January!");
            print(" - FG\"");
            print("Would you like to leave?");
            finalSequence = 3;
        } else if (isNo(inputCmd)) {
            print("There is nothing else interesting in the room. You feel an ethereal presence guiding you towards the desk. Do you read the note?");
        } else {
            print("Yes or no?");
        }
    } else if (finalSequence == 3) {
        if (isYes(inputCmd)) {
            print("The door is locked. There is no other way out; you are trapped.");
            setTitle("You Are Trapped");
            finalSequence = 5;
        } else if (isNo(inputCmd)) {
            print("You stay in the cabin.");
            setTitle("You Are Trapped");
            finalSequence = 5;
        } else {
            print("Yes or no?");
        }
    } else if (finalSequence == 5) {
        return;
    }
}

function processTurn(inputCmd) {
    const options = getOptions();
    let msg = optionsToMessage(options);

    if (prev_failed) {
        msg = "That is not a valid option. " + msg;
    }

    const cmd = parseCommand(inputCmd).toLowerCase();

    if (cmd == "cry") {
        print("You cry. The forest does not respond.");
        return;
    } else if (cmd == "die") {
        killPlayer();
        return;
    } else if (cmd == "look") {
        print("Around you is a dark forest. What do you do?");
    }

    if (!(cmd in options)) {
        prev_failed = true;
        print("That is not a valid option.");
        return;
    }

    // Valid move
    prev_failed = false;
    [pos, orientation] = options[cmd];

    if (hazards.includes(pos)) {
        killPlayer();
    } else if (pos == destination) {
        completePuzzle();
    } else {
        print(optionsToMessage(getOptions()));
    }
}

terminal_input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const cmd = terminal_input.value;

        terminal_input.value = "";

        if (finalSequence == 5) {
            return;
        }

        if (isLockedOut()) {
            return;
        } else {
            print("> " + cmd);

            if (finalSequence > 0) {
                processFinalSequence(cmd);
            } else {
                processTurn(cmd);
            }
        }
    }
});

if (isLockedOut()) {
    print("You are dead. Come back tomorrow to try again.");
    terminal_input.value = "";
} else {
    print("You are in a dark forest. Before you lies a path. What do you do?");
    terminal_input.value = "";
    print(optionsToMessage(getOptions()));
}

