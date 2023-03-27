import { Client } from "pg";
import { Query } from "./query";
import { NodeInfo } from "azdata";

export class DataTypesQuery extends Query {
    async execute(client: Client, path: string): Promise<NodeInfo[]> {
        const isSystem = this.isSytem(path);

        const result = await client.query(`
SELECT
    t.oid,
    t.typname AS name,
    nsp.nspname as schema,
    CASE
        WHEN nsp.nspname like 'pg_%' or nsp.nspname = 'information_schema'
            THEN true
        ELSE false END as is_system
FROM pg_type t
LEFT OUTER JOIN pg_type e ON e.oid = t.typelem
LEFT OUTER JOIN pg_class ct ON ct.oid = t.typrelid AND ct.relkind <> 'c'
LEFT OUTER JOIN pg_namespace nsp ON nsp.oid = t.typnamespace
WHERE t.typtype != 'd' AND t.typname NOT LIKE E'\\_%'
AND ct.oid is NULL
ORDER BY t.typname;`);

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
                nodeType: "Datatypes",
                nodePath: this.join(path, x.oid.toString())
            }));
    }
}
