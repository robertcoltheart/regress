import { Client } from "pg";
import { Query } from "./query";
import { NodeInfo } from "azdata";

export class ColumnQuery extends Query {
    constructor(private tableId: string){
        super();
    }

    async execute(client: Client, path: string): Promise<NodeInfo[]> {
        const result = await client.query(`
SELECT
    attnum as oid,
    attname as name,
    typ.typname AS data_type,
    EXISTS (
        SELECT * FROM pg_index
        WHERE pg_index.indrelid = cls.oid AND
            pg_index.indisprimary AND
            attnum = ANY (indkey)
    ) AS is_primary_key,
FROM pg_attribute AS attr
JOIN pg_type AS typ ON attr.atttypid = typ.oid
JOIN pg_class AS cls ON cls.oid = attr.attrelid
JOIN pg_namespace AS ns ON ns.oid = cls.relnamespace
LEFT OUTER JOIN information_schema.columns AS col ON col.table_schema = nspname AND col.table_name = relname AND col.column_name = attname
WHERE
    attr.attrelid = ${this.tableId}::oid
    AND attr.attnum > 0
    AND atttypid <> 0
    AND relkind IN ('r', 'v', 'm')
    AND NOT attisdropped
ORDER BY attnum`);

        return result.rows
            .map(x => ({
                oid: x.oid,
                name: x.name,
                dataType: x.data_type,
                isPrimaryKey: x.is_primary_key
            }))
            .map(x => ({
                isLeaf: true,
                label: `${x.name} (${x.dataType})`,
                nodeType: "Column",
                nodePath: this.join(path, x.oid.toString())
            }));
    }
}
