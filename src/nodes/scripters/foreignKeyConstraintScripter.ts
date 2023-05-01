import { type NodeObject } from "../nodeObject";
import { ForeignKeyConstraint } from "../objects/foreignKeyConstraint";
import { type ScriptableNode } from "../scriptableNode";

export class ForeignKeyConstraintScripter implements ScriptableNode<ForeignKeyConstraint> {
    public async getNodes(parent: NodeObject): Promise<ForeignKeyConstraint[]> {
        throw Error("");
    }
}

