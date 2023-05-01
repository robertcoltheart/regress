import { type NodeObject } from "../nodeObject";
import { DataType } from "../objects/dataType";
import { type ScriptableNode } from "../scriptableNode";

export class DataTypeScripter implements ScriptableNode<DataType> {
    public async getNodes(parent: NodeObject): Promise<DataType[]> {
        throw Error("");
    }
}

