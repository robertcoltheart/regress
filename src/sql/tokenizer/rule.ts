import { type Action } from "./action";

export class Rule {
    public pattern!: RegExp;

    constructor(public name: string, public action: Action) {}

    public setPattern(pattern: RegExp): void {
        let flags = "g";

        try {
            const regexp = /(?:)/y;

            if (typeof regexp.sticky === "boolean") {
                flags = "y";
            }
        } catch (ex) {}

        if (typeof pattern.multiline === "boolean" && pattern.multiline) {
            flags += "m";
        }

        if (typeof pattern.dotAll === "boolean" && pattern.dotAll) {
            flags += "s";
        }

        if (typeof pattern.ignoreCase === "boolean" && pattern.ignoreCase) {
            flags += "i";
        }

        if (typeof pattern.unicode === "boolean" && pattern.unicode) {
            flags += "u";
        }

        this.pattern = new RegExp(pattern.source, flags);
    }
}
