import { type NodeObject } from "../nodeObject";
import { type ScriptableNode } from "../scriptableNode";
import { Database } from "./database";

export class DatabaseScripter implements ScriptableNode<Database> {
    public async getNodes(parent: NodeObject): Promise<Database[]> {
        const client = await parent.getConnection();

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
ORDER BY datname;`);

        return result.rows.map<Database>((x) => new Database(parent, x.oid.toString(), x.name, x.is_system));
    }
}
