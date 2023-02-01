import * as azdata from "azdata";
import * as vscode from "vscode";
import { Client, ClientConfig, QueryResult } from "pg";
import { DatabaseInfo } from "./models";

export class AppContext {
    public static readonly CONNECTION_INFO_KEY = "host";

    private clients = new Map<string, Client>();

    public async connect(host: string, connectionInfo: azdata.ConnectionInfo): Promise<Client | undefined> {
        try {
            let client = new Client({
                host: connectionInfo.options["host"],
                database: "postgres",
                user: connectionInfo.options["user"],
                password: connectionInfo.options["password"]
            });

            await client.connect();

            this.clients.set(host, client);

            return client;
        } catch (error) {
            console.error(error);

            return undefined;
        }
    }

    public async listDatabases(host: string): Promise<DatabaseInfo[]> {
        if (!this.clients.has(host)) {
            return [];
        }

        const client = this.clients.get(host)!;

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

        const infos = result.rows.map<DatabaseInfo>(x => ({
            oid: x.oid,
            name: x.name
        }));

        return Promise.resolve(infos);
    }
}
