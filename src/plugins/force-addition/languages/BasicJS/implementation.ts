import { DrawForceMessage } from "../../messages";
import { Force } from "../../state";

const createExports = (
    sendMessage: (message: DrawForceMessage) => void
) => {
    return Promise.resolve({
        drawForce: (force: Force) => {
            sendMessage({ forcesToDraw: [force] });
        },
    });
};
        },
    });
};

export default createExports;
