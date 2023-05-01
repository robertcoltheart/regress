import { NodeObject } from "../nodeObject";

export class Collation extends NodeObject {
    constructor(
        parent: NodeObject,
        public id: string,
        public name: string,
        public schema: string,
        public isSystem: boolean
    ) {
        super(parent);
    }
}
