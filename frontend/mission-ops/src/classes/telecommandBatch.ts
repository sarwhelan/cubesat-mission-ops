export class TelecommandBatch {
    id: number;
    // telecommands : PresetTelecommand;
    name: string;
    totalBandwidthUsage: number;
    totalPowerConsumption: number;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}