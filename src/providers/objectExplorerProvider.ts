import * as azdata from "azdata";
import * as vscode from "vscode";
import * as nls from "vscode-nls";
import { AppContext } from "../appContext";
import { ProviderId } from "./connectionProvider";

const localize = nls.loadMessageBundle();

export const getPostgresInfo = (
    nodePath: string
): { serverName: string; databaseName?: string; collectionName?: string } => {
    const pathComponents = nodePath?.split("/");
    const slashCount = pathComponents.length - 1;

    switch (slashCount) {
        case 0:
            return { serverName: pathComponents[0] };
        case 1:
            return { serverName: pathComponents[0], databaseName: pathComponents[1] };
        default:
            throw new Error(localize("unrecognizedPath", "Unrecognized path {0}", nodePath));
    }
};

export class ObjectExplorerProvider implements azdata.ObjectExplorerProvider {
    onSessionCreatedEmitter: vscode.EventEmitter<azdata.ObjectExplorerSession> = new vscode.EventEmitter<azdata.ObjectExplorerSession>();
    onSessionCreated: vscode.Event<azdata.ObjectExplorerSession> = this.onSessionCreatedEmitter.event;

    onSessionDisconnectedEmitter: vscode.EventEmitter<azdata.ObjectExplorerSession> = new vscode.EventEmitter<azdata.ObjectExplorerSession>();
    onSessionDisconnected: vscode.Event<azdata.ObjectExplorerSession> = this.onSessionDisconnectedEmitter.event;

    onExpandCompletedEmitter: vscode.EventEmitter<azdata.ObjectExplorerExpandInfo> = new vscode.EventEmitter<azdata.ObjectExplorerExpandInfo>();
    onExpandCompleted: vscode.Event<azdata.ObjectExplorerExpandInfo> = this.onExpandCompletedEmitter.event;

    createNewSession(connectionInfo: azdata.ConnectionInfo): Thenable<azdata.ObjectExplorerSessionResponse> {
        console.log("ObjectExplorerProvider.createNewSession", connectionInfo);

        const server = connectionInfo.options[AppContext.CONNECTION_INFO_KEY];
        const sessionId = server;

        setTimeout(() => {
            this.onSessionCreatedEmitter.fire({
                sessionId,
                success: true,
                rootNode: {
                    nodePath: server,
                    nodeType: "server",
                    label: "_not_used_",
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
        console.log("ObjectExplorerProvider.registerOnSessionCreated");

        this.onSessionCreated((e) => {
            handler(e);
        });
    }

    registerOnSessionDisconnected?(handler: (response: azdata.ObjectExplorerSession) => any): void {
        console.log("ObjectExplorerProvider.registerOnSessionDisconnected");

        this.onSessionDisconnected((e) => {
            handler(e);
        });
    }

    expandNode(nodeInfo: azdata.ExpandNodeInfo): Thenable<boolean> {
        console.log(`ObjectExplorerProvider.expandNode ${nodeInfo.nodePath} ${nodeInfo.sessionId}`);

        return this.executeExpandNode(nodeInfo);
    }

    refreshNode(nodeInfo: azdata.ExpandNodeInfo): Thenable<boolean> {
        throw new Error("Method not implemented.");
    }

    findNodes(findNodesInfo: azdata.FindNodesInfo): Thenable<azdata.ObjectExplorerFindNodesResponse> {
        throw new Error("Method not implemented.");
    }

    registerOnExpandCompleted(handler: (response: azdata.ObjectExplorerExpandInfo) => any): void {
        console.log("ObjectExplorerProvider.registerOnExpandCompleted");

        this.onExpandCompleted((e) => {
            handler(e);
        });
    }

    private executeExpandNode(nodeInfo: azdata.ExpandNodeInfo): Thenable<boolean> {
        if (!nodeInfo.nodePath) {
            throw new Error("nodeInfo.nodePath is undefined");
        }

        const dbInfo = getPostgresInfo(nodeInfo.nodePath);

        return Promise.resolve(true);
    }

    handle?: number | undefined;
    providerId: string = ProviderId;
}
