import * as azdata from "azdata";
import { ProviderId } from "./connectionProvider";

const IconId = "regress";

export class IconProvider implements azdata.IconProvider {
    getConnectionIconId(connection: azdata.IConnectionProfile, serverInfo: azdata.ServerInfo): Thenable<string | undefined> {
        return Promise.resolve(IconId)
    }

    handle?: number | undefined;
    providerId: string = ProviderId;
}
