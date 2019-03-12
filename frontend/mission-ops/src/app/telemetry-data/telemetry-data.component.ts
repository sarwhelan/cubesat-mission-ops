import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ComponentTelemetryDataService } from '../services/component-telemetry-data/component-telemetry-data.service';
import { TelemetryData } from '../../classes/telemetry-data';
import { ComponentTelemetry } from '../../classes/component-telemetry';
import { TelemetryType } from 'src/classes/telemetry-type';

@Component({
  selector: 'app-telemetry-data',
  templateUrl: './telemetry-data.component.html',
  styleUrls: ['./telemetry-data.component.scss']
})
export class TelemetryDataComponent implements OnInit {

  private _componentTelemetry: ComponentTelemetry;

  @Input() dateRangeObj : any;
  @Input() telemetryTypes : TelemetryType[];
  private startDate: Date;
  private endDate: Date;

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
  telemetryTypeUnit: string;

  constructor(private telemetryDataService: ComponentTelemetryDataService) { }

  ngOnInit() {
    console.log('init telemetry data');
    this._componentTelemetry = this._componentTelemetry;
    var telemetryType = this.telemetryTypes.find(x => x.telemetryTypeID == this.componentTelemetry.telemetryTypeID);
    this.telemetryTypeUnit = `${telemetryType.name} (${telemetryType.telemetryUnit})`;
    this.getTelemetryData(this.componentTelemetry.componentTelemetryID);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dateRangeObj) {
      console.log('on change', this.dateRangeObj);
      this._componentTelemetry = this._componentTelemetry;
      this.getTelemetryData(this.componentTelemetry.componentTelemetryID);
    }
  }

  getTelemetryData(componentTelemetryID: number): void {
    console.log('get telemetry data from ' + componentTelemetryID);
    console.log(this.dateRangeObj);
    this.startDate = new Date(Date.UTC(
      this.dateRangeObj.startDate.year,
      this.dateRangeObj.startDate.month-1,
      this.dateRangeObj.startDate.day,
      this.dateRangeObj.startTime.hour,
      this.dateRangeObj.startTime.minute,
      this.dateRangeObj.startTime.second,
      ));
    this.endDate = new Date(Date.UTC(
      this.dateRangeObj.endDate.year,
      this.dateRangeObj.endDate.month-1,
      this.dateRangeObj.endDate.day,
      this.dateRangeObj.endTime.hour,
      this.dateRangeObj.endTime.minute,
      this.dateRangeObj.endTime.second,
      ));
    this.telemetryDataService.getTelemetryDataBetween(componentTelemetryID, this.startDate, this.endDate)
      .subscribe(telemetryData => {
        this.telemetryData = telemetryData;
        this.telemetryValues = this.telemetryData.map(x => x.telemetryValue);
        this.telemetryTimes = this.telemetryData.map(x => x.collectionDateTime.toString());
      });
  }
}
