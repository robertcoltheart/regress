import { Client } from "pg";
import { Query } from "./query";
import { NodeInfo } from "azdata";

export class DatabaseQuery extends Query {
    constructor(private isSystem: boolean) {
        super();
    }

    async execute(client: Client, path: string): Promise<NodeInfo[]> {
        const result = await client.query(`
SELECT
    db.oid AS "oid",
    db.datname AS "name",
    ta.spcname AS spcname,
    db.datallowconn,
    0 AS datlastsysoid,
    has_database_privilege(db.oid, 'CREATE') AS cancreate,
    datdba AS owner,
    db.datistemplate,
    has_database_privilege(db.datname, 'connect') AS canconnect,
    datistemplate AS is_system
FROM
    pg_database db
LEFT OUTER JOIN pg_tablespace ta ON db.dattablespace = ta.oid
WHERE datistemplate = ${this.isSystem}
ORDER BY datname;`);

        return result.rows
            .map<NodeInfo>(x => ({
                isLeaf: false,
                label: x.name,
                nodeType: "Database",
                nodePath: this.join(path, x.oid, true)
            }));
    }
}
