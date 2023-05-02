import { type NodeObject } from "../nodeObject";
import { Schema } from "../objects/schema";
import { type ScriptableNode } from "../scriptableNode";

export class SchemaScripter implements ScriptableNode<Schema> {
    public async getNodes(parent: NodeObject): Promise<Schema[]> {
        const client = await parent.getConnection();

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

        return result.rows.map((x) => new Schema(parent, x.oid.toString(), x.name));
    }
}
