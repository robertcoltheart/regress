import { NodeObject } from "../nodeObject";
import { TriggerScripter } from "../scripters/triggerScripter";

export class Trigger extends NodeObject {
    public static readonly scripter = new TriggerScripter();

    constructor(parent: NodeObject, public id: string, public name: string) {
        super(parent);
    }
}
