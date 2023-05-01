import { type Client } from "pg";
import { NodeCollection } from "../nodeCollection";
import { NodeObject } from "../nodeObject";
import { type ScriptableCreate } from "../scriptableCreate";
import { DatabaseScripter } from "./databaseScripter";
import { Table } from "./table";

export class Database extends NodeObject implements ScriptableCreate {
    public static readonly scripter = new DatabaseScripter();

    public readonly tables = new NodeCollection<Table>(this, Table.scripter);

    private client?: Client;

    constructor(parent: NodeObject, public id: string, public name: string, public isSystem: boolean) {
        super(parent);
    }

    public createScript(): string {
        return `CREATE DATABASE ${this.name}`;
    }

    public async getConnection(): Promise<Client> {
        if (this.client != null) {
            return this.client;
        }

        const server = this.getServer();

        if (server.maintenanceDbName === this.name) {
            this.client = server.client;

            return this.client;
        }

        const connection = await server.connectionFactory(this.name);

        if (connection.database === this.name) {
            this.client = connection;
        }

        if (this.client == null) {
            throw Error("Cannot create connection");
        }

        return this.client;
    }
}
