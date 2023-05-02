import { type NodeObject } from "../nodeObject";
import { Role } from "../objects/role";
import { type ScriptableNode } from "../scriptableNode";

export class RoleScripter implements ScriptableNode<Role> {
    public async getNodes(parent: NodeObject): Promise<Role[]> {
        const client = await parent.getConnection();

        const result = await client.query(`
SELECT
    r.oid,
    r.rolname as name,
    r.rolcanlogin
FROM pg_roles r
ORDER BY
    r.rolcanlogin,
    r.rolname;`);

        return result.rows.map((x) => new Role(parent, x.oid.toString(), x.name, x.rolcanlogin));
    }
}
