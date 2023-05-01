import { NodeObject } from "../nodeObject";

export class DataType extends NodeObject {
    constructor(parent: NodeObject, public id: string, public name: string) {
        super(parent);
    }
}
