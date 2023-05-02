import type * as azdata from "azdata";
import { type Server } from "../nodes/objects/server";
import { type NodeObject } from "../nodes/nodeObject";
import { type ConnectionDetails } from "../connection/connectionDetails";
import { type Database } from "../nodes/objects/database";
import { type Table } from "../nodes/objects/table";

export class ObjectExplorerSession {
    public cache = new Map<string, azdata.NodeInfo[]>();

    constructor(public id: string, public server: Server, public details: ConnectionDetails) {}

    public async getDatabases(refresh: boolean, path: string): Promise<azdata.NodeInfo[]> {
        this.refresh(refresh);

        const isSystem = path.includes("systemdatabase");
        const nodes = await this.server.databases.getAll();

        return nodes
            .filter((x) => x.isSystem === isSystem)
            .map((x) => this.getNodeInfo(x, path, "Database", x.name, false));
    }

    public async getTables(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        const isSystem = this.isSystem(path);
        const database = await this.getDatabase(refresh, path, parameters);
        const nodes = await database.tables.getAll();

        return nodes
            .filter((x) => x.isSystem === isSystem)
            .map((x) => this.getNodeInfo(x, path, "Table", `${x.schema}.${x.name}`, false));
    }

    public async getViews(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        const isSystem = this.isSystem(path);
        const database = await this.getDatabase(refresh, path, parameters);
        const nodes = await database.views.getAll();

        return nodes
            .filter((x) => x.isSystem === isSystem)
            .map((x) => this.getNodeInfo(x, path, "View", `${x.schema}.${x.name}`, false));
    }

    public async getFunctions(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        const isSystem = this.isSystem(path);
        const database = await this.getDatabase(refresh, path, parameters);
        const nodes = await database.functions.getAll();

        return nodes
            .filter((x) => x.isSystem === isSystem)
            .map((x) => this.getNodeInfo(x, path, "ScalarValuedFunction", `${x.schema}.${x.name}`));
    }

    public async getCollations(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        const isSystem = this.isSystem(path);
        const database = await this.getDatabase(refresh, path, parameters);
        const nodes = await database.collations.getAll();

        return nodes
            .filter((x) => x.isSystem === isSystem)
            .map((x) => this.getNodeInfo(x, path, "collations", `${x.schema}.${x.name}`));
    }

    public async getDataTypes(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        const isSystem = this.isSystem(path);
        const database = await this.getDatabase(refresh, path, parameters);
        const nodes = await database.dataTypes.getAll();

        return nodes
            .filter((x) => x.isSystem === isSystem)
            .map((x) => this.getNodeInfo(x, path, "Datatypes", `${x.schema}.${x.name}`));
    }

    public async getSequences(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        const isSystem = this.isSystem(path);
        const database = await this.getDatabase(refresh, path, parameters);
        const nodes = await database.sequences.getAll();

        return nodes
            .filter((x) => x.isSystem === isSystem)
            .map((x) => this.getNodeInfo(x, path, "Sequence", `${x.schema}.${x.name}`));
    }

    public async getColumns(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        const table = await this.getTable(refresh, path, parameters);
        const nodes = await table.columns.getAll();

        return nodes.map((x) => this.getNodeInfo(x, path, "Column", `${x.name} (${x.dataType})`));
    }

    public async getConstraints(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        const table = await this.getTable(refresh, path, parameters);

        const checkConstraints = await table.checkConstraints.getAll();
        const indexConstraints = await table.indexConstraints.getAll();
        const exclusionConstraints = await table.exclusionConstraints.getAll();
        const foreignKeyConstraints = await table.foreignKeyConstraints.getAll();

        const checkConstraintNodes = checkConstraints.map((x) => this.getNodeInfo(x, path, "Constraint", x.name));
        const indexConstraintNodes = indexConstraints.map((x) => this.getNodeInfo(x, path, "Constraint", x.name));
        const exclusionConstraintNodes = exclusionConstraints.map((x) =>
            this.getNodeInfo(x, path, "Constraint", x.name)
        );
        const foreignKeyConstraintNodes = foreignKeyConstraints.map((x) =>
            this.getNodeInfo(x, path, "Key_ForeignKey", x.name)
        );

        return checkConstraintNodes
            .concat(exclusionConstraintNodes)
            .concat(foreignKeyConstraintNodes)
            .concat(indexConstraintNodes);
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
        const table = await this.getTable(refresh, path, parameters);
        const nodes = await table.rules.getAll();

        return nodes.map((x) => this.getNodeInfo(x, path, "Constraint", x.name));
    }

    public async getTriggers(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        const table = await this.getTable(refresh, path, parameters);
        const nodes = await table.triggers.getAll();

        return nodes.map((x) => this.getNodeInfo(x, path, "Trigger", x.name));
    }

    public async getExtensions(
        refresh: boolean,
        path: string,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        const isSystem = this.isSystem(path);
        const database = await this.getDatabase(refresh, path, parameters);
        const nodes = await database.extensions.getAll();

        return nodes
            .filter((x) => x.isSystem === isSystem)
            .map((x) => this.getNodeInfo(x, path, "extension", `${x.schema}.${x.name}`));
    }

    public async getRoles(refresh: boolean, path: string): Promise<azdata.NodeInfo[]> {
        this.refresh(refresh);

        const nodes = await this.server.roles.getAll();

        return nodes.map((x) =>
            this.getNodeInfo(x, path, x.canLogin ? "ServerLevelLogin" : "ServerLevelLogin_Disabled", x.name)
        );
    }

    public async getTablespaces(refresh: boolean, path: string): Promise<azdata.NodeInfo[]> {
        this.refresh(refresh);

        const nodes = await this.server.tablespaces.getAll();

        return nodes.map((x) => this.getNodeInfo(x, path, "Queue", x.name));
    }

    private async getDatabase(refresh: boolean, path: string, parameters: RegExpMatchArray | null): Promise<Database> {
        this.refresh(refresh);

        if (parameters?.groups == null) {
            throw new Error(`Invalid path: ${path}`);
        }

        return await this.server.databases.get(parameters.groups.dbid);
    }

    private async getTable(refresh: boolean, path: string, parameters: RegExpMatchArray | null): Promise<Table> {
        this.refresh(refresh);

        if (parameters?.groups == null) {
            throw new Error(`Invalid path: ${path}`);
        }

        const database = await this.server.databases.get(parameters.groups.dbid);

        return await database.tables.get(parameters.groups.tid);
    }

    private getNodeInfo(
        node: NodeObject,
        path: string,
        nodeType: string,
        label?: string,
        isLeaf: boolean = true
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
