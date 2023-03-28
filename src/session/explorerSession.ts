import { NodeInfo } from "azdata";
import { Client } from "pg";
import { DatabaseQuery } from "./queries/databaseQuery";
import { TableQuery } from "./queries/tablesQuery";
import { ColumnQuery } from "./queries/columnsQuery";
import { ViewQuery } from "./queries/viewsQuery";
import { FunctionsQuery } from "./queries/functionsQuery";
import { CollationsQuery } from "./queries/collationsQuery";
import { DataTypesQuery } from "./queries/dataTypesQuery";
import { SequencesQuery } from "./queries/sequencesQuery";
import { SchemasQuery } from "./queries/schemasQuery";
import { ConstraintsQuery } from "./queries/constraintsQuery";
import { RulesQuery } from "./queries/rulesQuery";
import { IndexesQuery } from "./queries/indexesQuery";
import { TriggersQuery } from "./queries/triggersQuery";
import { RolesQuery } from "./queries/rolesQuery";
import { TablespacesQuery } from "./queries/tablespacesQuery";
import { ExtensionsQuery } from "./queries/extensionsQuery";

export class ExplorerSession {
    public cache = new Map<string, NodeInfo[]>();

    constructor(private client: Client) {}

    public getDatabases(refresh: boolean, path: string, parameters: RegExpMatchArray | null): Promise<NodeInfo[]> {
        const isSystem = path.includes("systemdatabase");
        const query = new DatabaseQuery(isSystem);

        return query.execute(this.client, path);
    }

    public getTables(refresh: boolean, path: string, parameters: RegExpMatchArray | null): Promise<NodeInfo[]> {
        const query = new TableQuery();

        return query.execute(this.client, path);
    }

    public getViews(refresh: boolean, path: string, parameters: RegExpMatchArray | null): Promise<NodeInfo[]> {
        const query = new ViewQuery();

        return query.execute(this.client, path);
    }

    public getColumns(refresh: boolean, path: string, parameters: RegExpMatchArray | null): Promise<NodeInfo[]> {
        if (!parameters?.groups) {
            throw new Error(`Invalid path: ${path}`);
        }

        const tableId = parameters.groups["tid"];
        const query = new ColumnQuery(tableId);

        return query.execute(this.client, path);
    }

    public getFunctions(refresh: boolean, path: string, parameters: RegExpMatchArray | null): Promise<NodeInfo[]> {
        const query = new FunctionsQuery();

        return query.execute(this.client, path);
    }

    public getCollations(refresh: boolean, path: string, parameters: RegExpMatchArray | null): Promise<NodeInfo[]> {
        const query = new CollationsQuery();

        return query.execute(this.client, path);
    }

    public getDataTypes(refresh: boolean, path: string, parameters: RegExpMatchArray | null): Promise<NodeInfo[]> {
        const query = new DataTypesQuery();

        return query.execute(this.client, path);
    }

    public getSequences(refresh: boolean, path: string, parameters: RegExpMatchArray | null): Promise<NodeInfo[]> {
        const query = new SequencesQuery();

        return query.execute(this.client, path);
    }

    public getSchemas(refresh: boolean, path: string, parameters: RegExpMatchArray | null): Promise<NodeInfo[]> {
        const query = new SchemasQuery();

        return query.execute(this.client, path);
    }

    public getExtensions(refresh: boolean, path: string, parameters: RegExpMatchArray | null): Promise<NodeInfo[]> {
        const query = new ExtensionsQuery();

        return query.execute(this.client, path);
    }

    public getConstraints(refresh: boolean, path: string, parameters: RegExpMatchArray | null): Promise<NodeInfo[]> {
        if (!parameters?.groups) {
            throw new Error(`Invalid path: ${path}`);
        }

        const tableId = parameters.groups["tid"];
        const query = new ConstraintsQuery(tableId);

        return query.execute(this.client, path);
    }

    public getIndexes(refresh: boolean, path: string, parameters: RegExpMatchArray | null): Promise<NodeInfo[]> {
        if (!parameters?.groups) {
            throw new Error(`Invalid path: ${path}`);
        }

        const tableId = parameters.groups["tid"];
        const query = new IndexesQuery(tableId);

        return query.execute(this.client, path);
    }

    public getRules(refresh: boolean, path: string, parameters: RegExpMatchArray | null): Promise<NodeInfo[]> {
        if (!parameters?.groups) {
            throw new Error(`Invalid path: ${path}`);
        }

        const tableId = parameters.groups["tid"];
        const query = new RulesQuery(tableId);

        return query.execute(this.client, path);
    }

    public getTriggers(refresh: boolean, path: string, parameters: RegExpMatchArray | null): Promise<NodeInfo[]> {
        if (!parameters?.groups) {
            throw new Error(`Invalid path: ${path}`);
        }

        const tableId = parameters.groups["tid"];
        const query = new TriggersQuery(tableId);

        return query.execute(this.client, path);
    }

    public getRoles(refresh: boolean, path: string, parameters: RegExpMatchArray | null): Promise<NodeInfo[]> {
        const query = new RolesQuery();

        return query.execute(this.client, path);
    }

    public getTablespaces(refresh: boolean, path: string, parameters: RegExpMatchArray | null): Promise<NodeInfo[]> {
        const query = new TablespacesQuery();

        return query.execute(this.client, path);
    }
}
