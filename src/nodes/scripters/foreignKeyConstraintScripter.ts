import { type NodeObject } from "../nodeObject";
import { ForeignKeyConstraint } from "../objects/foreignKeyConstraint";
import { type ScriptableNode } from "../scriptableNode";

export class ForeignKeyConstraintScripter implements ScriptableNode<ForeignKeyConstraint> {
    public async getNodes(parent: NodeObject): Promise<ForeignKeyConstraint[]> {
        const client = await parent.getConnection();

        const result = await client.query(`
SELECT
    ct.oid,
    conname as name,
FROM pg_constraint ct
WHERE contype = 'f'
AND conrelid = ${parent.id}::oid
ORDER BY conname;`);

        return result.rows.map((x) => new ForeignKeyConstraint(parent, x.oid.toString(), x.name));
    }
}
