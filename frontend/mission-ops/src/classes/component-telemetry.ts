export class ComponentTelemetry {
    componentTelemetryID: number;
    telemetryTypeID: number;
    componentID: number;

    constructor(telemetryTypeID: number, componentID: number) {
        this.telemetryTypeID = telemetryTypeID;
        this.componentID = componentID;
    }
}