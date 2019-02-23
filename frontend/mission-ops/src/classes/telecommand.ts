export class Telecommand {
    telecommandID: number;
    componentID : number;
    command: string;
    name: string;
    defaultPriorityLevel: boolean;
    bandwidthUsage: number;
    powerConsumption: number;

    constructor(id: number, name: string) {
        this.componentID = id;
        this.name = name;
    }
}