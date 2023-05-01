import { type Client } from "pg";
import { type Resettable } from "./resettable";
import { Server } from "./objects/server";
import { type ScriptableNode } from "./scriptableNode";
import { NodeCollection } from "./nodeCollection";

export abstract class NodeObject {
    private readonly collections: Resettable[] = [];

    public abstract id: string;

    public abstract name: string;

    constructor(private readonly parent?: NodeObject) {}

    protected addCollection<T extends NodeObject>(scripter: ScriptableNode<T>): NodeCollection<T> {
        const collection = new NodeCollection<T>(this, scripter);

        this.collections.push(collection);

        return collection;
    }

    protected registerCollection(collection: Resettable): void {
        this.collections.push(collection);
    }

    public refresh(): void {
        for (const collection of this.collections) {
            collection.reset();
        }
    }

    public async getConnection(): Promise<Client> {
        if (this.parent == null) {
            throw new Error("Cannot find connection in hierarchy");
        }

        return await this.parent.getConnection();
    }

    public getServer(): Server {
        if (this instanceof Server) {
            return this;
        }

        if (this.parent == null) {
            throw Error("Cannot find server node in hierarchy");
        }

        return this.parent.getServer();
    }
}
