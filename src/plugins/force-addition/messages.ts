import { Force } from "./state";

export type ForceFunctionMessage = {
    sumForces: (forces: Force[]) => Force;
};
