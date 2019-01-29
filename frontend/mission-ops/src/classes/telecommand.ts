export class Telecommand {
    id: number;
    // component : Component;
    command: string;
    name: string;
    defaultPriorityLevel: boolean;
    bandwidthUsage: number;
    powerConsumption: number;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}