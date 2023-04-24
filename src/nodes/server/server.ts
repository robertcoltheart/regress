import { Database } from "../database/database";
import { NodeCollection } from "../nodeCollection";
import { Refreshable } from "../refreshable";

export class Server {
    public databases: NodeCollection<Database>;

    private children: Map<string, Refreshable>;

    constructor() {
        this.children = new Map<string, Refreshable>();

        this.databases = new NodeCollection<Database>(() => )
    }

    public refresh(): void {
        for (const item of this.children.values()) {
            item.refresh();
        }
    }
}
