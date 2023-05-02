import { type NodeObject } from "../nodeObject";
import { Rule } from "../objects/rule";
import { type ScriptableNode } from "../scriptableNode";

export class RuleScripter implements ScriptableNode<Rule> {
    public async getNodes(parent: NodeObject): Promise<Rule[]> {
        const client = await parent.getConnection();

        const result = await client.query(`
SELECT
    rw.oid AS oid,
    rw.rulename AS name
FROM pg_rewrite rw
WHERE rw.ev_class = ${parent.id}
ORDER BY rw.rulename`);

        return result.rows.map((x) => new Rule(parent, x.oid.toString(), x.name));
    }
}
