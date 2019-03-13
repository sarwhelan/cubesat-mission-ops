export class TelemetryType {
    telemetryTypeID: number;
    telemetryUnit: string;
    name: string;
    hasBounds: boolean;

    constructor(telemetryUnit: string, name: string){
        this.telemetryUnit = telemetryUnit;
        this.name = name;
        this.hasBounds = true;
    }
}