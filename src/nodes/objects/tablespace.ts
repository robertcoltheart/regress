import { NodeObject } from "../nodeObject";
import { TablespaceScripter } from "../scripters/tablespaceScripter";

export class Tablespace extends NodeObject {
    public static readonly scripter = new TablespaceScripter();

    constructor(parent: NodeObject, public id: string, public name: string) {
        super(parent);
    }
}
