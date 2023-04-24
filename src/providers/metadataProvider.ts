import * as azdata from "azdata";
import * as vscode from "vscode";
import { AppContext } from "../appContext";

export class MetadataProvider implements azdata.MetadataProvider {
    handle?: number | undefined;
    providerId = "regress";

    constructor(private context: AppContext) {}

    async getMetadata(connectionUri: string): Promise<azdata.ProviderMetadata> {
        const client = this.context.getclient(connectionUri);

        if (!client) {
            return {
                objectMetadata: []
            }
        }

        const result = await client.query(`
SELECT
    s.nspname AS schema_name,
    p.proname || '(' || COALESCE(pg_catalog.pg_get_function_identity_arguments(p.oid), '') || ')' AS object_name,
    'f' as type
FROM pg_proc p
INNER JOIN pg_namespace s ON s.oid = p.pronamespace
WHERE s.nspname NOT ILIKE 'pg_%' AND s.nspname != 'information_schema'
UNION
SELECT
    schemaname AS schema_name,
    tablename AS object_name,
    't' as type
FROM pg_tables
WHERE schemaname NOT ILIKE 'pg_%' AND schemaname != 'information_schema'
UNION
SELECT
    schemaname AS schema_name,
    viewname AS object_name,
    'v' as type
FROM pg_views
WHERE schemaname NOT ILIKE 'pg_%' AND schemaname != 'information_schema'`);

        const metadata = result.rows
            .map(x => ({
                schemaName: x.schema_name,
                objectName: x.object_name,
                type: x.type
            }))
            .map(x => ({
                metadataType: this.getMetadataType(x.type),
                metadataTypeName: this.getMetadataName(x.type),
                urn: '',
                name: x.objectName,
                schema: x.schemaName
            }));

        return {
            objectMetadata: metadata
        };
    }

    async getDatabases(connectionUri: string): Promise<string[] | azdata.DatabaseInfo[]> {
        const databases = await this.context.listDatabases(connectionUri);

        return databases
            .filter((db) => !db.isSystem)
            .map((db) => db.name);
    }

    getTableInfo(connectionUri: string, metadata: azdata.ObjectMetadata): Thenable<azdata.ColumnMetadata[]> {
        throw new Error("Method not implemented.");
    }

    getViewInfo(connectionUri: string, metadata: azdata.ObjectMetadata): Thenable<azdata.ColumnMetadata[]> {
        throw new Error("Method not implemented.");
    }

    private getMetadataType(type: string): azdata.MetadataType {
        if (type == 'f') {
            return azdata.MetadataType.Function;
        }

        if (type == 't') {
            return azdata.MetadataType.Table;
        }

        if (type == 's') {
            return azdata.MetadataType.SProc;
        }

        return azdata.MetadataType.View;
    }

    private getMetadataName(type: string): string {
        return this.getMetadataType(type).toString();
    }
}
