import { NodeObject } from "../nodeObject";
import { CheckConstraintScripter } from "../scripters/checkConstraintScripter";

export class CheckConstraint extends NodeObject {
    public static readonly scripter = new CheckConstraintScripter();

    constructor(parent: NodeObject, public id: string, public name: string) {
        super(parent);
    }
}
