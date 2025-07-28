scenes = {
    start: {
        message: "Hello traveler, what brings you here?",
        choices: [
            {
                response: "I'm looking for the magic sword",
                nextScene: "sword_info",
            },
            {
                response: "Just passing through",
                nextScene: "farewell",
            },
        ],
    },
    sword_info: {
        message: "Ah, the legendary blade! It's in the dragon's lair.",
        choices: [
            {
                response: "Tell me more",
                nextScene: "dragon_details",
            },
            {
                response: "Thanks, goodbye",
                nextScene: "farewell",
            },
        ],
    },
    farewell: {
        message: "Safe travels, adventurer!",
        choices: [],
    },
};

loadDialogue(scenes);
