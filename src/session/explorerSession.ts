import { NodeInfo } from "azdata";
import { Client } from "pg";
import { DatabaseQuery } from "./queries/databaseQuery";
import { TableQuery } from "./queries/tablesQuery";
import { ColumnQuery } from "./queries/columnsQuery";
import { ViewQuery } from "./queries/viewsQuery";

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
}
