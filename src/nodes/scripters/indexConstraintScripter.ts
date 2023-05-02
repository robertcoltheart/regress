import { type NodeObject } from "../nodeObject";
import { IndexConstraint } from "../objects/indexConstraint";
import { type ScriptableNode } from "../scriptableNode";

export class IndexConstraintScripter implements ScriptableNode<IndexConstraint> {
    public async getNodes(parent: NodeObject): Promise<IndexConstraint[]> {
        const client = await parent.getConnection();

        const result = await client.query(`
SELECT
    cls.oid,
    cls.relname as name
FROM pg_index idx
JOIN pg_class cls ON cls.oid = indexrelid
LEFT JOIN pg_depend dep ON (
    dep.classid = cls.tableoid
    AND dep.objid = cls.oid
    AND dep.refobjsubid = '0'
    AND dep.refclassid = (SELECT oid FROM pg_class WHERE relname='pg_constraint')
    AND dep.deptype='i')
LEFT OUTER JOIN pg_constraint con ON (
        con.tableoid = dep.refclassid
        AND con.oid = dep.refobjid)
WHERE indrelid = ${parent.id}::oid
AND contype='';`);

        return result.rows.map((x) => new IndexConstraint(parent, x.oid.toString(), x.name));
    }
}
