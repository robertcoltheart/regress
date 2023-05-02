import { NodeObject } from "../nodeObject";
import { CollationScripter } from "../scripters/collationScripter";

export class Collation extends NodeObject {
    public static readonly scripter = new CollationScripter();

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
