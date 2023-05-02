import { NodeObject } from "../nodeObject";
import { ExtensionScripter } from "../scripters/extensionScripter";

export class Extension extends NodeObject {
    public static readonly scripter = new ExtensionScripter();

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
