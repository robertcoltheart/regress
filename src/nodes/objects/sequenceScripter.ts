import { type NodeObject } from "../nodeObject";
import { type ScriptableNode } from "../scriptableNode";
import { type Sequence } from "./sequence";

export class SequenceScripter implements ScriptableNode<Sequence> {
    public async getNodes(parent: NodeObject): Promise<Sequence[]> {
        throw Error("");
    }
}
