import { type NodeObject } from "../nodeObject";
import { Collation } from "../objects/collation";
import { type ScriptableNode } from "../scriptableNode";

export class CollationScripter implements ScriptableNode<Collation> {
    public async getNodes(parent: NodeObject): Promise<Collation[]> {
        const client = await parent.getConnection();

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

        return result.rows.map((x) => new Collation(parent, x.oid.toString(), x.name, x.schema, x.is_system));
    }
}
