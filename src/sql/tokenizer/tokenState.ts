import { type Token } from "./token";

export class TokenState {
    public position: number = 0;

    public line: number = 1;

    public column: number = 1;

    public pending: Token[] = [];

    public endOfFile: boolean = false;
}
