import { Client } from "pg";
import { Query } from "./query";
import { NodeInfo } from "azdata";

export class TriggersQuery extends Query {
    constructor(private tableId: string) {
        super();
    }

    async execute(client: Client, path: string): Promise<NodeInfo[]> {
        const result = await client.query(`
SELECT
    t.oid,
    t.tgname as name
FROM pg_trigger t
WHERE NOT tgisinternal
AND tgrelid = ${this.tableId}::OID
ORDER BY tgname;`);

        return result.rows
            .map(x => ({
                oid: x.oid,
                name: x.name
            }))
            .map(x => ({
                isLeaf: true,
                label: x.name,
                nodeType: "Datatypes",
                nodePath: this.join(path, x.oid.toString())
            }));
    }
}
