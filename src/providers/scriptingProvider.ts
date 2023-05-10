import type * as azdata from "azdata";
import * as vscode from "vscode";
import { type ConnectionService } from "../connection/connectionService";

export class ScriptingProvider implements azdata.ScriptingProvider {
    handle?: number | undefined;
    providerId = "regress";

    private readonly onScriptingComplete: vscode.EventEmitter<azdata.ScriptingCompleteResult> =
        new vscode.EventEmitter();

    constructor(private readonly connections: ConnectionService) {}

    scriptAsOperation(
        connectionUri: string,
        operation: azdata.ScriptOperation,
        metadata: azdata.ObjectMetadata,
        paramDetails: azdata.ScriptingParamDetails
    ): Thenable<azdata.ScriptingResult> {
        // const client = this.connections.getConnection(connectionUri, ConnectionType.Query);
        // const server = new Server(client?.database!, client?.database!, null!, client!);

        throw new Error("Method not implemented.");
    }

    registerOnScriptingComplete(handler: (scriptingCompleteResult: azdata.ScriptingCompleteResult) => any): void {
        this.onScriptingComplete.event((e) => {
            handler(e);
        });
    }
}
