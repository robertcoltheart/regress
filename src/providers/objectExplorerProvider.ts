import * as azdata from "azdata";
import * as vscode from "vscode";
import { AppContext } from "../appContext";
import { Connection } from "../models/connection";
import { Router } from "../routing/router";
import { NodeInfo } from "azdata";
import { ExplorerSession } from "../session/explorerSession";

export class ObjectExplorerProvider implements azdata.ObjectExplorerProvider {
    handle?: number | undefined;
    providerId: string = "regress";

    onSessionCreated: vscode.EventEmitter<azdata.ObjectExplorerSession> = new vscode.EventEmitter();
    onSessionDisconnected: vscode.EventEmitter<azdata.ObjectExplorerSession> = new vscode.EventEmitter();
    onExpandCompleted: vscode.EventEmitter<azdata.ObjectExplorerExpandInfo> = new vscode.EventEmitter();

    private sessions = new Map<string, ExplorerSession>();

    constructor(private appContext: AppContext) {}

    createNewSession(connectionInfo: azdata.ConnectionInfo): Thenable<azdata.ObjectExplorerSessionResponse> {
        const connection = new Connection(connectionInfo);

        this.onSessionCreated.fire({
            sessionId: connection.getSessionId(),
            success: true,
            rootNode: {
                nodePath: "/",
                nodeType: "Database",
                label: connection.database,
                isLeaf: false,
                metadata: {
                    metadataType: azdata.MetadataType.Table,
                    metadataTypeName: "Database",
                    name: connection.getMaintenenceDb(),
                    urn: connection.getUrnBase(),
                    schema: ""
                }
            }
        });

        return Promise.resolve({
            sessionId: connection.getSessionId()
        });
    }

    closeSession(closeSessionInfo: azdata.ObjectExplorerCloseSessionInfo): Thenable<azdata.ObjectExplorerCloseSessionResponse> {
        if (closeSessionInfo.sessionId) {
            this.sessions.delete(closeSessionInfo.sessionId);

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

    expandNode(nodeInfo: azdata.ExpandNodeInfo): Thenable<boolean> {
        const router = new Router(() => {
            return [];
        });

        router.getRoutingTarget(nodeInfo.nodePath!);

        return Promise.resolve(true);
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
}
