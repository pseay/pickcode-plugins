let scenes = {
    start: {
        message: "Hello there, how are you doing?",
        choices: [
            {
                response: "I'm doing great, thank you.",
                nextScene: "sayingGoodbye",
            },
            {
                response: "Sorry. I didn't catch that. What'd you say?",
                nextScene: "start",
            },
        ],
    },
    sayingGoodbye: {
        message: "Well, it was great seeing you today!",
        choices: [
            {
                response: "Bye bye!",
                nextScene: "sayingGoodbye",
            },
        ],
    },
    end: {
        message: "Play again?",
        choices: [
            {
                response: "Yes.",
                nextScene: "end",
            },
        ],
    },
};

loadDialogue(scenes);
