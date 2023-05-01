import { Index } from ".";
import { NodeObject } from "../nodeObject";
import { TableScripter } from "../scripters/tableScripter";
import { CheckConstraint } from "./checkConstraint";
import { Column } from "./column";
import { ExclusionConstraint } from "./exclusionConstraint";
import { ForeignKeyConstraint } from "./foreignKeyConstraint";
import { IndexConstraint } from "./indexConstraint";
import { Rule } from "./rule";
import { Trigger } from "./trigger";

export class Table extends NodeObject {
    public static readonly scripter = new TableScripter();

    public readonly columns = this.addCollection(Column.scripter);

    public readonly checkConstraints = this.addCollection(CheckConstraint.scripter);

    public readonly exclusionConstraints = this.addCollection(ExclusionConstraint.scripter);

    public readonly foreignKeyConstraints = this.addCollection(ForeignKeyConstraint.scripter);

    public readonly indexConstraints = this.addCollection(IndexConstraint.scripter);

    public readonly indexes = this.addCollection(Index.scripter);

    public readonly rules = this.addCollection(Rule.scripter);

    public readonly triggers = this.addCollection(Trigger.scripter);

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

