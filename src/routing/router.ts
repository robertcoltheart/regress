import { type NodeInfo } from "azdata";
import { RoutingTarget } from "./routingTarget";

export class Router {
    public routes: Array<{ pattern: RegExp; target: RoutingTarget }> = [
        {
            pattern: /^\/$/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                { label: "Databases", path: "databases" },
                { label: "System Databases", path: "systemdatabases" },
                { label: "Roles", path: "roles" },
                { label: "Tablespaces", path: "tablespaces" }
            )
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
                { label: "Extensions", path: "extensions" }
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/$/,
            target: new RoutingTarget(async (refresh, path, session) => await session.getDatabases(refresh, path))
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/tables\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getTables(refresh, path, parameters),
                { label: "System", path: "system" }
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/tables\/system\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getTables(refresh, path, parameters)
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/views\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getViews(refresh, path, parameters),
                { label: "System", path: "system" }
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/views\/system\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getViews(refresh, path, parameters)
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/materializedviews\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getViews(refresh, path, parameters),
                { label: "System", path: "system" }
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/materializedviews\/system\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getViews(refresh, path, parameters)
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/functions\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getFunctions(refresh, path, parameters),
                { label: "System", path: "system" }
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/functions\/system\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getFunctions(refresh, path, parameters)
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/collations\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getCollations(refresh, path, parameters),
                { label: "System", path: "system" }
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/collations\/system\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getCollations(refresh, path, parameters)
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/datatypes\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getDataTypes(refresh, path, parameters),
                { label: "System", path: "system" }
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/datatypes\/system\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getDataTypes(refresh, path, parameters)
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/sequences\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getSequences(refresh, path, parameters),
                { label: "System", path: "system" }
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/sequences\/system\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getSequences(refresh, path, parameters)
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/schemas\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getSequences(refresh, path, parameters),
                { label: "System", path: "system" }
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/schemas\/system\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getSequences(refresh, path, parameters)
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/tables\/(?<tid>\d+)\/$/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                { label: "Columns", path: "columns" },
                { label: "Constraints", path: "constraints" },
                { label: "Indexes", path: "indexes" },
                { label: "Rules", path: "rules" },
                { label: "Triggers", path: "triggers" }
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/tables\/system\/(?<tid>\d+)\/$/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                { label: "Columns", path: "columns" },
                { label: "Constraints", path: "constraints" },
                { label: "Indexes", path: "indexes" },
                { label: "Rules", path: "rules" },
                { label: "Triggers", path: "triggers" }
            )
        },
        {
            pattern:
                /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/(?<obj>tables|views|materializedviews)\/(?<tid>\d+)\/columns\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getColumns(refresh, path, parameters)
            )
        },
        {
            pattern:
                /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/(?<obj>tables|views|materializedviews)\/system\/(?<tid>\d+)\/columns\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getColumns(refresh, path, parameters)
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/tables\/(?<tid>\d+)\/constraints\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getConstraints(refresh, path, parameters)
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/tables\/system\/(?<tid>\d+)\/constraints\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getConstraints(refresh, path, parameters)
            )
        },
        {
            pattern:
                /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/(?<obj>tables|materializedviews)\/(?<tid>\d+)\/indexes\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getIndexes(refresh, path, parameters)
            )
        },
        {
            pattern:
                /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/(?<obj>tables|materializedviews)\/system\/(?<tid>\d+)\/indexes\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getIndexes(refresh, path, parameters)
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/(?<obj>tables|views)\/(?<tid>\d+)\/rules\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getRules(refresh, path, parameters)
            )
        },
        {
            pattern:
                /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/(?<obj>tables|views)\/system\/(?<tid>\d+)\/rules\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getRules(refresh, path, parameters)
            )
        },
        {
            pattern:
                /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/(?<obj>tables|views)\/(?<tid>\d+)\/triggers\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getTriggers(refresh, path, parameters)
            )
        },
        {
            pattern:
                /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/(?<obj>tables|views)\/system\/(?<tid>\d+)\/triggers\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getTriggers(refresh, path, parameters)
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/views\/(?<vid>\d+\/$)/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                { label: "Columns", path: "columns" },
                { label: "Rules", path: "rules" },
                { label: "Triggers", path: "triggers" }
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/views\/system\/(?<vid>\d+\/$)/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                { label: "Columns", path: "columns" },
                { label: "Rules", path: "rules" },
                { label: "Triggers", path: "triggers" }
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/materializedviews\/(?<vid>\d+\/$)/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                { label: "Columns", path: "columns" },
                { label: "Indexes", path: "indexes" }
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/materializedviews\/system\/(?<vid>\d+\/$)/,
            target: new RoutingTarget(
                this.getDefaultNodes,
                { label: "Columns", path: "columns" },
                { label: "Indexes", path: "indexes" }
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/functions(\/system)\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getFunctions(refresh, path, parameters)
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/collations(\/system)\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getCollations(refresh, path, parameters)
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/datatypes(\/system)\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getDataTypes(refresh, path, parameters)
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/sequences(\/system)\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getSequences(refresh, path, parameters)
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/extensions\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getExtensions(refresh, path, parameters),
                { label: "System", path: "system" }
            )
        },
        {
            pattern: /^\/(?<db>databases|systemdatabases)\/(?<dbid>\d+)\/extensions\/system\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getExtensions(refresh, path, parameters)
            )
        },
        {
            pattern: /^\/roles\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getRoles(refresh, path, parameters)
            )
        },
        {
            pattern: /^\/tablespaces\/$/,
            target: new RoutingTarget(
                async (refresh, path, session, parameters) => await session.getTablespaces(refresh, path, parameters)
            )
        }
    ];

    private async getDefaultNodes(): Promise<NodeInfo[]> {
        return [];
    }
}
