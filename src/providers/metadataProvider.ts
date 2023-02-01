import * as azdata from "azdata";
import * as vscode from "vscode";

export class MetadataProvider implements azdata.MetadataProvider {
    handle?: number | undefined;
    providerId: string = "regress";

    getMetadata(connectionUri: string): Thenable<azdata.ProviderMetadata> {
        throw new Error("Method not implemented.");
    }

    getDatabases(connectionUri: string): Thenable<string[] | azdata.DatabaseInfo[]> {
        throw new Error("Method not implemented.");
    }

    getTableInfo(connectionUri: string, metadata: azdata.ObjectMetadata): Thenable<azdata.ColumnMetadata[]> {
        throw new Error("Method not implemented.");
    }

    getViewInfo(connectionUri: string, metadata: azdata.ObjectMetadata): Thenable<azdata.ColumnMetadata[]> {
        throw new Error("Method not implemented.");
    }
}