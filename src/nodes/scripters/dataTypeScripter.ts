import { type NodeObject } from "../nodeObject";
import { DataType } from "../objects/dataType";
import { type ScriptableNode } from "../scriptableNode";

export class DataTypeScripter implements ScriptableNode<DataType> {
    public async getNodes(parent: NodeObject): Promise<DataType[]> {
        const client = await parent.getConnection();

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

        return result.rows.map((x) => new DataType(parent, x.oid.toString(), x.name, x.schema, x.is_system));
    }
}
