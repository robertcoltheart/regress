import { type NodeObject } from "../nodeObject";
import { type ScriptableNode } from "../scriptableNode";
import { type Extension } from "./extension";

export class ExtensionScripter implements ScriptableNode<Extension> {
    public async getNodes(parent: NodeObject): Promise<Extension[]> {
        throw Error("");
    }
}
