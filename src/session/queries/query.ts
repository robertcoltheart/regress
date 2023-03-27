import { NodeInfo } from "azdata";
import { Client } from "pg";

export abstract class Query {
    abstract execute(client: Client, path: string): Promise<NodeInfo[]>;

    protected isSytem(path: string): boolean {
        return path.includes("/system/");
    }

    protected join(path: string, url: string, isFolder = false): string {
        let joined = `${this.trimPath(path)}/${url}`;

        if (isFolder) {
            joined = `${joined}/`;
        }

        return joined;
    }

    private trimPath(path: string): string {
        if (path.endsWith('/')) {
            return path.slice(0, -1);
        }

        return path;
    }
}
