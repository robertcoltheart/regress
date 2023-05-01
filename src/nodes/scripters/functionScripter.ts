import { type NodeObject } from "../nodeObject";
import { type ScriptableNode } from "../scriptableNode";
import { type Function } from "../objects/function";

export class FunctionScripter implements ScriptableNode<Function> {
    public async getNodes(parent: NodeObject): Promise<Function[]> {
        throw Error("");
    }
}

