import { type NodeObject } from "./nodeObject";
import { type Resettable } from "./resettable";
import { type ScriptableNode } from "./scriptableNode";

export class NodeCollection<T extends NodeObject> implements Resettable {
    private items: T[] | undefined;

    constructor(private readonly parent: NodeObject, private readonly scripter: ScriptableNode<T>) {}

    public async getAll(): Promise<T[]> {
        return await this.load();
    }

    public async get(id: string): Promise<T> {
        const nodes = await this.load();

        const item = nodes.find((x) => x.id === id);

        if (item == null) {
            throw Error("An item with the provided index does not exist");
        }

        return item;
    }

    public reset(): void {
        this.items = undefined;
    }

    private async load(): Promise<T[]> {
        if (this.items == null) {
            this.items = await this.scripter.getNodes(this.parent);
        }

        return this.items;
    }
}
