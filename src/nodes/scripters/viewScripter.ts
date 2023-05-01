import { type NodeObject } from "../nodeObject";
import { View } from "../objects/view";
import { type ScriptableNode } from "../scriptableNode";

export class ViewScripter implements ScriptableNode<View> {
    public async getNodes(parent: NodeObject): Promise<View[]> {
        throw Error("");
    }
}

