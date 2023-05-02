import { Parser } from "node-sql-parser";
import { Batch } from "./batch";

export class Query {
    public batches: Batch[] = [];

    constructor(public ownerUri: string, public queryText: string) {
        const parser = new Parser();
        const ast = parser.astify(queryText, { database: "PostgresQL" });

        const astArray = Array.of(ast);

        for (let i = 0; i < astArray.length; i++) {
            const batch = new Batch(parser.exprToSQL(astArray[i]), i);

            this.batches.push(batch);
        }
    }
}
