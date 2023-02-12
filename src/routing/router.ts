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

// type RegExpGroups<T extends string[]> =
//   | (RegExpMatchArray & {
//       groups?:
//         | {
//             [name in T[number]]: string;
//           }
//         | {
//             [key: string]: string;
//           };
//     })
//   | null;

export type RegExpGroups<T extends string> =
  | (RegExpMatchArray & {
      groups?: { [name in T]: string } | { [key: string]: string };
    })
  | null;

export class Router {
    private l: {pattern: RegExp, target: RoutingTarget}[] = [
        {
            pattern: /^\/$/,
            target: new RoutingTarget(
                this.generator,
                { label: "Databases", path: "databases" },
                { label: "System Databases", path: "systemdatabases" })
        },
        {
            pattern: /^\/(?P<db>databases|systemdatabases)\/(?P<dbid>\d+)\/$/,
            target: new RoutingTarget(
                this.generator,
                { label: "Tables", path: "tables" },
                { label: "Views", path: "view" })
        }
    ];

    getRoutingTarget(nodePath: string): RoutingTarget | void {
        for (let item of this.l) {
            item.pattern.test(nodePath);
            const match: RegExpGroups<'db' | 'dbid'> = nodePath.match(item.pattern);
            const { db, dbid } = match?.groups!;
        }
    }

    private generator(): NodeInfo[] {
        return [];
    }
}
