import { NodeObject } from "../nodeObject";

export class Extension extends NodeObject {
    constructor(parent: NodeObject, public id: string, public name: string) {
        super(parent);
    }
}
