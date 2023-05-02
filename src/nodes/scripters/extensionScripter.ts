import { type NodeObject } from "../nodeObject";
import { Extension } from "../objects/extension";
import { type ScriptableNode } from "../scriptableNode";

export class ExtensionScripter implements ScriptableNode<Extension> {
    public async getNodes(parent: NodeObject): Promise<Extension[]> {
        const client = await parent.getConnection();

        const result = await client.query(`
SELECT
    px.oid as oid,
    a.name,
    nsp.nspname as schema,
    nsp.oid AS schemaoid,
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

        return result.rows.map(
            (x) => new Extension(parent, x.oid.toString(), x.name, x.schema, x.schemaoid.toString(), x.is_system)
        );
    }
}
