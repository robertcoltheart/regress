import { NodeObject } from "../nodeObject";
import { ColumnScripter } from "../scripters/columnScripter";

export class Column extends NodeObject {
    public static readonly scripter = new ColumnScripter();

    constructor(parent: NodeObject, public id: string, public name: string, public dataType: string) {
        super(parent);
    }
}

