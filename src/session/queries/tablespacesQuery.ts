import { Client } from "pg";
import { Query } from "./query";
import { NodeInfo } from "azdata";

export class TablespacesQuery extends Query {
    async execute(client: Client, path: string): Promise<NodeInfo[]> {
        const result = await client.query(`
SELECT
    ts.oid AS oid,
    spcname AS name
FROM pg_tablespace ts
ORDER BY name;`);

        return result.rows
            .map(x => ({
                oid: x.oid,
                name: x.name
            }))
            .map(x => ({
                isLeaf: true,
                label: x.name,
                nodeType: "Queue",
                nodePath: this.join(path, x.oid.toString())
            }));
    }
}
