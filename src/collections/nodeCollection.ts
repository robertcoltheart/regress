export class NodeCollection<T> {
    private items: T[] | null;

    constructor()

    public getItems(): T[] {
        return this.items;
    }

    public reset() {
        this.items = null;
    }
}
