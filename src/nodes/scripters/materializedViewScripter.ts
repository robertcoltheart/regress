import { type NodeObject } from "../nodeObject";
import { MaterializedView } from "../objects/materializedView";
import { type ScriptableNode } from "../scriptableNode";

export class MaterializedViewScripter implements ScriptableNode<MaterializedView> {
    public async getNodes(parent: NodeObject): Promise<MaterializedView[]> {
        const client = await parent.getConnection();

        const result = await client.query(`
SELECT
    rel.oid,
    rel.relname AS name,
    nsp.nspname AS schema,
    nsp.oid AS schemaoid,
    CASE
        WHEN nsp.nspname like 'pg_%' or nsp.nspname = 'information_schema'
            THEN true
        ELSE false END as is_system
FROM pg_class rel
INNER JOIN pg_namespace nsp ON rel.relnamespace = nsp.oid
WHERE rel.relkind = 'm'
ORDER BY nsp.nspname, rel.relname`);

        return result.rows.map((x) => new MaterializedView(parent, x.oid.toString(), x.name));
    }
}
