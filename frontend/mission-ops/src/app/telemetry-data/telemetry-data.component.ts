import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
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

  @Input() dateRangeObj : any;

  @Input()
  private get componentTelemetry() {
    return this._componentTelemetry;
  }
  private set componentTelemetry(val: ComponentTelemetry) {
    this._componentTelemetry = val;
    this.getTelemetryData(this._componentTelemetry.componentTelemetryID);
  }

  telemetryData: TelemetryData[];
  telemetryValues: number[];
  telemetryTimes: string[];

  constructor(private telemetryDataService: ComponentTelemetryDataService) { }

  ngOnInit() {
    console.log('init telemetry data');
    this._componentTelemetry = this._componentTelemetry;
    this.getTelemetryData(this.componentTelemetry.componentTelemetryID);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dateRangeObj) {
      console.log('on change');
      this._componentTelemetry = this._componentTelemetry;
      this.getTelemetryData(this.componentTelemetry.componentTelemetryID);
    }
  }

  getTelemetryData(componentTelemetryID: number): void {
    console.log('get telemetry data from ' + componentTelemetryID);
    this.telemetryDataService.getTelemetryData(componentTelemetryID)
      .subscribe(telemetryData => {
        this.telemetryData = telemetryData;
        this.telemetryValues = this.telemetryData.map(x => x.telemetryValue);
        this.telemetryTimes = this.telemetryData.map(x => x.collectionDateTime.toString());
      });
  }
}
