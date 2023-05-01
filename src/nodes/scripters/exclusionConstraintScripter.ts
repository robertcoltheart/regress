import { type NodeObject } from "../nodeObject";
import { ExclusionConstraint } from "../objects/exclusionConstraint";
import { type ScriptableNode } from "../scriptableNode";

export class ExclusionConstraintScripter implements ScriptableNode<ExclusionConstraint> {
    public async getNodes(parent: NodeObject): Promise<ExclusionConstraint[]> {
        throw Error("");
    }
}

