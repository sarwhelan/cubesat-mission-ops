export class TelecommandBatch {
    batchID: number;
    name: string;
    totalBandwidthUsage: number;
    totalPowerConsumption: number;

    constructor(id: number, name: string) {
        this.batchID = id;
        this.name = name;
    }
}