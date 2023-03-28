import { Client } from "pg";
import { Query } from "./query";
import { NodeInfo } from "azdata";

export class RulesQuery extends Query {
    constructor(private tableId: string) {
        super();
    }

    async execute(client: Client, path: string): Promise<NodeInfo[]> {
        const result = await client.query(`
SELECT
    rw.oid AS oid,
    rw.rulename AS name
FROM pg_rewrite rw
WHERE rw.ev_class = ${this.tableId}
ORDER BY rw.rulename`);

        return result.rows
            .map(x => ({
                oid: x.oid,
                name: x.name
            }))
            .map(x => ({
                isLeaf: true,
                label: x.name,
                nodeType: "Constraint",
                nodePath: this.join(path, x.oid.toString())
            }));
    }
}
