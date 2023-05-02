import { NodeObject } from "../nodeObject";
import { ForeignKeyConstraintScripter } from "../scripters/foreignKeyConstraintScripter";

export class ForeignKeyConstraint extends NodeObject {
    public static readonly scripter = new ForeignKeyConstraintScripter();

    constructor(parent: NodeObject, public id: string, public name: string) {
        super(parent);
    }
}
