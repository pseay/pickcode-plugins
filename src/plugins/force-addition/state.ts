import { action, computed, observable, makeObservable } from "mobx";
import { DrawForceMessage } from "./messages";

export interface Force {
    x: number;
    y: number;
}

export class State {
    @observable
    accessor forces: Force[] = [
        { x: 5, y: 5 },
        { x: 15, y: -5 },
        { x: -10, y: 10 },
    ];

    @observable
    accessor drawnForces: Force[] = [];

    constructor() {
        makeObservable(this);
    }

    @computed
    get netForce(): Force {
        return this.forces.reduce(
            (acc, force) => ({ x: acc.x + force.x, y: acc.y + force.y }),
            { x: 0, y: 0 }
        );
    }

    @action
    addForce(force: Force) {
        this.forces.push(force);
    }

    @action
    removeForce(index: number) {
        this.forces.splice(index, 1);
    }

    @action
    public onMessage = (message: DrawForceMessage) => {
        this.drawnForces.push(...message.forcesToDraw);
        return true;
    };
}

export default State;