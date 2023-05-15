enum Door {
    Open = "open",
    Closed = "closed",
    Ajar = "ajar" // half open, half closed
}

enum DoorFrame {
    Missing = "noDoor"
}

type DoorState = Door | DoorFrame;

enum Text {
}

type TokenType =

export class Lexer {
    private readonly state: DoorState;

    constructor() {
        this.state = Door.Ajar;
    }
}
