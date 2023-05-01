import { NodeObject } from "../nodeObject";
import { ExclusionConstraintScripter } from "../scripters/exclusionConstraintScripter";

export class ExclusionConstraint extends NodeObject {
    public static readonly scripter = new ExclusionConstraintScripter();

    constructor(parent: NodeObject, public id: string, public name: string) {
        super(parent);
    }
}

