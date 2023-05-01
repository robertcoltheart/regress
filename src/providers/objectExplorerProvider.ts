import * as azdata from "azdata";
import * as vscode from "vscode";
import { type ConnectionService } from "../connection/connectionService";
import { ConnectionDetails } from "../connection/connectionDetails";
import { ConnectionType } from "../connection/connectionType";
import { ObjectExplorerSession } from "../routing/objectExplorerSession";
import { Server } from "../nodes/objects/server";
import { Router } from "../routing/router";
import { type Client } from "pg";

export class ObjectExplorerProvider implements azdata.ObjectExplorerProvider {
    handle?: number | undefined;
    providerId = "regress";

    router = new Router();

    onSessionCreated: vscode.EventEmitter<azdata.ObjectExplorerSession> = new vscode.EventEmitter();
    onSessionDisconnected: vscode.EventEmitter<azdata.ObjectExplorerSession> = new vscode.EventEmitter();
    onExpandCompleted: vscode.EventEmitter<azdata.ObjectExplorerExpandInfo> = new vscode.EventEmitter();

    sessions = new Map<string, ObjectExplorerSession>();

    constructor(private readonly connections: ConnectionService) {}

    async createNewSession(connectionInfo: azdata.ConnectionInfo): Promise<azdata.ObjectExplorerSessionResponse> {
        const details = ConnectionDetails.create(connectionInfo);
        const sessionId = details.getSessionId();

        try {
            const client = await this.connections.connect(sessionId, ConnectionType.ObjectExplorer, details);
            const server = new Server(
                details.host,
                details.host,
                async (name) => await this.createConnection(sessionId, name),
                client
            );

            this.sessions.set(sessionId, new ObjectExplorerSession(sessionId, server, details));

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

    private async createConnection(sessionId: string, database: string): Promise<Client> {
        const session = this.sessions.get(sessionId);

        if (session == null) {
            throw Error("Cannot find session");
        }

        const details = ConnectionDetails.clone(session.details, database);
        const key = session.id + database;

        return await this.connections.connect(key, ConnectionType.ObjectExplorer, details);
    }

    private async expandOrRefreshNode(refresh: boolean, nodeInfo: azdata.ExpandNodeInfo): Promise<boolean> {
        const session = this.sessions.get(nodeInfo.sessionId);

        if (session == null) {
            return false;
        }

        const nodes = await this.getNodes(refresh, nodeInfo);

        setTimeout(() => {
            this.onExpandCompleted.fire({
                sessionId: nodeInfo.sessionId,
                nodePath: nodeInfo.nodePath ?? "unknown",
                nodes
            });
        }, 500);

        return true;
    }

    private async getNodes(refresh: boolean, nodeInfo: azdata.ExpandNodeInfo): Promise<azdata.NodeInfo[]> {
        const session = this.sessions.get(nodeInfo.sessionId);

        if (session == null || nodeInfo.nodePath == null) {
            throw new Error(`Session not found ${nodeInfo.sessionId}`);
        }

        if (refresh) {
            session.cache.delete(nodeInfo.nodePath);
        }

        const cachedNodes = session.cache.get(nodeInfo.nodePath);

        if (cachedNodes !== undefined) {
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
