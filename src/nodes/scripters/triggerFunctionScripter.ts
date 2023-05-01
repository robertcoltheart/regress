import { type NodeObject } from "../nodeObject";
import { TriggerFunction } from "../objects/triggerFunction";
import { type ScriptableNode } from "../scriptableNode";

export class TriggerFunctionScripter implements ScriptableNode<TriggerFunction> {
    public async getNodes(parent: NodeObject): Promise<TriggerFunction[]> {
        throw Error("");
    }
}
