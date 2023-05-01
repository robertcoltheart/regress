import { type Client } from "pg";
import { NodeCollection } from "../nodeCollection";
import { NodeObject } from "../nodeObject";
import { type ScriptableCreate } from "../scriptableCreate";
import { Table } from "./table";
import { DatabaseScripter } from "../scripters/databaseScripter";
import { Schema } from "./schema";
import { View } from "./view";
import { Collation } from "./collation";
import { DataType } from "./dataType";
import { Function } from "./function";
import { Sequence } from "./sequence";
import { Extension } from "./extension";
import { MaterializedView } from "./materializedView";

export class Database extends NodeObject implements ScriptableCreate<Database> {
    public static readonly scripter = new DatabaseScripter();

    public readonly tables = this.addCollection(Table.scripter);

    public readonly schemas = this.addCollection(Schema.scripter);

    public readonly views = this.addCollection(View.scripter);

    public readonly collations = this.addCollection(Collation.scripter);

    public readonly dataTypes = this.addCollection(DataType.scripter);

    public readonly functions = this.addCollection(Function.scripter);

    public readonly sequences = this.addCollection(Sequence.scripter);

    public readonly triggerFunctions = this.addCollection(Sequence.scripter);

    public readonly extensions = this.addCollection(Extension.scripter);

    public readonly materializedViews = this.addCollection(MaterializedView.scripter);

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

