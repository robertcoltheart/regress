import type * as azdata from "azdata";

export class AdminServicesProvider implements azdata.AdminServicesProvider {
    handle?: number | undefined;
    providerId = "regress";

    createDatabase(connectionUri: string, database: azdata.DatabaseInfo): Thenable<azdata.CreateDatabaseResponse> {
        throw new Error("Method not implemented.");
    }

    createLogin(connectionUri: string, login: azdata.LoginInfo): Thenable<azdata.CreateLoginResponse> {
        throw new Error("Method not implemented.");
    }

    getDefaultDatabaseInfo(connectionUri: string): Thenable<azdata.DatabaseInfo> {
        throw new Error("Method not implemented.");
    }

    async getDatabaseInfo(connectionUri: string): Promise<azdata.DatabaseInfo> {
        throw new Error("Method not implemented.");
    }
}
