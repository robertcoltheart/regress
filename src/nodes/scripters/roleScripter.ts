import { type NodeObject } from "../nodeObject";
import { Role } from "../objects/role";
import { type ScriptableNode } from "../scriptableNode";

export class RoleScripter implements ScriptableNode<Role> {
    public async getNodes(parent: NodeObject): Promise<Role[]> {
        throw Error("");
    }
}

