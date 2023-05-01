import { NodeObject } from "../nodeObject";
import { TriggerFunctionScripter } from "../scripters/triggerFunctionScripter";

export class TriggerFunction extends NodeObject {
    public static readonly scripter = new TriggerFunctionScripter();

    constructor(parent: NodeObject, public id: string, public name: string) {
        super(parent);
    }
}
