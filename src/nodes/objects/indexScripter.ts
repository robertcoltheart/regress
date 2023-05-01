import { type NodeObject } from "../nodeObject";
import { type ScriptableNode } from "../scriptableNode";
import { type Index } from "./index";

export class IndexScripter implements ScriptableNode<Index> {
    public async getNodes(parent: NodeObject): Promise<Index[]> {
        throw Error("");
    }
}
