import { type NodeObject } from "../nodeObject";
import { Rule } from "../objects/rule";
import { type ScriptableNode } from "../scriptableNode";

export class RuleScripter implements ScriptableNode<Rule> {
    public async getNodes(parent: NodeObject): Promise<Rule[]> {
        throw Error("");
    }
}

