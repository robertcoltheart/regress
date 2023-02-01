import * as azdata from "azdata";

export class IconProvider implements azdata.IconProvider {
    handle?: number | undefined;
    providerId: string = "regress";

    getConnectionIconId(connection: azdata.IConnectionProfile, serverInfo: azdata.ServerInfo): Thenable<string | undefined> {
        return Promise.resolve("regress");
    }
}
