import { NodeObject } from "../nodeObject";

export class Tablespace extends NodeObject {
    constructor(parent: NodeObject, public id: string, public name: string) {
        super(parent);
    }
}
