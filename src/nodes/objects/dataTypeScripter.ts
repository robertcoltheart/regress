import { type NodeObject } from "../nodeObject";
import { type ScriptableNode } from "../scriptableNode";
import { type DataType } from "./dataType";

export class DataTypeScripter implements ScriptableNode<DataType> {
    public async getNodes(parent: NodeObject): Promise<DataType[]> {
        throw Error("");
    }
}
