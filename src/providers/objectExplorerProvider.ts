import * as azdata from "azdata";
import * as vscode from "vscode";
import { type ConnectionService } from "../connection/connectionService";
import { ConnectionDetails } from "../connection/connectionDetails";
import { ConnectionType } from "../connection/connectionType";

export class ObjectExplorerProvider implements azdata.ObjectExplorerProvider {
    handle?: number | undefined;
    providerId = "regress";

    onSessionCreated: vscode.EventEmitter<azdata.ObjectExplorerSession> = new vscode.EventEmitter();
    onSessionDisconnected: vscode.EventEmitter<azdata.ObjectExplorerSession> = new vscode.EventEmitter();
    onExpandCompleted: vscode.EventEmitter<azdata.ObjectExplorerExpandInfo> = new vscode.EventEmitter();

    constructor(private readonly connections: ConnectionService) {}

    async createNewSession(connectionInfo: azdata.ConnectionInfo): Promise<azdata.ObjectExplorerSessionResponse> {
        const details = ConnectionDetails.create(connectionInfo);
        const sessionId = details.getSessionId();

        try {
            await this.connections.connect(sessionId, ConnectionType.ObjectExplorer, details);

            setTimeout(() => {
                this.onSessionCreated.fire({
                    sessionId,
                    success: true,
                    rootNode: {
                        nodePath: "/",
                        nodeType: "Database",
                        label: details.database,
                        isLeaf: false,
                        metadata: {
                            metadataType: azdata.MetadataType.Table,
                            metadataTypeName: "Database",
                            name: details.getMaintenenceDb(),
                            urn: details.getUrnBase(),
                            schema: ""
                        }
                    }
                });
            }, 500);
        } catch (e) {
            this.onSessionCreated.fire({
                sessionId,
                success: false,
                errorMessage: (e as { message: string }).message,
                rootNode: {
                    nodePath: "/",
                    nodeType: "Database",
                    label: details.database,
                    isLeaf: false
                }
            });
        }

        return { sessionId };
    }

    closeSession(
        closeSessionInfo: azdata.ObjectExplorerCloseSessionInfo
    ): Thenable<azdata.ObjectExplorerCloseSessionResponse> {
        if (closeSessionInfo.sessionId != null) {
            return Promise.resolve({
                sessionId: closeSessionInfo.sessionId,
                success: true
            });
        }

        return Promise.resolve({
            sessionId: "",
            success: false
        });
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

    async expandNode(nodeInfo: azdata.ExpandNodeInfo): Promise<boolean> {
        return await this.expandOrRefreshNode(false, nodeInfo);
    }

    async refreshNode(nodeInfo: azdata.ExpandNodeInfo): Promise<boolean> {
        return await this.expandOrRefreshNode(true, nodeInfo);
    }

    findNodes(findNodesInfo: azdata.FindNodesInfo): Thenable<azdata.ObjectExplorerFindNodesResponse> {
        throw new Error("Method not implemented.");
    }

    registerOnExpandCompleted(handler: (response: azdata.ObjectExplorerExpandInfo) => any): void {
        this.onExpandCompleted.event((e) => {
            handler(e);
        });
    }

    private async expandOrRefreshNode(refresh: boolean, nodeInfo: azdata.ExpandNodeInfo): Promise<boolean> {
        return true;
    }
}
