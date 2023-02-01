import * as azdata from "azdata";
import * as vscode from "vscode";

export class QueryProvider implements azdata.QueryProvider {
    handle?: number | undefined;
    providerId: string = "regress";

    private onQueryComplete: vscode.EventEmitter<azdata.QueryExecuteCompleteNotificationResult> = new vscode.EventEmitter();
    private onBatchStart: vscode.EventEmitter<azdata.QueryExecuteBatchNotificationParams> = new vscode.EventEmitter();
    private onBatchComplete: vscode.EventEmitter<azdata.QueryExecuteBatchNotificationParams> = new vscode.EventEmitter();
    private onResultSetAvailable: vscode.EventEmitter<azdata.QueryExecuteResultSetNotificationParams> = new vscode.EventEmitter();
    private onResultSetUpdated: vscode.EventEmitter<azdata.QueryExecuteResultSetNotificationParams> = new vscode.EventEmitter();
    private onMessage: vscode.EventEmitter<azdata.QueryExecuteMessageParams> = new vscode.EventEmitter();

    cancelQuery(ownerUri: string): Thenable<azdata.QueryCancelResult> {
        throw new Error("Method not implemented.");
    }

    runQuery(ownerUri: string, selection: azdata.ISelectionData, runOptions?: azdata.ExecutionPlanOptions | undefined): Thenable<void> {
        throw new Error("Method not implemented.");
    }

    runQueryStatement(ownerUri: string, line: number, column: number): Thenable<void> {
        throw new Error("Method not implemented.");
    }

    runQueryString(ownerUri: string, queryString: string): Thenable<void> {
        throw new Error("Method not implemented.");
    }

    runQueryAndReturn(ownerUri: string, queryString: string): Thenable<azdata.SimpleExecuteResult> {
        throw new Error("Method not implemented.");
    }

    parseSyntax(ownerUri: string, query: string): Thenable<azdata.SyntaxParseResult> {
        throw new Error("Method not implemented.");
    }

    getQueryRows(rowData: azdata.QueryExecuteSubsetParams): Thenable<azdata.QueryExecuteSubsetResult> {
        throw new Error("Method not implemented.");
    }

    disposeQuery(ownerUri: string): Thenable<void> {
        throw new Error("Method not implemented.");
    }

    saveResults(requestParams: azdata.SaveResultsRequestParams): Thenable<azdata.SaveResultRequestResult> {
        throw new Error("Method not implemented.");
    }

    setQueryExecutionOptions(ownerUri: string, options: azdata.QueryExecutionOptions): Thenable<void> {
        throw new Error("Method not implemented.");
    }

    registerOnQueryComplete(handler: (result: azdata.QueryExecuteCompleteNotificationResult) => any): void {
        this.onQueryComplete.event((e) => {
            handler(e);
        });
    }

    registerOnBatchStart(handler: (batchInfo: azdata.QueryExecuteBatchNotificationParams) => any): void {
        this.onBatchStart.event((e) => {
            handler(e);
        });
    }

    registerOnBatchComplete(handler: (batchInfo: azdata.QueryExecuteBatchNotificationParams) => any): void {
        this.onBatchComplete.event((e) => {
            handler(e);
        });
    }

    registerOnResultSetAvailable(handler: (resultSetInfo: azdata.QueryExecuteResultSetNotificationParams) => any): void {
        this.onResultSetAvailable.event((e) => {
            handler(e);
        });
    }

    registerOnResultSetUpdated(handler: (resultSetInfo: azdata.QueryExecuteResultSetNotificationParams) => any): void {
        this.onResultSetUpdated.event((e) => {
            handler(e);
        });
    }

    registerOnMessage(handler: (message: azdata.QueryExecuteMessageParams) => any): void {
        this.onMessage.event((e) => {
            handler(e);
        });
    }

    commitEdit(ownerUri: string): Thenable<void> {
        throw new Error("Method not implemented.");
    }

    createRow(ownerUri: string): Thenable<azdata.EditCreateRowResult> {
        throw new Error("Method not implemented.");
    }

    deleteRow(ownerUri: string, rowId: number): Thenable<void> {
        throw new Error("Method not implemented.");
    }

    disposeEdit(ownerUri: string): Thenable<void> {
        throw new Error("Method not implemented.");
    }

    initializeEdit(ownerUri: string, schemaName: string, objectName: string, objectType: string, rowLimit: number, queryString: string): Thenable<void> {
        throw new Error("Method not implemented.");
    }

    revertCell(ownerUri: string, rowId: number, columnId: number): Thenable<azdata.EditRevertCellResult> {
        throw new Error("Method not implemented.");
    }

    revertRow(ownerUri: string, rowId: number): Thenable<void> {
        throw new Error("Method not implemented.");
    }

    updateCell(ownerUri: string, rowId: number, columnId: number, newValue: string): Thenable<azdata.EditUpdateCellResult> {
        throw new Error("Method not implemented.");
    }

    getEditRows(rowData: azdata.EditSubsetParams): Thenable<azdata.EditSubsetResult> {
        throw new Error("Method not implemented.");
    }

    registerOnEditSessionReady(handler: (ownerUri: string, success: boolean, message: string) => any): void {
    } 
}