import { type NodeObject } from "../nodeObject";
import { type ScriptableNode } from "../scriptableNode";
import { type Schema } from "./schema";

export class SchemaScripter implements ScriptableNode<Schema> {
    public async getNodes(parent: NodeObject): Promise<Schema[]> {
        throw Error("");
    }
}
