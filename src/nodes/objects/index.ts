import { NodeObject } from "../nodeObject";
import { IndexScripter } from "./indexScripter";

export class Index extends NodeObject {
    public static readonly scripter = new IndexScripter();

    constructor(parent: NodeObject, public id: string, public name: string) {
        super(parent);
    }
}
