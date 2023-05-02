import { type NodeObject } from "../nodeObject";
import { ExclusionConstraint } from "../objects/exclusionConstraint";
import { type ScriptableNode } from "../scriptableNode";

export class ExclusionConstraintScripter implements ScriptableNode<ExclusionConstraint> {
    public async getNodes(parent: NodeObject): Promise<ExclusionConstraint[]> {
        const client = await parent.getConnection();

        const result = await client.query(`
SELECT
    conindid as oid,
    conname as name,
FROM pg_constraint ct
WHERE contype = 'x'
AND conrelid = ${parent.id}::oid
ORDER BY conname;`);

        return result.rows.map((x) => new ExclusionConstraint(parent, x.oid.toString(), x.name));
    }
}
