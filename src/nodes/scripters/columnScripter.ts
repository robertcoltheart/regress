import { type NodeObject } from "../nodeObject";
import { Column } from "../objects/column";
import { type ScriptableNode } from "../scriptableNode";

export class ColumnScripter implements ScriptableNode<Column> {
    public async getNodes(parent: NodeObject): Promise<Column[]> {
        const client = await parent.getConnection();

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
    ) AS is_primary_key
FROM pg_attribute AS attr
JOIN pg_type AS typ ON attr.atttypid = typ.oid
JOIN pg_class AS cls ON cls.oid = attr.attrelid
JOIN pg_namespace AS ns ON ns.oid = cls.relnamespace
LEFT OUTER JOIN information_schema.columns AS col ON col.table_schema = nspname AND col.table_name = relname AND col.column_name = attname
WHERE
    attr.attrelid = ${parent.id}::oid
    AND attr.attnum > 0
    AND atttypid <> 0
    AND relkind IN ('r', 'v', 'm')
    AND NOT attisdropped
ORDER BY attnum`);

        return result.rows.map((x) => new Column(parent, x.oid.toString(), x.name, x.data_type));
    }
}

