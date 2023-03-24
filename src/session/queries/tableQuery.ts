import { Client } from "pg";
import { Query } from "./query";
import { NodeInfo } from "azdata";

interface Table {
    oid: number;
    schema: string;
    schemaOid: number;
    name: string;
    isSystem: boolean;
};


export class TableQuery extends Query {
    async execute(client: Client, path: string): Promise<NodeInfo[]> {
        const isSystem = this.isSytem(path);

        const result = await client.query(`
SELECT
    rel.oid,
    nsp.nspname AS schema,
    nsp.oid AS schema_oid,
    rel.relname AS name,
    CASE WHEN nsp.nspname like 'pg_%' or nsp.nspname = 'information_schema' THEN true ELSE false END as is_system
FROM pg_class rel
INNER JOIN pg_namespace nsp ON rel.relnamespace = nsp.oid
WHERE rel.relkind IN ('r','t','f')
ORDER BY nsp.nspname, rel.relname;`);

        return result.rows
            .map<Table>(x => ({
                oid: x.oid,
                schema: x.schema,
                schemaOid: x.schema_oid,
                name: x.name,
                isSystem: x.is_system
            }))
            .filter(x => x.isSystem == isSystem)
            .map(x => ({
                isLeaf: false,
                label: `${x.schema}.${x.name}`,
                nodeType: "Table",
                nodePath: `${path}/${x.oid}`
            }))

    }
}
