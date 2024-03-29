import * as azdata from "azdata";
import * as vscode from "vscode";
import { Client, ClientConfig, QueryResult } from "pg";
import { Connection } from "./models/connection";
import { DatabaseInfo } from "./models/database_info";

export class AppContext {
    public static readonly CONNECTION_INFO_KEY = "host";

    private clients = new Map<string, Client>();

    public async connect(ownerUri: string, connection: Connection): Promise<Client | undefined> {
        if (this.clients.has(ownerUri)) {
            return this.clients.get(ownerUri);
        }

        try {
            const client = new Client({
                host: connection.host,
                database: connection.database,
                user: connection.username,
                password: connection.password,
                port: connection.port
            });

            await client.connect();

            this.clients.set(ownerUri, client);

            return client;
        } catch (error) {
            console.error(error);

            return undefined;
        }
    }

    public async changeDatabase(ownerUri: string, database: string): Promise<boolean> {
        const existing = this.getclient(ownerUri);

        if (!existing) {
            return false;
        }

        await this.disconnect(ownerUri);

        const info = {
            options: {
                'dbname': database,
                'user': existing.user,
                'password': existing.password,
                'port': existing.port,
                'host': existing.host
            }
        }

        const client = await this.connect(ownerUri, new Connection(info));

        return client != undefined;
    }

    public getclient(ownerUri: string): Client | undefined {
        return this.clients.get(ownerUri);
    }

    public async disconnect(ownerUri: string): Promise<boolean> {
        const client = this.clients.get(ownerUri);

        if (!client) {
            return false;
        }

        await client.end();

        return this.clients.delete(ownerUri);
    }

    public async listDatabases(ownerUri: string): Promise<DatabaseInfo[]> {
        const client = this.clients.get(ownerUri);

        if (!client) {
            return [];
        }

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
            name: x.name,
            isSystem: x.is_system
        }));

        return Promise.resolve(infos);
    }
}
