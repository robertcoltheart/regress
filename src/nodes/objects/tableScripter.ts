import { type NodeObject } from "../nodeObject";
import { type ScriptableNode } from "../scriptableNode";
import { type Table } from "./table";

export class TableScripter implements ScriptableNode<Table> {
    getNodes(node: NodeObject): IterableIterator<Table> {
        throw new Error("Not implemented");
    }
}
