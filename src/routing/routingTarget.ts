import { NodeInfo } from "azdata";
import { ExplorerSession } from "../session/explorerSession";
import { NodeGenerator } from "./nodeGenerator";

interface Folder {
    label: string,
    path: string
}

export class RoutingTarget {
    private arguments: Folder[]

    constructor(private generator: NodeGenerator, ...args: Folder[]) {
        this.arguments = args;
    }

    public async getNodes(refresh: boolean, path: string, session: ExplorerSession, parameters: RegExpMatchArray | null): Promise<NodeInfo[]> {
        const generatedNodes = await this.generator(refresh, path, session, parameters);

        return this.arguments
            .map(x => this.getNodeForFolder(x, path))
            .concat(generatedNodes);
    }

    private getNodeForFolder(folder: Folder, path: string): NodeInfo {
        if (path.endsWith('/')) {
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
