import * as azdata from "azdata";
import { type ConnectionService } from "../connection/connectionService";
import { ConnectionType } from "../connection/connectionType";

export class MetadataProvider implements azdata.MetadataProvider {
    handle?: number | undefined;
    providerId = "regress";

    constructor(private readonly connections: ConnectionService) {}

    async getMetadata(connectionUri: string): Promise<azdata.ProviderMetadata> {
        throw new Error("Method not implemented.");
    }

    async getDatabases(connectionUri: string): Promise<string[] | azdata.DatabaseInfo[]> {
        const client = this.connections.getConnection(connectionUri, ConnectionType.Default);

        if (client == null) {
            throw Error("Connection not found for ");
        }

        const result = await client.query(`
SELECT
    db.datname AS "name",
    datistemplate AS is_system
FROM
    pg_database db
LEFT OUTER JOIN pg_tablespace ta ON db.dattablespace = ta.oid
ORDER BY datname;`);

        return result.rows.filter((x) => x.is_system === false).map<azdata.DatabaseInfo>((x) => x.name);
    }

    getTableInfo(connectionUri: string, metadata: azdata.ObjectMetadata): Thenable<azdata.ColumnMetadata[]> {
        throw new Error("Method not implemented.");
    }

    getViewInfo(connectionUri: string, metadata: azdata.ObjectMetadata): Thenable<azdata.ColumnMetadata[]> {
        throw new Error("Method not implemented.");
    }

    private getMetadataType(type: string): azdata.MetadataType {
        if (type === "f") {
            return azdata.MetadataType.Function;
        }

        if (type === "t") {
            return azdata.MetadataType.Table;
        }

        if (type === "s") {
            return azdata.MetadataType.SProc;
        }

        return azdata.MetadataType.View;
    }

    private getMetadataName(type: string): string {
        return this.getMetadataType(type).toString();
    }
}
