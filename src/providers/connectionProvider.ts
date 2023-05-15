import type * as azdata from "azdata";
import * as vscode from "vscode";
import { v4 as uuid } from "uuid";
import { type ConnectionService } from "../connection/connectionService";
import { ConnectionDetails } from "../connection/connectionDetails";
import { ConnectionType } from "../connection/connectionType";

export class ConnectionProvider implements azdata.ConnectionProvider {
    handle?: number | undefined;
    providerId = "regress";

    private readonly onConnectionComplete: vscode.EventEmitter<azdata.ConnectionInfoSummary> =
        new vscode.EventEmitter();

    private readonly onConnectionChanged: vscode.EventEmitter<azdata.ChangedConnectionInfo> = new vscode.EventEmitter();

    constructor(private readonly connections: ConnectionService) {}

    async connect(connectionUri: string, connectionInfo: azdata.ConnectionInfo): Promise<boolean> {
        const details = ConnectionDetails.create(connectionInfo);

        return await this.connectAndNotify(connectionUri, details);
    }

    async connectAndNotify(connectionUri: string, details: ConnectionDetails): Promise<boolean> {
        try {
            const client = await this.connections.connect(connectionUri, ConnectionType.Default, details);

            if (client === undefined) {
                await vscode.window.showErrorMessage("Failed to connect");

                return false;
            }
        } catch (e) {
            this.onConnectionComplete.fire({
                ownerUri: connectionUri,
                errorMessage: (e as { message: string }).message
            });

            return false;
        }

        this.onConnectionComplete.fire({
            connectionId: uuid(),
            ownerUri: connectionUri,
            connectionSummary: {
                serverName: details.host,
                userName: details.username,
                databaseName: details.database
            },
            serverInfo: {
                serverReleaseVersion: 0,
                engineEditionId: 0,
                serverVersion: "",
                serverLevel: "",
                serverEdition: "",
                isCloud: details.host.endsWith("database.azure.com") || details.host.endsWith("database.windows.net"),
                azureVersion: 0,
                osVersion: "",
                options: {}
            }
        });

        return true;
    }

    async disconnect(connectionUri: string): Promise<boolean> {
        return await this.connections.disconnect(connectionUri, ConnectionType.Default);
    }

    async cancelConnect(connectionUri: string): Promise<boolean> {
        return await this.connections.cancelConnect(connectionUri, ConnectionType.Default);
    }

    async listDatabases(connectionUri: string): Promise<azdata.ListDatabasesResult> {
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

        return {
            databaseNames: result.rows.filter((db) => db.is_system === false).map((db) => db.name)
        };
    }

    async changeDatabase(connectionUri: string, newDatabase: string): Promise<boolean> {
        const info = this.connections.getConnectionInfo(connectionUri);

        if (info == null) {
            return false;
        }

        const details = ConnectionDetails.clone(info.details, newDatabase);

        const client = await this.connections.connect(connectionUri, ConnectionType.Default, details);

        return client !== undefined;
    }

    rebuildIntelliSenseCache(connectionUri: string): Thenable<void> {
        return Promise.resolve();
    }

    getConnectionString(connectionUri: string, includePassword: boolean): Thenable<string> {
        throw new Error("Method not implemented.");
    }

    buildConnectionInfo?(connectionString: string): Thenable<azdata.ConnectionInfo> {
        throw new Error("Method not implemented.");
    }

    registerOnConnectionComplete(handler: (connSummary: azdata.ConnectionInfoSummary) => any): void {
        this.onConnectionComplete.event((e) => {
            handler(e);
        });
    }

    registerOnIntelliSenseCacheComplete(handler: (connectionUri: string) => any): void {
        // ignored
    }

    registerOnConnectionChanged(handler: (changedConnInfo: azdata.ChangedConnectionInfo) => any): void {
        this.onConnectionChanged.event((e) => {
            handler(e);
        });
    }
}
