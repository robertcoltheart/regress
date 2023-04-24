export class NodeObject {
    public parent: NodeObject;
    
    protected getNodesForParent(): NodeObject[] {
        return [];
    }
}