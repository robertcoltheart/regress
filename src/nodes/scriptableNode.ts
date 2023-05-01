import { type NodeObject } from "./nodeObject";

export interface ScriptableNode<T extends NodeObject> {
    getNodes: (parent: NodeObject) => Promise<T[]>;
}
