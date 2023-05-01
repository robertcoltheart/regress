import { type NodeObject } from "../nodeObject";
import { Sequence } from "../objects/sequence";
import { type ScriptableNode } from "../scriptableNode";

export class SequenceScripter implements ScriptableNode<Sequence> {
    public async getNodes(parent: NodeObject): Promise<Sequence[]> {
        throw Error("");
    }
}

