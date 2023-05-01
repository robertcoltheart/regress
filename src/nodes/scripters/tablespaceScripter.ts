import { type NodeObject } from "../nodeObject";
import { Tablespace } from "../objects/tablespace";
import { type ScriptableNode } from "../scriptableNode";

export class TablespaceScripter implements ScriptableNode<Tablespace> {
    public async getNodes(parent: NodeObject): Promise<Tablespace[]> {
        throw Error("");
    }
}

