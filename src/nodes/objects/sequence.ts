import { NodeObject } from "../nodeObject";
import { SequenceScripter } from "../scripters/sequenceScripter";

export class Sequence extends NodeObject {
    public static readonly scripter = new SequenceScripter();

    constructor(parent: NodeObject, public id: string, public name: string) {
        super(parent);
    }
}

