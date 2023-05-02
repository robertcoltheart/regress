import { NodeObject } from "../nodeObject";
import { RoleScripter } from "../scripters/roleScripter";

export class Role extends NodeObject {
    public static readonly scripter = new RoleScripter();

    constructor(parent: NodeObject, public id: string, public name: string, public canLogin: boolean) {
        super(parent);
    }
}
