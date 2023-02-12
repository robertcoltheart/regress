import * as azdata from "azdata";
import * as vscode from "vscode";
import { v4 as uuid } from "uuid";
import { AppContext } from "../appContext";

export class ConnectionProvider implements azdata.ConnectionProvider {
    handle?: number | undefined;
    providerId: string = "regress";

    private onConnectionComplete: vscode.EventEmitter<azdata.ConnectionInfoSummary> = new vscode.EventEmitter();

    constructor(private appContext: AppContext) {}

    async connect(connectionUri: string, connectionInfo: azdata.ConnectionInfo): Promise<boolean> {
        try {
            if (!(await this.appContext.connect(connectionUri, connectionInfo))) {
                vscode.window.showErrorMessage("Failed to connect");

                return false;
            }
        } catch (e) {
            this.onConnectionComplete.fire({
                ownerUri: connectionUri,
                errorMessage: (e as { message: string}).message
            });

            return false;
        }

        this.onConnectionComplete.fire({
            connectionId: uuid(),
            ownerUri: connectionUri,
            messages: "",
            errorMessage: "",
            errorNumber: 0,
            connectionSummary: {
                serverName: connectionInfo.options["host"],
                userName: connectionInfo.options["username"],
                databaseName: connectionInfo.options["dbname"]
            },
            serverInfo: {
                serverReleaseVersion: 1,
                engineEditionId: 1,
                serverVersion: "1.0",
                serverLevel: "",
                serverEdition: "",
                isCloud: false,
                azureVersion: 0,
                osVersion: "",
                options: {}
            }
        });

        return Promise.resolve(true);
    }

    disconnect(connectionUri: string): Promise<boolean> {
        return this.appContext.disconnect(connectionUri);
    }

    cancelConnect(connectionUri: string): Thenable<boolean> {
        return Promise.resolve(true);
    }

    async listDatabases(connectionUri: string): Promise<azdata.ListDatabasesResult> {
        const databases = await this.appContext.listDatabases(connectionUri);

        return {
            databaseNames: databases
                .filter((db) => !db.isSystem)
                .map((db) => db.name)
        };
    }

    changeDatabase(connectionUri: string, newDatabase: string): Thenable<boolean> {
        return Promise.resolve(true);
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
    }

    registerOnConnectionChanged(handler: (changedConnInfo: azdata.ChangedConnectionInfo) => any): void {
    }
}
