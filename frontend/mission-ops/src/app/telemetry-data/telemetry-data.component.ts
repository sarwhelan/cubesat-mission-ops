import { Component, OnInit, Input } from '@angular/core';
import { ComponentTelemetryDataService } from '../services/component-telemetry-data/component-telemetry-data.service';
import { TelemetryData } from '../../classes/telemetry-data';
import { ComponentTelemetry } from '../../classes/component-telemetry';

@Component({
  selector: 'app-telemetry-data',
  templateUrl: './telemetry-data.component.html',
  styleUrls: ['./telemetry-data.component.scss']
})
export class TelemetryDataComponent implements OnInit {

  private _componentTelemetry: ComponentTelemetry;

  @Input()
  private get componentTelemetry() {
    return this._componentTelemetry;
  }
  private set componentTelemetry(val: ComponentTelemetry) {
    this._componentTelemetry = val;
    this.getTelemetryData(this._componentTelemetry.componentTelemetryID);
  }

  telemetryData: TelemetryData[];

  constructor(private telemetryDataService: ComponentTelemetryDataService) { }

  ngOnInit() {
    console.log('init telemetry data');
    this._componentTelemetry = this._componentTelemetry;
    this.getTelemetryData(this.componentTelemetry.componentTelemetryID);
  }

  getTelemetryData(componentTelemetryID: number): void {
    console.log('get telemetry data from ' + componentTelemetryID);
    this.telemetryDataService.getTelemetryData(componentTelemetryID)
      .subscribe(telemetryData => this.telemetryData = telemetryData);
  }
}
