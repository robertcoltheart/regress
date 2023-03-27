import { Client } from "pg";
import { Query } from "./query";
import { NodeInfo } from "azdata";

export class ConstraintsQuery extends Query {
    async execute(client: Client, path: string): Promise<NodeInfo[]> {
        const isSystem = this.isSytem(path);

        const result = await client.query(`
SELECT
    c.oid,
    c.collname AS name,
    nsp.nspname AS schema,
    CASE
        WHEN nsp.nspname like 'pg_%' or nsp.nspname = 'information_schema'
            THEN true
        ELSE false END as is_system
FROM pg_collation c
INNER JOIN pg_namespace nsp ON c.collnamespace = nsp.oid
ORDER BY c.collname;`);

        return result.rows
            .map(x => ({
                oid: x.oid,
                name: x.name,
                schema: x.schema,
                isSystem: x.is_system
            }))
            .filter(x => x.isSystem == isSystem)
            .map(x => ({
                isLeaf: true,
                label: `${x.schema}.${x.name}`,
                nodeType: "Collations",
                nodePath: this.join(path, x.oid.toString())
            }));
    }
}
