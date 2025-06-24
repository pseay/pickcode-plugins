import { action, observable } from "mobx";
import { Message } from "./messages";

export class State {
    @observable
    accessor slices: number = 0;
    accessor utils: number = 0;

    public init = () => {};

    @action
    public onMessage = (emptyOrEat: Message) => {
        switch (emptyOrEat) {
            case Message.EmptyStomach:
                this.slices = 0;
                this.utils = 0;
                break;
            case Message.EatSlice:
                this.slices += 1;
                this.utils += 5 - this.slices;
                break;
        }
    };
}

export default State;
