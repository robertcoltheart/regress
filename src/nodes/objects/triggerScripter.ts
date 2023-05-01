import { type NodeObject } from "../nodeObject";
import { type ScriptableNode } from "../scriptableNode";
import { type Trigger } from "./trigger";

export class TriggerScripter implements ScriptableNode<Trigger> {
    public async getNodes(parent: NodeObject): Promise<Trigger[]> {
        throw Error("");
    }
}
