import { NodeObject } from "../nodeObject";
import { RuleScripter } from "../scripters/ruleScripter";

export class Rule extends NodeObject {
    public static readonly scripter = new RuleScripter();

    constructor(parent: NodeObject, public id: string, public name: string) {
        super(parent);
    }
}
