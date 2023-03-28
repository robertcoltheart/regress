import { Client } from "pg";
import { Query } from "./query";
import { NodeInfo } from "azdata";

export class RolesQuery extends Query {
    async execute(client: Client, path: string): Promise<NodeInfo[]> {
        const result = await client.query(`
SELECT
    r.oid,
    r.rolname as name,
    r.rolcanlogin
FROM pg_roles r
ORDER BY
    r.rolcanlogin,
    r.rolname;`);

        return result.rows
            .map(x => ({
                oid: x.oid,
                name: x.name,
                canLogin: x.rolcanlogin
            }))
            .map(x => ({
                isLeaf: true,
                label: x.name,
                nodeType: this.getNodeType(x.canLogin),
                nodePath: this.join(path, x.oid.toString())
            }));
    }

    private getNodeType(canLogin: boolean): string {
        return canLogin
            ? "ServerLevelLogin"
            : "ServerLevelLogin_Disabled"
    }
}
