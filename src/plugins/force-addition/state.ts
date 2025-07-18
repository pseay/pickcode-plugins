import { action, computed, observable, makeObservable } from "mobx";
import { ForceFunctionMessage } from "./messages";

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

    @observable.ref
    accessor sumForces: (forces: Force[]) => Force = () => ({ x: 0, y: 0 });

    @observable
    accessor userForce: Force = { x: 0, y: 0 };

    constructor() {
        makeObservable(this);
        this._updateUserForce(); // Initial calculation
    }

    @action
    private _updateUserForce() {
        try {
            this.userForce = this.sumForces(this.forces);
        } catch (e) {
            console.error("Error executing user-provided sumForces function:", e);
            this.userForce = { x: 0, y: 0 }; // Default to origin on error
        }
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
        this._updateUserForce(); // Recalculate when forces change
    }

    @action
    removeForce(index: number) {
        this.forces.splice(index, 1);
        this._updateUserForce(); // Recalculate when forces change
    }

    @action
    public onMessage = (message: ForceFunctionMessage) => {
        this.sumForces = message.sumForces;
        this._updateUserForce(); // Recalculate when the function changes
        return true;
    };
}

export default State;