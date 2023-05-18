import assert from "assert";
import { Tokenizer } from "./tokenizer/tokenizer";

export class Lexer {
    private readonly tokenizer: Tokenizer;

    private readonly map: Record<string, string> = {
        SELECT: "a",
        ABC: "d"
    };

    private readonly commonKeywords = new Map<string, string>([
        ["SELECT", "Keyword_DML"],
        ["INSERT", "Keyword_DML"],
        ["DELETE", "Keyword_DML"],
        ["UPDATE", "Keyword_DML"]
    ]);

    constructor() {
        this.tokenizer = new Tokenizer();

        this.tokenizer.rule("Comment_Single_Hint", /(--|# )\+.*?(\r\n|\r|\n|$)/iu, (context, match) => {
            context.accept("comment");
        });

        this.tokenizer.rule("Comment_Multiline_Hint", /\*\+[\s\S]*?\*/iu, (context, match) => {
            context.accept("comment");
        });

        this.tokenizer.rule("Whitespace", /\s+?/iu, (context, match) => {
            context.accept("whitespace");
        });

        this.tokenizer.rule("Wildcard", /\*/iu, (context, match) => {
            context.accept("wildcard");
        });

        this.tokenizer.rule("Keyword", /(CASE|IN|VALUES|USING|FROM|AS)\b/iu, (context, match) => {
            context.accept("keyword");
        });

        this.tokenizer.rule("Keyword", /\w[$#\w]*/iu, (context, match) => {
            const keyword = match[0].toUpperCase();

            context.accept("Keyword", keyword);
        });
    }

    public split(value: string): void {
        this.tokenizer.setInput(value);

        const tokens = this.tokenizer.tokens();

        assert(tokens !== null);
    }
}
