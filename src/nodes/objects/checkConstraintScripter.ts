import { type NodeObject } from "../nodeObject";
import { type ScriptableNode } from "../scriptableNode";
import { type CheckConstraint } from "./checkConstraint";

export class CheckConstraintScripter implements ScriptableNode<CheckConstraint> {
    public async getNodes(parent: NodeObject): Promise<CheckConstraint[]> {
        throw Error("");
    }
}
