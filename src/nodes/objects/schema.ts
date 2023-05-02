import { NodeObject } from "../nodeObject";
import { SchemaScripter } from "../scripters/schemaScripter";

export class Schema extends NodeObject {
    public static readonly scripter = new SchemaScripter();

    constructor(parent: NodeObject, public id: string, public name: string) {
        super(parent);
    }
}
