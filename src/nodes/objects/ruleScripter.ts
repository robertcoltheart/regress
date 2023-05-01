import { type NodeObject } from "../nodeObject";
import { type ScriptableNode } from "../scriptableNode";
import { type Rule } from "./rule";

export class RuleScripter implements ScriptableNode<Rule> {
    public async getNodes(parent: NodeObject): Promise<Rule[]> {
        throw Error("");
    }
}
