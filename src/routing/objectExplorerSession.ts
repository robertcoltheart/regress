import { type NodeInfo } from "azdata";

export class ObjectExplorerSession {
    public cache = new Map<string, NodeInfo>();
}
