import type * as azdata from "azdata";
import { type Server } from "../nodes/objects/server";
import { type NodeObject } from "../nodes/nodeObject";

export class ObjectExplorerSession {
    public cache = new Map<string, azdata.NodeInfo[]>();

    constructor(public server: Server) {}

    public async getDatabases(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        return this.server.databases.getAll().map((x) => this.getNodeInfo(x, path, "Database"));
    }

    public async getTables(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        if (parameters?.groups == null) {
            throw new Error(`Invalid path: ${path}`);
        }

        const databaseId = parameters.groups.dbid;
        const database = this.server.databases.get(databaseId);

        return database.tables.getAll().map((x) => this.getNodeInfo(x, path, "Table", `${x.schema}.${x.name}`));
    }

    public async getViews(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        return [];
    }

    public async getFunctions(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        return [];
    }

    public async getCollations(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        return [];
    }

    public async getDataTypes(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        return [];
    }

    public async getSequences(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        return [];
    }

    public async getColumns(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        return [];
    }

    public async getConstraints(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        return [];
    }

    public async getIndexes(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        return [];
    }

    public async getRules(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        return [];
    }

    public async getTriggers(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        return [];
    }

    public async getExtensions(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        return [];
    }

    public async getRoles(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        return [];
    }

    public async getTablespaces(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        return [];
    }

    private getNodeInfo(
        node: NodeObject,
        path: string,
        nodeType: string,
        label?: string,
        isLeaf: boolean = false
    ): azdata.NodeInfo {
        if (path.endsWith("/")) {
            path = path.slice(0, -1);
        }

        const trailingSlash = isLeaf ? "" : "/";
        const nodePath = `${path}/${node.id}${trailingSlash}`;

        return {
            nodePath,
            nodeType,
            label: label ?? node.name,
            isLeaf
        };
    }
}
