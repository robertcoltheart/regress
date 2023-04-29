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

    constructor(private readonly connectionService: ConnectionService) {}

    async connect(connectionUri: string, connectionInfo: azdata.ConnectionInfo): Promise<boolean> {
        const details = ConnectionDetails.create(connectionInfo);

        try {
            const client = await this.connectionService.connect(connectionUri, ConnectionType.Default, details);

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
        throw new Error("Method not implemented.");
    }

    cancelConnect(connectionUri: string): Thenable<boolean> {
        return Promise.resolve(true);
    }

    async listDatabases(connectionUri: string): Promise<azdata.ListDatabasesResult> {
        throw new Error("Method not implemented.");
    }

    async changeDatabase(connectionUri: string, newDatabase: string): Promise<boolean> {
        throw new Error("Method not implemented.");
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
