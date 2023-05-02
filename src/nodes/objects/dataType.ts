import { NodeObject } from "../nodeObject";
import { DataTypeScripter } from "../scripters/dataTypeScripter";

export class DataType extends NodeObject {
    public static readonly scripter = new DataTypeScripter();

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
