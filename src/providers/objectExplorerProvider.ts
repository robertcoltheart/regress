import * as azdata from "azdata";
import * as vscode from "vscode";
import { AppContext } from "../appContext";
import { Connection } from "../models/connection";
import { Router } from "../routing/router";
import { NodeInfo } from "azdata";
import { ExplorerSession } from "../session/explorerSession";

export class ObjectExplorerProvider implements azdata.ObjectExplorerProvider {
    handle?: number | undefined;
    providerId = "regress";

    onSessionCreated: vscode.EventEmitter<azdata.ObjectExplorerSession> = new vscode.EventEmitter();
    onSessionDisconnected: vscode.EventEmitter<azdata.ObjectExplorerSession> = new vscode.EventEmitter();
    onExpandCompleted: vscode.EventEmitter<azdata.ObjectExplorerExpandInfo> = new vscode.EventEmitter();

    private router = new Router();

    private sessions = new Map<string, ExplorerSession>();

    constructor(private appContext: AppContext) {}

    async createNewSession(connectionInfo: azdata.ConnectionInfo): Promise<azdata.ObjectExplorerSessionResponse> {
        const connection = new Connection(connectionInfo);
        const sessionId = connection.getSessionId();

        const client = await this.appContext.connect(sessionId, connection);

        if (!client) {
            vscode.window.showErrorMessage("Failed to connect");

            throw new Error("Failed to connect");
        }

        this.sessions.set(sessionId, new ExplorerSession(client));

        this.onSessionCreated.fire({
            sessionId: sessionId,
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
            sessionId
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

    expandNode(nodeInfo: azdata.ExpandNodeInfo): Promise<boolean> {
        return this.expandOrRefreshNode(false, nodeInfo);
    }

    refreshNode(nodeInfo: azdata.ExpandNodeInfo): Promise<boolean> {
        return this.expandOrRefreshNode(true, nodeInfo);
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
        const session = this.sessions.get(nodeInfo.sessionId);

        if (!session) {
            return Promise.resolve(false);
        }

        const nodes = await this.getNodes(refresh, nodeInfo);

        this.onExpandCompleted.fire({
            sessionId: nodeInfo.sessionId,
            nodePath: nodeInfo.nodePath || "unknown",
            nodes: nodes
        });

        return Promise.resolve(true);
    }

    private async getNodes(refresh: boolean, nodeInfo: azdata.ExpandNodeInfo): Promise<NodeInfo[]> {
        const session = this.sessions.get(nodeInfo.sessionId);

        if (!session || !nodeInfo.nodePath) {
            return [];
        }

        if (refresh) {
            session.cache.delete(nodeInfo.nodePath);
        }

        const cachedNodes = session.cache.get(nodeInfo.nodePath);

        if (cachedNodes) {
            return cachedNodes;
        }

        for (const item of this.router.routes) {
            const isMatch = item.pattern.test(nodeInfo.nodePath);

            if (isMatch) {
                const matches = nodeInfo.nodePath.match(item.pattern);
                const nodes = await item.target.getNodes(refresh, nodeInfo.nodePath, session, matches);

                session.cache.set(nodeInfo.nodePath, nodes);

                return nodes;
            }
        }

        if (!nodeInfo.nodePath.endsWith("/")) {
            return [];
        }

        throw new Error(`No matching route for ${nodeInfo.nodePath}`);
    }
}
