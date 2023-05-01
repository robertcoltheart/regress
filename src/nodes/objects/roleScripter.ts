import { type NodeObject } from "../nodeObject";
import { type ScriptableNode } from "../scriptableNode";
import { type Role } from "./role";

export class RoleScripter implements ScriptableNode<Role> {
    public async getNodes(parent: NodeObject): Promise<Role[]> {
        throw Error("");
    }
}
