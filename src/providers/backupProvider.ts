import type * as azdata from "azdata";

export class BackupProvider implements azdata.BackupProvider {
    handle?: number | undefined;
    providerId: string = "regress";

    backup(
        connectionUri: string,
        backupInfo: Record<string, any>,
        taskExecutionMode: azdata.TaskExecutionMode
    ): Thenable<azdata.BackupResponse> {
        throw new Error("Method not implemented.");
    }

    getBackupConfigInfo(connectionUri: string): Thenable<azdata.BackupConfigInfo> {
        throw new Error("Method not implemented.");
    }
}
