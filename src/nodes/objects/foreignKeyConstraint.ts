import { NodeObject } from "../nodeObject";
import { ForeignKeyConstraintScripter } from "./foreignKeyConstraintScripter";

export class ForeignKeyConstraint extends NodeObject {
    public static readonly scripter = new ForeignKeyConstraintScripter();

    constructor(parent: NodeObject, public id: string, public name: string) {
        super(parent);
    }
}
