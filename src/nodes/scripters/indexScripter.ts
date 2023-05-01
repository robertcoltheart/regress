import { type NodeObject } from "../nodeObject";
import { Index } from "../objects";
import { type ScriptableNode } from "../scriptableNode";

export class IndexScripter implements ScriptableNode<Index> {
    public async getNodes(parent: NodeObject): Promise<Index[]> {
        throw Error("");
    }
}

