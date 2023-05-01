import { type NodeObject } from "../nodeObject";
import { MaterializedView } from "../objects/materializedView";
import { type ScriptableNode } from "../scriptableNode";

export class MaterializedViewScripter implements ScriptableNode<MaterializedView> {
    public async getNodes(parent: NodeObject): Promise<MaterializedView[]> {
        throw Error("");
    }
}
