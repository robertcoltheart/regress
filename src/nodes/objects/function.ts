import { NodeObject } from "../nodeObject";
import { FunctionScripter } from "../scripters/functionScripter";

export class Function extends NodeObject {
    public static readonly scripter = new FunctionScripter();

    constructor(
        parent: NodeObject,
        public id: string,
        public name: string,
        public schema: string,
        public schemaId: string,
        public isSystem: boolean
    ) {
        super(parent);
    }
}
