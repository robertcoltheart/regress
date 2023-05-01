import type * as azdata from "azdata";
import { type Server } from "../nodes/objects/server";
import { type NodeObject } from "../nodes/nodeObject";
import { type ConnectionDetails } from "../connection/connectionDetails";

export class ObjectExplorerSession {
    public cache = new Map<string, azdata.NodeInfo[]>();

    constructor(public id: string, public server: Server, public details: ConnectionDetails) {}

    public async getDatabases(refresh: boolean, path: string): Promise<azdata.NodeInfo[]> {
        this.refresh(refresh);

        const isSystem = path.includes("systemdatabase");
        const nodes = await this.server.databases.getAll();

        return nodes.filter((x) => x.isSystem === isSystem).map((x) => this.getNodeInfo(x, path, "Database"));
    }

    public async getTables(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        this.refresh(refresh);

        if (parameters?.groups == null) {
            throw new Error(`Invalid path: ${path}`);
        }

        const isSystem = this.isSystem(path);
        const database = await this.server.databases.get(parameters.groups.dbid);
        const nodes = await database.tables.getAll();

        return nodes
            .filter((x) => x.isSystem === isSystem)
            .map((x) => this.getNodeInfo(x, path, "Table", `${x.schema}.${x.name}`));
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
        this.refresh(refresh);

        if (parameters?.groups == null) {
            throw new Error(`Invalid path: ${path}`);
        }

        const database = await this.server.databases.get(parameters.groups.dbid);
        const table = await database.tables.get(parameters.groups.tid);
        const nodes = await table.columns.getAll();

        return nodes.map((x) => this.getNodeInfo(x, path, "Column", `${x.name} (${x.dataType})`, true));
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

    private refresh(refresh: boolean): void {
        if (refresh) {
            this.server.refresh();
        }
    }

    private isSystem(path: string): boolean {
        return path.includes("/system/");
    }
}
