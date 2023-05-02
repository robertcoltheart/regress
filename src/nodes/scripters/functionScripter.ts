import { type NodeObject } from "../nodeObject";
import { type ScriptableNode } from "../scriptableNode";
import { Function } from "../objects/function";

export class FunctionScripter implements ScriptableNode<Function> {
    public async getNodes(parent: NodeObject): Promise<Function[]> {
        const client = await parent.getConnection();

        const result = await client.query(`
SELECT
    pr.oid,
    pr.proname || '(' || COALESCE(pg_catalog.pg_get_function_identity_arguments(pr.oid), '') || ')' as name,
    nsp.nspname AS schema,
    nsp.oid AS schemaoid,
    CASE
        WHEN nsp.nspname like 'pg_%' or nsp.nspname = 'information_schema'
            THEN true
        ELSE false END as is_system
FROM
    pg_proc pr
JOIN
    pg_namespace nsp ON pr.pronamespace = nsp.oid
JOIN
    pg_type typ ON typ.oid = prorettype
JOIN
    pg_language lng ON lng.oid=prolang
LEFT OUTER JOIN pg_description des ON (des.objoid = pr.oid AND des.classoid = 'pg_proc'::regclass)
WHERE
    pr.prokind IN ('f', 'w')
    AND typname NOT IN ('trigger', 'event_trigger')
ORDER BY
    proname;`);

        return result.rows.map(
            (x) => new Function(parent, x.oid.toString(), x.name, x.schema, x.schemaoid.toString(), x.is_system)
        );
    }
}
