import { NodeInfo } from "azdata";

type NodeGenerator = (refresh: boolean) => NodeInfo[];

export class RoutingTarget {
    constructor(generator: NodeGenerator, ...args: Folder[]) {

    }
}

export interface Folder {
    label: string,
    path: string
}



export class Router {
    private l: {pattern: RegExp, target: RoutingTarget}[] = [
        {pattern: /./, target: new RoutingTarget(this.generator)}
    ];

    private map: Map<string, RoutingTarget> = new Map([
        [
            "^/$", 
            new RoutingTarget(
                this.generator,
                { label: "Databases", path: "databases" },
                { label: "System Databases", path: "systemdatabases" })
        ],
        [
            "^/(?P<db>databases|systemdatabases)/(?P<dbid>\d+)/$",
            new RoutingTarget(
                this.generator,
                { label: "Tables", path: "tables" },
                { label: "Views", path: "view" }
            )
        ]
    ]);

    getRoutingTarget(nodePath: string): RoutingTarget | void {
        for (let item of this.l) {
            item.pattern.test(nodePath);
            let matches = nodePath.match(item.pattern);
        }
    }

    private generator(): NodeInfo[] {
        return [];
    }
}
