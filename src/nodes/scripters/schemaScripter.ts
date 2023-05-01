import { type NodeObject } from "../nodeObject";
import { Schema } from "../objects/schema";
import { type ScriptableNode } from "../scriptableNode";

export class SchemaScripter implements ScriptableNode<Schema> {
    public async getNodes(parent: NodeObject): Promise<Schema[]> {
        throw Error("");
    }
}

