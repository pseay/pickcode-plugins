import { Message } from "../../messages";

const createExports = (sendMessage: (message: Message) => void) => {
    return Promise.resolve({
        emptyStomach: () => sendMessage(Message.EmptyStomach),
        eatSlice: () => sendMessage(Message.EatSlice),
    });
};

export default createExports;
