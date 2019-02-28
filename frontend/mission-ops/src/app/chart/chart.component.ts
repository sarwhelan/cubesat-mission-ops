import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { TelemetryData } from '../../classes/telemetry-data';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  private _telemetryData: TelemetryData[];
  @Input()
  private get telemetryData() {
    return this._telemetryData;
  }
  private set telemetryData(val: TelemetryData[]) {
    this._telemetryData = val;
  }

  Highcharts = Highcharts;
  chartOptions: any;

  constructor() { }

  ngOnInit() {
    var values = this.telemetryData.map(x => x.telemetryValue);
    this.chartOptions = {
      series: [{
        type: 'line',
        data: values
      }]
    }
  }

}
