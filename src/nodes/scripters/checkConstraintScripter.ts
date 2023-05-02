import { type NodeObject } from "../nodeObject";
import { CheckConstraint } from "../objects/checkConstraint";
import { type ScriptableNode } from "../scriptableNode";

export class CheckConstraintScripter implements ScriptableNode<CheckConstraint> {
    public async getNodes(parent: NodeObject): Promise<CheckConstraint[]> {
        const client = await parent.getConnection();

        const result = await client.query(`
SELECT
    c.oid,
    conname as name
FROM pg_constraint c
WHERE contype = 'c';`);

        return result.rows.map((x) => new CheckConstraint(parent, x.oid.toString(), x.name));
    }
}
