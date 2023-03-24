import { NodeInfo } from "azdata";
import { ExplorerSession } from "../session/explorerSession";
import { RoutingTarget } from "./routingTarget";

export class Router {
    public routes: {pattern: RegExp, target: RoutingTarget}[] = [
        {
            pattern: /^\/$/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                { label: "Databases", path: "databases" },
                { label: "System Databases", path: "systemdatabases" },
                { label: "Roles", path: "roles" },
                { label: "Tablespaces", path: "tablespaces" })
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/$/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                { label: "Tables", path: "tables" },
                { label: "Views", path: "view" },
                { label: "Materialized Views", path: "materializedviews" },
                { label: "Functions", path: "functions" },
                { label: "Collations", path: "collations" },
                { label: "Data Types", path: "datatypes" },
                { label: "Sequences", path: "sequences" },
                { label: "Schemas", path: "schemas" },
                { label: "Extensions", path: "extensions" })
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/$/,
            target: new RoutingTarget((refresh, path, session, parameters) => session.getDatabases(refresh, path, parameters))
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/tables\/$/,
            target: new RoutingTarget(
                (refresh, path, session, parameters) => session.getTables(refresh, path, parameters),
                {label: "System", path: "system"})
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/tables\/system\/$/,
            target: new RoutingTarget((refresh, path, session, parameters) => session.getTables(refresh, path, parameters))
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/views\/$/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                {label: "System", path: "system"})
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/views\/system\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/materializedviews\/$/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                {label: "System", path: "system"})
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/materializedviews\/system\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/functions\/$/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                {label: "System", path: "system"})
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/functions\/system\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/collations\/$/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                {label: "System", path: "system"})
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/collations\/system\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/datatypes\/$/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                {label: "System", path: "system"})
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/datatypes\/system\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/sequences\/$/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                {label: "System", path: "system"})
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/sequences\/system\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/schemas\/$/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                {label: "System", path: "system"})
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/schemas\/system\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/tables\/(?<tid>\d+)\/$/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                {label: "Columns", path: "columns"},
                {label: "Constraints", path: "constraints"},
                {label: "Indexes", path: "indexes"},
                {label: "Rules", path: "rules"},
                {label: "Triggers", path: "triggers"})
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/tables\/system\/(?<tid>\d+)\/$/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                {label: "Columns", path: "columns"},
                {label: "Constraints", path: "constraints"},
                {label: "Indexes", path: "indexes"},
                {label: "Rules", path: "rules"},
                {label: "Triggers", path: "triggers"})
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/(?<obj>tables|views|materializedviews)\/(?<tid>\d+)\/columns\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/(?<obj>tables|views|materializedviews)\/system\/(?<tid>\d+)\/columns\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/tables\/(?<tid>\d+)\/constraints\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/tables\/system\/(?<tid>\d+)\/constraints\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/(?<obj>tables|materializedviews)\/(?<tid>\d+)\/indexes\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/(?<obj>tables|materializedviews)\/system\/(?<tid>\d+)\/indexes\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/(?<obj>tables|views)\/(?<tid>\d+)\/rules\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/(?<obj>tables|views)\/system\/(?<tid>\d+)\/rules\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/(?<obj>tables|views)\/(?<tid>\d+)\/triggers\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/(?<obj>tables|views)\/system\/(?<tid>\d+)\/triggers\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/views\/(?<vid>\d+\/$)/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                {label: "Columns", path: "columns"},
                {label: "Rules", path: "rules"},
                {label: "Triggers", path: "triggers"})
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/views\/system\/(?<vid>\d+\/$)/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                {label: "Columns", path: "columns"},
                {label: "Rules", path: "rules"},
                {label: "Triggers", path: "triggers"})
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/materializedviews\/(?<vid>\d+\/$)/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                {label: "Columns", path: "columns"},
                {label: "Indexes", path: "indexes"})
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/materializedviews\/system\/(?<vid>\d+\/$)/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                {label: "Columns", path: "columns"},
                {label: "Indexes", path: "indexes"})
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/functions(\/system)\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/collations(\/system)\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/datatypes(\/system)\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/sequences(\/system)\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/extensions\/$/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                {label: "System", path: "system"})
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/sequences(\/system)\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/extensions\/system\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/roles\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
        {
            pattern: /^\/tablespaces\/$/,
            target: new RoutingTarget(this.getDefaultNodes)
        },
    ];

    private getDefaultNodes(refresh: boolean, path: string, session: ExplorerSession, parameters: RegExpMatchArray | null): Promise<NodeInfo[]> {
        return Promise.resolve([]);
    }
}
