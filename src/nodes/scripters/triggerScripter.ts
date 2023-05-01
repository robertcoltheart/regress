import { type NodeObject } from "../nodeObject";
import { Trigger } from "../objects/trigger";
import { type ScriptableNode } from "../scriptableNode";

export class TriggerScripter implements ScriptableNode<Trigger> {
    public async getNodes(parent: NodeObject): Promise<Trigger[]> {
        throw Error("");
    }
}

