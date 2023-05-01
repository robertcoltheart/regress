import { type NodeObject } from "../nodeObject";
import { Extension } from "../objects/extension";
import { type ScriptableNode } from "../scriptableNode";

export class ExtensionScripter implements ScriptableNode<Extension> {
    public async getNodes(parent: NodeObject): Promise<Extension[]> {
        throw Error("");
    }
}

