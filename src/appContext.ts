import * as azdata from "azdata";
import * as vscode from "vscode";
import { Client, ClientConfig, QueryResult } from "pg";
import { DatabaseInfo, IDatabaseInfo } from "./models";

export class AppContext {
    public static readonly CONNECTION_INFO_KEY = "host";

    private clients = new Map<String, Client>();

    public async connect(server: string, connectionInfo: azdata.ConnectionInfo): Promise<Client | undefined> {
        try {
            let client = new Client({
                host: connectionInfo.options["host"],
                database: "postgres",
                user: connectionInfo.options["user"],
                password: connectionInfo.options["password"]
            });

            await client.connect();

            this.clients.set(server, client);

            return client;
        } catch (error) {
            console.error(error);

            return undefined;
        }
    }

    public async listDatabases(server: String): Promise<IDatabaseInfo[]> {
        if (!this.clients.has(server)) {
            return [];
        }

        const client = this.clients.get(server)!;

        const result = await client.query(`
SELECT
    db.oid AS "oid",
    db.datname AS "name",
    ta.spcname AS spcname,
    db.datallowconn,
    0 AS datlastsysoid,
    has_database_privilege(db.oid, 'CREATE') AS cancreate,
    datdba AS owner,
    db.datistemplate,
    has_database_privilege(db.datname, 'connect') AS canconnect,
    datistemplate AS is_system
FROM
    pg_database db
LEFT OUTER JOIN pg_tablespace ta ON db.dattablespace = ta.oid
ORDER BY datname;`);

        const infos = result.rows.map<IDatabaseInfo>(x => ({
            oid: x.oid,
            name: x.name,
            spcname: x.spcname,
            dataallowconn: x.dataallowconn,
            cancreate: x.cancreate,
            owner: x.owner,
            canconnect: x.canconnect,
            is_system: x.is_system
        }));

        return Promise.resolve(infos);
    }
}
