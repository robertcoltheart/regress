export class Token {
    constructor(
        public type: string,
        public value: unknown,
        public text: string,
        public position: number = 0,
        public line: number = 0,
        public column: number = 0
    ) {}

    public isA(type: string, value?: unknown): boolean {
        if (type !== this.type) {
            return false;
        }

        if (value != null && value !== this.value) {
            return false;
        }

        return true;
    }
}
