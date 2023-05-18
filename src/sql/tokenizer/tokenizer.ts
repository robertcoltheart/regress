import { type Action } from "./action";
import { ActionContext } from "./actionContext";
import { Rule } from "./rule";
import { Token } from "./token";
import { TokenState } from "./tokenState";

export class Tokenizer {
    private state: TokenState = new TokenState();

    private context: ActionContext;

    private input: string;

    private length: number;

    private readonly rules: Rule[] = [];

    constructor() {
        this.context = new ActionContext(this.state);

        this.input = "";
        this.length = 0;
    }

    public reset(): void {
        this.state = new TokenState();
        this.context = new ActionContext(this.state);

        this.input = "";
        this.length = 0;
    }

    public setInput(value: string): void {
        this.reset();

        this.input = value;
        this.length = value.length;
    }

    public rule(name: string, pattern: RegExp): void;
    public rule(name: string, pattern: RegExp, action?: Action | null): void {
        if (action === null) {
            action = (ctx, match) => {
                ctx.accept("", "");
            };
        }

        const rule = new Rule(name, action);
        rule.setPattern(pattern);

        this.rules.push(rule);
    }

    public token(): Token | null {
        if (this.state.pending.length === 0) {
            this.tokenize();
        }

        if (this.state.pending.length > 0) {
            const token = this.state.pending.shift();

            if (token !== undefined) {
                return token;
            }
        }

        return null;
    }

    public tokens(): Token[] {
        const result: Token[] = [];

        let token = this.token();

        while (token != null) {
            result.push(token);

            token = this.token();
        }

        return result;
    }

    private tokenize(): void {
        const finish = (): void => {
            if (!this.state.endOfFile) {
                this.state.endOfFile = true;

                this.state.pending.push(
                    new Token("EOF", "", "", this.state.position, this.state.line, this.state.column)
                );
            }
        };

        if (this.state.position >= this.length) {
            finish();

            return;
        }

        let continued = true;

        while (continued) {
            continued = false;

            for (let i = 0; i < this.rules.length; i++) {
                const rule = this.rules[i];

                rule.pattern.lastIndex = this.state.position;

                const found = rule.pattern.exec(this.input);

                if (found !== null && found.index === this.state.position) {
                    this.context.match = found;

                    rule.action.call(this.context, this.context, found, rule);

                    if (this.state.pending.length > 0) {
                        this.updateCursor(this.state.position, rule.pattern.lastIndex);
                        this.state.position = rule.pattern.lastIndex;

                        if (this.state.position >= this.length) {
                            finish();
                        }

                        return;
                    }

                    throw Error("Didn't accept");
                }
            }
        }

        throw Error("Token not recognized");
    }

    private updateCursor(from: number, until: number): void {
        const value = this.input;

        for (let i = from; i < until; i++) {
            const c = value.charAt(i);

            if (c === "\r") {
                this.state.column = 1;
            } else if (c === "\n") {
                this.state.line++;
                this.state.column = 1;
            } else if (c === "\t") {
                this.state.column += 8 - (this.state.column % 8);
            } else {
                this.state.column++;
            }
        }
    }
}
