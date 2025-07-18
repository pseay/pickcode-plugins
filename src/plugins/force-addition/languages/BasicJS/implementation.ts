import { ForceFunctionMessage } from "../../messages";
import { Force } from "../../state";

const createExports = (
    sendMessage: (message: ForceFunctionMessage) => void
) => {
    return Promise.resolve({
        run: (sumForces: (forces: Force[]) => Force) => {
            sendMessage({ sumForces });
        },
    });
};

export default createExports;
