import * as azdata from "azdata";
import * as vscode from "vscode";

export class ScriptingProvider implements azdata.ScriptingProvider {
    handle?: number | undefined;
    providerId = "regress";

    private onScriptingComplete: vscode.EventEmitter<azdata.ScriptingCompleteResult> = new vscode.EventEmitter();

    scriptAsOperation(connectionUri: string, operation: azdata.ScriptOperation, metadata: azdata.ObjectMetadata, paramDetails: azdata.ScriptingParamDetails): Thenable<azdata.ScriptingResult> {
        throw new Error("Method not implemented.");
    }

    registerOnScriptingComplete(handler: (scriptingCompleteResult: azdata.ScriptingCompleteResult) => any): void {
        this.onScriptingComplete.event((e) => {
            handler(e);
        });
    }
}
