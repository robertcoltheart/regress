import type * as azdata from "azdata";

export class RestoreProvider implements azdata.RestoreProvider {
    handle?: number | undefined;
    providerId: string = "regress";

    getRestorePlan(connectionUri: string, restoreInfo: azdata.RestoreInfo): Thenable<azdata.RestorePlanResponse> {
        throw new Error("Method not implemented.");
    }

    cancelRestorePlan(connectionUri: string, restoreInfo: azdata.RestoreInfo): Thenable<boolean> {
        throw new Error("Method not implemented.");
    }

    restore(connectionUri: string, restoreInfo: azdata.RestoreInfo): Thenable<azdata.RestoreResponse> {
        throw new Error("Method not implemented.");
    }

    getRestoreConfigInfo(connectionUri: string): Thenable<azdata.RestoreConfigInfo> {
        throw new Error("Method not implemented.");
    }
}
