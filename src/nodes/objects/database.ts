import { NodeCollection } from "../nodeCollection";
import { NodeObject } from "../nodeObject";
import { type ScriptableCreate } from "../scriptableCreate";
import { DatabaseScripter } from "./databaseScripter";
import { Table } from "./table";

export class Database extends NodeObject implements ScriptableCreate {
    public static readonly scripter = new DatabaseScripter();

    public readonly tables = new NodeCollection<Table>(this, Table.scripter);

    constructor(public id: string, public name: string) {
        super();
    }

    public createScript(): string {
        return `CREATE DATABASE ${this.name}`;
    }
}
