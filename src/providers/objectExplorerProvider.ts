import * as azdata from "azdata";
import * as vscode from "vscode";
import * as nls from "vscode-nls";
import { AppContext } from "../appContext";
import { ProviderId } from "./connectionProvider";

export class ObjectExplorerProvider implements azdata.ObjectExplorerProvider {
    handle?: number | undefined;
    providerId: string = ProviderId;

    onSessionCreated: vscode.EventEmitter<azdata.ObjectExplorerSession> = new vscode.EventEmitter();
    onSessionDisconnected: vscode.EventEmitter<azdata.ObjectExplorerSession> = new vscode.EventEmitter();
    onExpandCompleted: vscode.EventEmitter<azdata.ObjectExplorerExpandInfo> = new vscode.EventEmitter();

    constructor(private appContext: AppContext) {}

    createNewSession(connectionInfo: azdata.ConnectionInfo): Thenable<azdata.ObjectExplorerSessionResponse> {
        const server = connectionInfo.options[AppContext.CONNECTION_INFO_KEY];
        const sessionId = server;

        setTimeout(() => {
            this.onSessionCreated.fire({
                sessionId,
                success: true,
                rootNode: {
                    nodePath: server,
                    nodeType: "server",
                    label: "",
                    isLeaf: false,
                },
            });
        }, 0);

        return Promise.resolve({
            sessionId,
        });
    }

    closeSession(closeSessionInfo: azdata.ObjectExplorerCloseSessionInfo): Thenable<azdata.ObjectExplorerCloseSessionResponse> {
        throw new Error("Method not implemented.");
    }

    registerOnSessionCreated(handler: (response: azdata.ObjectExplorerSession) => any): void {
        this.onSessionCreated.event((e) => {
            handler(e);
        });
    }

    registerOnSessionDisconnected?(handler: (response: azdata.ObjectExplorerSession) => any): void {
        this.onSessionDisconnected.event((e) => {
            handler(e);
        });
    }

    expandNode(nodeInfo: azdata.ExpandNodeInfo): Thenable<boolean> {
        return this.executeExpandNode(nodeInfo);
    }

    refreshNode(nodeInfo: azdata.ExpandNodeInfo): Thenable<boolean> {
        throw new Error("Method not implemented.");
    }

    findNodes(findNodesInfo: azdata.FindNodesInfo): Thenable<azdata.ObjectExplorerFindNodesResponse> {
        throw new Error("Method not implemented.");
    }

    registerOnExpandCompleted(handler: (response: azdata.ObjectExplorerExpandInfo) => any): void {
        this.onExpandCompleted.event((e) => {
            handler(e);
        });
    }

    private executeExpandNode(nodeInfo: azdata.ExpandNodeInfo): Thenable<boolean> {
        if (!nodeInfo.nodePath) {
            throw new Error("nodeInfo.nodePath is undefined");
        }

        const dbInfo = this.getPostgresInfo(nodeInfo.nodePath);

        if (dbInfo.database !== undefined) {
            return this.expandDatabase(nodeInfo, dbInfo.host, dbInfo.database);
        }

        return this.expandHost(nodeInfo, dbInfo.host);
    }

    private expandHost(nodeInfo: azdata.ExpandNodeInfo, host: string): Thenable<boolean> {
        return this.appContext.listDatabases(host)
            .then((databases) => {
                this.onExpandCompleted.fire(({
                    sessionId: nodeInfo.sessionId,
                    nodePath: nodeInfo.nodePath || "unknown",
                    nodes: databases.map((db) => ({
                        nodePath: `${nodeInfo.nodePath}/${db.name}`,
                        nodeType: "Database",
                        label: db.name,
                        isLeaf: false
                    }))
                }));

                return true;
            });
    }

    private expandDatabase(nodeInfo: azdata.ExpandNodeInfo, host: string, database: string): Thenable<boolean> {
        return Promise.resolve(true);
    }

    private getPostgresInfo(nodePath: string): { host: string, database?: string } {
        const pathComponents = nodePath?.split("/");
        const slashCount = pathComponents.length - 1;
    
        switch (slashCount) {
            case 0:
                return { host: pathComponents[0] };
            case 1:
                return { host: pathComponents[0], database: pathComponents[1] };
            default:
                throw new Error(`Unrecognized path ${nodePath}`);
        }
    }
}
