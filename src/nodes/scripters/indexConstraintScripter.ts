import { type NodeObject } from "../nodeObject";
import { IndexConstraint } from "../objects/indexConstraint";
import { type ScriptableNode } from "../scriptableNode";

export class IndexConstraintScripter implements ScriptableNode<IndexConstraint> {
    public async getNodes(parent: NodeObject): Promise<IndexConstraint[]> {
        throw Error("");
    }
}

