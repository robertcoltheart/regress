import { NodeInfo } from "azdata";
import { Client } from "pg";

export abstract class Query {
    abstract execute(client: Client, path: string): Promise<NodeInfo[]>;

    protected isSytem(path: string): boolean {
        return path.includes("/system/");
    }
}
