import { type NodeObject } from "../nodeObject";
import { Sequence } from "../objects/sequence";
import { type ScriptableNode } from "../scriptableNode";

export class SequenceScripter implements ScriptableNode<Sequence> {
    public async getNodes(parent: NodeObject): Promise<Sequence[]> {
        const client = await parent.getConnection();

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

        return result.rows.map((x) => new Sequence(parent, x.oid.toString(), x.name, x.schema, x.is_system));
    }
}
