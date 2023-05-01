import { NodeObject } from "../nodeObject";
import { FunctionScripter } from "../scripters/functionScripter";

export class Function extends NodeObject {
    public static readonly scripter = new FunctionScripter();

    constructor(parent: NodeObject, public id: string, public name: string) {
        super(parent);
    }
}

