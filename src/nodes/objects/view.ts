import { NodeObject } from "../nodeObject";

export class View extends NodeObject {
    constructor(parent: NodeObject, public id: string, public name: string) {
        super(parent);
    }
}
