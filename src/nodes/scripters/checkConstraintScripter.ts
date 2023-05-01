import { type NodeObject } from "../nodeObject";
import { CheckConstraint } from "../objects/checkConstraint";
import { type ScriptableNode } from "../scriptableNode";

export class CheckConstraintScripter implements ScriptableNode<CheckConstraint> {
    public async getNodes(parent: NodeObject): Promise<CheckConstraint[]> {
        throw Error("");
    }
}

