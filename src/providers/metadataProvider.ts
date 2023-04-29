import * as azdata from "azdata";

export class MetadataProvider implements azdata.MetadataProvider {
    handle?: number | undefined;
    providerId = "regress";

    async getMetadata(connectionUri: string): Promise<azdata.ProviderMetadata> {
        throw new Error("Method not implemented.");
    }

    async getDatabases(connectionUri: string): Promise<string[] | azdata.DatabaseInfo[]> {
        throw new Error("Method not implemented.");
    }

    getTableInfo(connectionUri: string, metadata: azdata.ObjectMetadata): Thenable<azdata.ColumnMetadata[]> {
        throw new Error("Method not implemented.");
    }

    getViewInfo(connectionUri: string, metadata: azdata.ObjectMetadata): Thenable<azdata.ColumnMetadata[]> {
        throw new Error("Method not implemented.");
    }

    private getMetadataType(type: string): azdata.MetadataType {
        if (type === "f") {
            return azdata.MetadataType.Function;
        }

        if (type === "t") {
            return azdata.MetadataType.Table;
        }

        if (type === "s") {
            return azdata.MetadataType.SProc;
        }

        return azdata.MetadataType.View;
    }

    private getMetadataName(type: string): string {
        return this.getMetadataType(type).toString();
    }
}
