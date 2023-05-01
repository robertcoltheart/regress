import { type NodeObject } from "../nodeObject";
import { type ScriptableNode } from "../scriptableNode";
import { type ForeignKeyConstraint } from "./foreignKeyConstraint";

export class ForeignKeyConstraintScripter implements ScriptableNode<ForeignKeyConstraint> {
    public async getNodes(parent: NodeObject): Promise<ForeignKeyConstraint[]> {
        throw Error("");
    }
}
