import { type Resettable } from "./resettable";

export abstract class NodeObject {
    private readonly childCollections: Resettable[] = [];

    public abstract id: string;

    public abstract name: string;

    protected registerChildCollection(collection: Resettable): void {
        this.childCollections.push(collection);
    }

    public refresh(): void {
        for (const collection of this.childCollections) {
            collection.reset();
        }
    }
}
