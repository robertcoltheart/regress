import { type NodeObject } from "../nodeObject";
import { Index } from "../objects";
import { type ScriptableNode } from "../scriptableNode";

export class IndexScripter implements ScriptableNode<Index> {
    public async getNodes(parent: NodeObject): Promise<Index[]> {
        const client = await parent.getConnection();

        const result = await client.query(`
SELECT DISTINCT ON(cls.relname)
    cls.oid,
    cls.relname as name,
    indisclustered,
    indisunique,
    indisprimary
FROM pg_index idx
JOIN pg_class cls ON cls.oid = indexrelid
JOIN pg_class tab ON tab.oid = indrelid
LEFT OUTER JOIN pg_tablespace ta on ta.oid = cls.reltablespace
JOIN pg_namespace n ON n.oid = tab.relnamespace
JOIN pg_am am ON am.oid = cls.relam
LEFT JOIN pg_depend dep ON (dep.classid = cls.tableoid AND dep.objid = cls.oid AND dep.refobjsubid = '0' AND dep.refclassid = (SELECT oid FROM pg_class WHERE relname = 'pg_constraint') AND dep.deptype = 'i')
LEFT OUTER JOIN pg_constraint con ON (con.tableoid = dep.refclassid AND con.oid = dep.refobjid)
WHERE indrelid = ${parent.id}::OID
AND conname is NULL
ORDER BY cls.relname`);

        return result.rows.map((x) => new Index(parent, x.oid.toString(), x.name));
    }
}
