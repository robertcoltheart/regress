import { Token } from "./token";
import { type TokenState } from "./tokenState";

export class ActionContext {
    public match: RegExpExecArray | null = null;

    constructor(private readonly state: TokenState) {}

    public accept(type: string, value?: unknown): void {
        if (this.match == null) {
            throw Error("Match was null");
        }

        const token = new Token(type, value, this.match[0], this.state.position, this.state.line, this.state.column);

        this.state.pending.push(token);
    }
}
