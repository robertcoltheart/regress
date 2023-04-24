import { NodeItem } from "./nodeItem";
import { Refreshable } from "./refreshable";

export class NodeCollection<T extends NodeItem> implements Refreshable {
    private items: T[] | undefined;

    constructor(private generator: () => T[]) {}

    public getItems(): T[] {
        if (!this.items) {
            this.items = this.generator();
        }

        return this.items;
    }

    public getItem(id: string): T | undefined {
        return this.items?.find(x => x.oid == id);
    }

    public refresh() {
        this.items = undefined;
    }
}
