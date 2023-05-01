import { type NodeObject } from "../nodeObject";
import { type ScriptableNode } from "../scriptableNode";
import { Table } from "./table";

export class TableScripter implements ScriptableNode<Table> {
    public async getNodes(parent: NodeObject): Promise<Table[]> {
        const client = await parent.getConnection();

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

        return result.rows.map(
            (x) => new Table(parent, x.oid.toString(), x.name, x.schema, x.schema_oid.toString(), x.is_system)
        );
    }
}
