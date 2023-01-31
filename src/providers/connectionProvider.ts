import * as azdata from "azdata";
import * as vscode from "vscode";
import { v4 as uuid } from "uuid";
import { AppContext } from "../appContext";

export const ProviderId: string = "REGRESS_POSTGRESQL";

export class ConnectionProvider implements azdata.ConnectionProvider {
    constructor(private appContext: AppContext) {}

    private connectionUriToServerMap = new Map<string, string>();

    private onConnectionCompleteEmitter: vscode.EventEmitter<azdata.ConnectionInfoSummary> = new vscode.EventEmitter();
    onConnectionComplete: vscode.Event<azdata.ConnectionInfoSummary> = this.onConnectionCompleteEmitter.event;

    async connect(connectionUri: string, connectionInfo: azdata.ConnectionInfo): Promise<boolean> {
        const showErrorMessage = (errorMessage: string) => {
            this.onConnectionCompleteEmitter.fire({
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

        this.onConnectionCompleteEmitter.fire({
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
        console.log("ConnectionProvider.cancelConnect");

        return Promise.resolve(true);
    }

    listDatabases(connectionUri: string): Thenable<azdata.ListDatabasesResult> {
        throw new Error("Method not implemented.");
    }

    changeDatabase(connectionUri: string, newDatabase: string): Thenable<boolean> {
        console.log("ConnectionProvider.changeDatabase");

        return Promise.resolve(true);
    }

    rebuildIntelliSenseCache(connectionUri: string): Thenable<void> {
        console.log("ConnectionProvider.rebuildIntelliSenseCache");

        return Promise.resolve();
    }

    getConnectionString(connectionUri: string, includePassword: boolean): Thenable<string> {
        throw new Error("Method not implemented.");
    }

    buildConnectionInfo?(connectionString: string): Thenable<azdata.ConnectionInfo> {
        throw new Error("Method not implemented.");
    }

    registerOnConnectionComplete(handler: (connSummary: azdata.ConnectionInfoSummary) => any): void {
        console.log("ConnectionProvider.registerOnConnectionComplete");

        this.onConnectionComplete((e) => {
          handler(e);
        });
    }

    registerOnIntelliSenseCacheComplete(handler: (connectionUri: string) => any): void {
        console.log("IntellisenseCache complete");
    }

    registerOnConnectionChanged(handler: (changedConnInfo: azdata.ChangedConnectionInfo) => any): void {
        console.log("Connection changed");
    }

    handle?: number | undefined;
    providerId: string = ProviderId;
}
