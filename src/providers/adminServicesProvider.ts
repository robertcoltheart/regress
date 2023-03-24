import * as azdata from "azdata";
import * as vscode from "vscode";
import { AppContext } from "../appContext";

export class AdminServicesProvider implements azdata.AdminServicesProvider {
    handle?: number | undefined;
    providerId = "regress";

    constructor(private context: AppContext) {}

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
        const client = this.context.getclient(connectionUri);

        const results = await client?.query(
            `SELECT pg_catalog.pg_get_userbyid(db.datdba) as user FROM pg_catalog.pg_database db WHERE db.datname = '${client.database}'`);

        const user = results?.rows[0].user ?? "";

        return Promise.resolve({
            options: {
                dbname: client?.database,
                owner: user,
                size: ""
            }
        });
    }
}
