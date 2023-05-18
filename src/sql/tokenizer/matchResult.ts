export class MatchResult {
    public matched: boolean;

    public input?: string;

    public index?: number;

    public result: string[] = [];

    public length: number;

    public map: string[]["map"];

    public find: string[]["find"];

    public filter: string[]["filter"];

    public includes: string[]["includes"];

    constructor(execArray: RegExpExecArray | null) {
        this.matched = execArray !== null;

        if (execArray !== null) {
            this.input = execArray.input;
            this.index = execArray.index;

            Object.entries(execArray).forEach(([key, value]) => {
                if (key !== "groups" && key !== "input" && key !== "index") {
                    this.result.push(value);
                }
            });
        }

        this.map = this.result.map;
        this.find = this.result.find;
        this.filter = this.result.filter;
        this.includes = this.result.includes;
        this.length = this.result.length;
    }
}
