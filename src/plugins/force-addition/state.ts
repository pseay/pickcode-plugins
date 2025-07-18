import { action, computed, observable, makeObservable } from "mobx";
import { DrawForceMessage } from "./messages";

export interface Force {
    x: number;
    y: number;
}

export class State {
    @observable
    accessor drawnForces: Force[] = [];

    constructor() {
        makeObservable(this);
    }

    @action
    public onMessage = (message: DrawForceMessage) => {
        this.drawnForces.push(...message.forcesToDraw);
        return true;
    };
}

export default State;