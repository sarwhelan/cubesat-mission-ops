export class Pass {
    passID: number;
    passHasOccurred: boolean;
    estimatedPassDateTime : Date;

    constructor(estimatedPassDateTime : Date) {
        this.passHasOccurred = false;
        this.estimatedPassDateTime = estimatedPassDateTime;
    }
}