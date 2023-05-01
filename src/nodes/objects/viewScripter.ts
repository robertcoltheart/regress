import { type NodeObject } from "../nodeObject";
import { type ScriptableNode } from "../scriptableNode";
import { type View } from "./view";

export class ViewScripter implements ScriptableNode<View> {
    public async getNodes(parent: NodeObject): Promise<View[]> {
        throw Error("");
    }
}
