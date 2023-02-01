import * as azdata from "azdata";
import * as vscode from "vscode";
import { v4 as uuid } from "uuid";
import { AppContext } from "../appContext";

export const ProviderId: string = "REGRESS_POSTGRESQL";

export class ConnectionProvider implements azdata.ConnectionProvider {
    handle?: number | undefined;
    providerId: string = "regress";

    private connectionUriToServerMap = new Map<string, string>();

    private onConnectionComplete: vscode.EventEmitter<azdata.ConnectionInfoSummary> = new vscode.EventEmitter();

    constructor(private appContext: AppContext) {}

    async connect(connectionUri: string, connectionInfo: azdata.ConnectionInfo): Promise<boolean> {
        const showErrorMessage = (errorMessage: string) => {
            this.onConnectionComplete.fire({
                ownerUri: connectionUri,
                errorMessage,
            });
        };

        const server = connectionInfo.options[AppContext.CONNECTION_INFO_KEY];
        this.connectionUriToServerMap.set(connectionUri, server);

        try {
            if (!(await this.appContext.connect(server, connectionInfo))) {
                vscode.window.showErrorMessage("Failed to connect");

                return false;
            }
        } catch (e) {
            showErrorMessage((e as { message: string }).message);

            return false;
        }

        this.onConnectionComplete.fire({
            connectionId: uuid(),
            ownerUri: connectionUri,
            messages: "",
            errorMessage: "",
            errorNumber: 0,
            connectionSummary: {
                serverName: "",
                userName: "",
            },
            serverInfo: {
                serverReleaseVersion: 1,
                engineEditionId: 1,
                serverVersion: "1.0",
                serverLevel: "",
                serverEdition: "",
                isCloud: true,
                azureVersion: 1,
                osVersion: "",
                options: {},
            },
        });

        return Promise.resolve(true);
    }

    disconnect(connectionUri: string): Thenable<boolean> {
        throw new Error("Method not implemented.");
    }

    cancelConnect(connectionUri: string): Thenable<boolean> {
        return Promise.resolve(true);
    }

    listDatabases(connectionUri: string): Thenable<azdata.ListDatabasesResult> {
        throw new Error("Method not implemented.");
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
