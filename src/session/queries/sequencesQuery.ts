import { Client } from "pg";
import { Query } from "./query";
import { NodeInfo } from "azdata";

export class SequencesQuery extends Query {
    async execute(client: Client, path: string): Promise<NodeInfo[]> {
        const isSystem = this.isSytem(path);

        const result = await client.query(`
SELECT
    rel.oid as oid,
    rel.relname as name,
    nsp.nspname as schema,
    CASE
        WHEN nsp.nspname like 'pg_%' or nsp.nspname = 'information_schema'
            THEN true
        ELSE false END as is_system
FROM pg_class rel
INNER JOIN pg_namespace nsp ON rel.relnamespace= nsp.oid
WHERE relkind = 'S'
ORDER BY relname;`);

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
                nodeType: "Sequence",
                nodePath: this.join(path, x.oid.toString())
            }));
    }
}
