import { type NodeObject } from "./nodeObject";

export interface ScriptableNode<T extends NodeObject> {
    getNodes: (node: NodeObject) => IterableIterator<T>;
}
