import { type NodeObject } from "./nodeObject";
import { type Resettable } from "./resettable";
import { type ScriptableNode } from "./scriptableNode";

export class NodeCollection<T extends NodeObject> implements Resettable {
    private items: T[] | undefined;

    constructor(private readonly parent: NodeObject, private readonly scripter: ScriptableNode<T>) {}

    public getAll(): T[] {
        if (this.items == null) {
            this.items = Array.from(this.scripter.getNodes(this.parent));
        }

        return this.items;
    }

    public get(id: string): T {
        const item = this.items?.find((x) => x.id === id);

        if (item == null) {
            throw Error("An item with the provided index does not exist");
        }

        return item;
    }

    public reset(): void {
        this.items = undefined;
    }
}
