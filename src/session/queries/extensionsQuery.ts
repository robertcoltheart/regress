import { Client } from "pg";
import { Query } from "./query";
import { NodeInfo } from "azdata";

export class ExtensionsQuery extends Query {
    async execute(client: Client, path: string): Promise<NodeInfo[]> {
        const isSystem = this.isSytem(path);

        const result = await client.query(`
SELECT
    px.oid as oid,
    a.name,
    nsp.nspname as schema,
    CASE
        WHEN nsp.nspname like 'pg_%' or nsp.nspname = 'information_schema'
            THEN true
        ELSE false END as is_system
FROM pg_available_extensions a
LEFT JOIN pg_available_extension_versions av ON (a.name = av.name)
LEFT JOIN pg_extension px on px.extname = a.name
INNER JOIN pg_namespace nsp ON px.extnamespace = nsp.oid
GROUP BY
    a.name,
    a.installed_version,
    nsp.oid,
    px.oid,
    nsp.nspname,
    CASE
        WHEN nsp.nspname like 'pg_%' or nsp.nspname = 'information_schema'
            THEN true
        ELSE false END
ORDER BY
    nsp.nspname,
    a.name;`);

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
                nodeType: "Extension",
                nodePath: this.join(path, x.oid.toString())
            }));
    }
}
