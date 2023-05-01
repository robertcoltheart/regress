import { type NodeObject } from "../nodeObject";
import { type ScriptableNode } from "../scriptableNode";
import { type IndexConstraint } from "./indexConstraint";

export class IndexConstraintScripter implements ScriptableNode<IndexConstraint> {
    public async getNodes(parent: NodeObject): Promise<IndexConstraint[]> {
        throw Error("");
    }
}
