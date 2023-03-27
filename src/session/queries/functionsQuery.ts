import { Client } from "pg";
import { Query } from "./query";
import { NodeInfo } from "azdata";

export class FunctionsQuery extends Query {
    async execute(client: Client, path: string): Promise<NodeInfo[]> {
        const isSystem = this.isSytem(path);

        const result = await client.query(`
SELECT
    pr.oid,
    pr.proname || '(' || COALESCE(pg_catalog.pg_get_function_identity_arguments(pr.oid), '') || ')' as name,
    nsp.nspname AS schema,
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

        return result.rows
            .map(x => ({
                oid: x.oid,
                name: x.name,
                schema: x.schema,
                isSystem: x.is_system
            }))
            .filter(x => x.isSystem == isSystem)
            .map(x => ({
                isLeaf: true,
                label: `${x.schema}.${x.name}`,
                nodeType: "ScalarValuedFunction",
                nodePath: this.join(path, x.oid.toString())
            }));
    }
}
