import { Client } from "pg";
import { Query } from "./query";
import { NodeInfo } from "azdata";

export class ViewQuery extends Query {
    async execute(client: Client, path: string): Promise<NodeInfo[]> {
        const isSystem = this.isSytem(path);
        const kind = path.includes("/materializedviews/")
            ? "m"
            : "v";

        const result = await client.query(`
SELECT
    rel.oid,
    rel.relname AS name,
    nsp.nspname AS schema,
    nsp.oid AS schema_oid,
    CASE
        WHEN nsp.nspname like 'pg_%' or nsp.nspname = 'information_schema'
            THEN true
        ELSE false END as is_system
FROM pg_class rel
INNER JOIN pg_namespace nsp ON rel.relnamespace = nsp.oid
WHERE
    rel.relkind = '${kind}'
ORDER BY
    nsp.nspname,
    rel.relname`);

        return result.rows
            .map(x => ({
                oid: x.oid,
                name: x.name,
                schema: x.schema,
                schemaOid: x.schema_oid,
                isSystem: x.is_system
            }))
            .filter(x => x.isSystem == isSystem)
            .map(x => ({
                isLeaf: false,
                label: `${x.schema}.${x.name}`,
                nodeType: "View",
                nodePath: this.join(path, x.oid.toString(), true)
            }));
    }
}
