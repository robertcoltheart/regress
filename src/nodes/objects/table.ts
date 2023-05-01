import { NodeObject } from "../nodeObject";
import { TableScripter } from "./tableScripter";

export class Table extends NodeObject {
    public static readonly scripter = new TableScripter();

    schema: string = "";

    constructor(public id: string, public name: string) {
        super();
    }
}
