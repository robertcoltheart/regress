import { NodeObject } from "../nodeObject";
import { SequenceScripter } from "../scripters/sequenceScripter";

export class Sequence extends NodeObject {
    public static readonly scripter = new SequenceScripter();

    constructor(
        parent: NodeObject,
        public id: string,
        public name: string,
        public schema: string,
        public isSystem: boolean
    ) {
        super(parent);
    }
}
