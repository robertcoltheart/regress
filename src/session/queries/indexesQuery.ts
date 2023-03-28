import { Client } from "pg";
import { Query } from "./query";
import { NodeInfo } from "azdata";

export class IndexesQuery extends Query {
    constructor(private tableId: string) {
        super();
    }

    async execute(client: Client, path: string): Promise<NodeInfo[]> {
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
WHERE indrelid = ${this.tableId}::OID
AND conname is NULL
ORDER BY cls.relname`);

        return result.rows
            .map(x => ({
                oid: x.oid,
                name: x.name,
                isClustered: x.indisclustered,
                isUnique: x.indisunique,
                isPrimary: x.indisprimary
            }))
            .map(x => ({
                isLeaf: true,
                label: `${x.name} ${this.getAttributes(x.isClustered, x.isUnique)}`,
                nodeType: this.getNodeType(x.isPrimary, x.isUnique),
                nodePath: this.join(path, x.oid.toString())
            }));
    }

    private getAttributes(isClustered: boolean, isUnique: boolean): string {
        const uniqueAttribute = isUnique
            ? "Unique, "
            : "";

        const clustered = isClustered
            ? "Clustered"
            : "Non-Clustered";

        return `(${uniqueAttribute}${clustered})`;
    }

    private getNodeType(isPrimary: boolean, isUnique: boolean): string {
        if (isPrimary) {
            return "Key_PrimaryKey";
        }

        if (isUnique) {
            return "Key_UniqueKey";
        }

        return "Index";
    }
}
