import { NodeObject } from "../nodeObject";
import { MaterializedViewScripter } from "../scripters/materializedViewScripter";

export class MaterializedView extends NodeObject {
    public static readonly scripter = new MaterializedViewScripter();

    constructor(parent: NodeObject, public id: string, public name: string) {
        super(parent);
    }
}
