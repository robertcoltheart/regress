import { NodeObject } from "../nodeObject";
import { IndexConstraintScripter } from "./indexConstraintScripter";

export class IndexConstraint extends NodeObject {
    public static readonly scripter = new IndexConstraintScripter();

    constructor(parent: NodeObject, public id: string, public name: string) {
        super(parent);
    }
}
