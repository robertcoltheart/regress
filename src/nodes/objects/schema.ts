import { NodeCollection } from "../nodeCollection";
import { NodeObject } from "../nodeObject";
import { SchemaScripter } from "../scripters/schemaScripter";
import { Database } from "./database";
import { Table } from "./table";

export class Schema extends NodeObject {
    public static readonly scripter = new SchemaScripter();

    constructor(parent: Database, public id: string, public name: string) {
        super(parent);
    }
}

