import { Message } from "../../messages";

const createExports = (sendMessage: (message: Message) => void) => {
    return Promise.resolve({
        count: () => sendMessage(1),
        // emptyStomach: () => sendMessage(Message.EmptyStomach),
        // eatSlice: () => sendMessage(Message.EatSlice),
    });
};

export default createExports;
