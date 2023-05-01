import { type NodeObject } from "../nodeObject";
import { type ScriptableNode } from "../scriptableNode";
import { type Tablespace } from "./tablespace";

export class TablespaceScripter implements ScriptableNode<Tablespace> {
    public async getNodes(parent: NodeObject): Promise<Tablespace[]> {
        throw Error("");
    }
}
