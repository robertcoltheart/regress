import { type NodeObject } from "../nodeObject";
import { type ScriptableNode } from "../scriptableNode";
import { type Database } from "./database";

export class DatabaseScripter implements ScriptableNode<Database> {
    public getNodes(node: NodeObject): IterableIterator<Database> {
        throw new Error("Not implemented");
    }
}
