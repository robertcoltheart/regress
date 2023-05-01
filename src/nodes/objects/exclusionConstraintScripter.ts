import { type NodeObject } from "../nodeObject";
import { type ScriptableNode } from "../scriptableNode";
import { type ExclusionConstraint } from "./exclusionConstraint";

export class ExclusionConstraintScripter implements ScriptableNode<ExclusionConstraint> {
    public async getNodes(parent: NodeObject): Promise<ExclusionConstraint[]> {
        throw Error("");
    }
}
