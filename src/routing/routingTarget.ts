import type * as azdata from "azdata";
import { type Folder } from "./folder";
import { type NodeGenerator } from "./nodeGenerator";
import { type ObjectExplorerSession } from "./objectExplorerSession";

export class RoutingTarget {
    private readonly arguments: Folder[];

    constructor(private readonly generator: NodeGenerator, ...args: Folder[]) {
        this.arguments = args;
    }

    public async getNodes(
        refresh: boolean,
        path: string,
        session: ObjectExplorerSession,
        parameters: RegExpMatchArray | null
    ): Promise<azdata.NodeInfo[]> {
        const generatedNodes = await this.generator(refresh, path, session, parameters);

        return this.arguments.map((x) => this.getNodeForFolder(x, path)).concat(generatedNodes);
    }

    private getNodeForFolder(folder: Folder, path: string): azdata.NodeInfo {
        if (path.endsWith("/")) {
            path = path.slice(0, -1);
        }

        return {
            isLeaf: false,
            label: folder.label,
            nodePath: `${path}/${folder.path}/`,
            nodeType: "Folder"
        };
    }
}
