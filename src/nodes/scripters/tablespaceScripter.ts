import { type NodeObject } from "../nodeObject";
import { Tablespace } from "../objects/tablespace";
import { type ScriptableNode } from "../scriptableNode";

export class TablespaceScripter implements ScriptableNode<Tablespace> {
    public async getNodes(parent: NodeObject): Promise<Tablespace[]> {
        const client = await parent.getConnection();

        const result = await client.query(`
SELECT
    ts.oid AS oid,
    spcname AS name
FROM pg_tablespace ts
ORDER BY name;`);

        return result.rows.map((x) => new Tablespace(parent, x.oid.toString(), x.name));
    }
}
