export class CancellationToken {
    public cancelled: boolean = false;

    public cancel(): void {
        this.cancelled = true;
    }
}
