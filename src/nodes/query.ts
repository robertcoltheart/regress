export class Query {
    protected isSytem(path: string): boolean {
        return path.includes("/system/");
    }
}