export class ComponentTelemetry {
    componentTelemetryID: number;
    telemetryTypeID: number;
    componentID: number;
    name: string;
    upperBound: number;
    lowerBound: number;

    constructor(telemetryTypeID: number, 
                componentID: number,
                name: string,
                upperBound: number = null,
                lowerBound: number = null) {
        this.telemetryTypeID = telemetryTypeID;
        this.componentID = componentID;
        this.name = name;
        this.upperBound = upperBound;
        this.lowerBound = lowerBound;
    }
}