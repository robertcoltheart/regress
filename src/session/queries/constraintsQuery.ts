import { Client, QueryResult } from "pg";
import { Query } from "./query";
import { NodeInfo } from "azdata";

export class ConstraintsQuery extends Query {
    constructor(private tableId: string){
        super();
    }

    async execute(client: Client, path: string): Promise<NodeInfo[]> {
        const checkConstraints = await client.query(`
SELECT
    c.oid,
    conname as name
FROM pg_constraint c
WHERE contype = 'c';`);

        const exclusionConstraints = await client.query(`
SELECT
    conindid as oid,
    conname as name,
FROM pg_constraint ct
WHERE contype = 'x'
AND conrelid = ${this.tableId}::oid
ORDER BY conname;`);

        const foreignKeyConstraints = await client.query(`
SELECT
    ct.oid,
    conname as name,
FROM pg_constraint ct
WHERE contype = 'f'
AND conrelid = ${this.tableId}::oid
ORDER BY conname;`);

        const indexConstraints = await client.query(`
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
WHERE indrelid = ${this.tableId}::oid
AND contype='';`);

        return this.getResults(checkConstraints, path, "Constraint")
            .concat(this.getResults(exclusionConstraints, path, "Constraint"))
            .concat(this.getResults(foreignKeyConstraints, path, "Key_ForeignKey"))
            .concat(this.getResults(indexConstraints, path, "Constraint"));
    }

    private getResults(results: QueryResult<any>, path: string, type: string): NodeInfo[] {
        return results.rows.map(x => ({
            oid: x.oid,
            name: x.name
        }))
        .map(x => ({
            isLeaf: true,
            label: x.name,
            nodeType: type,
            nodePath: this.join(path, x.oid.toString())
        }));
    }
}
