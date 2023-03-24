import { NodeInfo } from "azdata";
import { Client } from "pg";
import { DatabaseQuery } from "./queries/databaseQuery";
import { TableQuery } from "./queries/tableQuery";

export class ExplorerSession {
    public cache = new Map<string, NodeInfo[]>();

    constructor(private client: Client) {}

    public getDatabases(refresh: boolean, path: string, parameters: RegExpMatchArray | null): Promise<NodeInfo[]> {
        const isSystem = path.includes("systemdatabase");

        const query = new DatabaseQuery(isSystem);

        return query.execute(this.client, this.trimPath(path));
    }

    public getTables(refresh: boolean, path: string, parameters: RegExpMatchArray | null): Promise<NodeInfo[]> {
        const query = new TableQuery();

        return query.execute(this.client, this.trimPath(path));
    }

    private trimPath(path: string): string {
        if (path.endsWith('/')) {
            return path.slice(0, -1);
        }

        return path;
    }
}
