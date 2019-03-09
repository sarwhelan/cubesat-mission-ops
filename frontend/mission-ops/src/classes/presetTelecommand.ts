export class PresetTelecommand {
    presetTelecommandID: number;
    telecommandID : number;
    batchID: number;
    commandParameters: string;
    priorityLevel: boolean;
    relativeExecutionTime: Date;
    name: string;

    constructor(telecommandID: number, batchID: number) {
        this.telecommandID = telecommandID;
        this.batchID = batchID;
    }
}