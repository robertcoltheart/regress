import { type NodeObject } from "../nodeObject";
import { Trigger } from "../objects/trigger";
import { type ScriptableNode } from "../scriptableNode";

export class TriggerScripter implements ScriptableNode<Trigger> {
    public async getNodes(parent: NodeObject): Promise<Trigger[]> {
        const client = await parent.getConnection();

        const result = await client.query(`
SELECT
    t.oid,
    t.tgname as name
FROM pg_trigger t
WHERE NOT tgisinternal
AND tgrelid = ${parent.id}::OID
ORDER BY tgname;`);

        return result.rows.map((x) => new Trigger(parent, x.oid.toString(), x.name));
    }
}
