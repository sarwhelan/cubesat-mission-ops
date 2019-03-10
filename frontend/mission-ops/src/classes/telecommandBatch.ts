export class TelecommandBatch {
    batchID: number;
    name: string;
    totalBandwidthUsage: number;
    totalPowerConsumption: number;

    constructor(name: string) {
        this.name = name;
    }
}