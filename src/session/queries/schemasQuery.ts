import { Client } from "pg";
import { Query } from "./query";
import { NodeInfo } from "azdata";

export class SchemasQuery extends Query {
    async execute(client: Client, path: string): Promise<NodeInfo[]> {
        const isSystem = this.isSytem(path);

        const result = await client.query(`
SELECT
    nsp.oid,
    nsp.nspname as name,
    CASE
        WHEN nsp.nspname like 'pg_%' or nsp.nspname = 'information_schema'
            THEN true
        ELSE false END as is_system
FROM pg_namespace nsp
ORDER BY nspname;`);

        return result.rows
            .map(x => ({
                oid: x.oid,
                name: x.name,
                isSystem: x.is_system
            }))
            .filter(x => x.isSystem == isSystem)
            .map(x => ({
                isLeaf: true,
                label: x.name,
                nodeType: "Schema",
                nodePath: this.join(path, x.oid.toString())
            }));
    }
}
