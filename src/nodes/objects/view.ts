import { NodeObject } from "../nodeObject";
import { ViewScripter } from "../scripters/viewScripter";

export class View extends NodeObject {
    public static readonly scripter = new ViewScripter();

    constructor(
        parent: NodeObject,
        public id: string,
        public name: string,
        public schema: string,
        public schemaId: string,
        public isSystem: boolean
    ) {
        super(parent);
    }
}
