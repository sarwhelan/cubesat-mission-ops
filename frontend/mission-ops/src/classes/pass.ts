export class Pass {
    passID: number;
    passHasOccurred: boolean;
    estimatedPassDateTime : Date;
    actualPassDateTime: Date;
    availablePower: number;
    availableBandwidth: number;

    constructor(estimatedPassDateTime : Date, availablePower: number, availableBandwidth: number) {
        this.passHasOccurred = false;
        this.estimatedPassDateTime = estimatedPassDateTime;
        this.availablePower = availablePower;
        this.availableBandwidth = availableBandwidth;
    }
}