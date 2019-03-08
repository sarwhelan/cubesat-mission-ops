export class Pass {
    passID: number;
    passHasOccured: boolean;
    estimatedPassDateTime : Date;

    constructor(estimatedPassDateTime) {
        this.passHasOccured = false;
        this.estimatedPassDateTime = estimatedPassDateTime;
    }
}