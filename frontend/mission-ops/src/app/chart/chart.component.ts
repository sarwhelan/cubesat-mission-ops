import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})

export class ChartComponent implements OnInit {

  private _values: number[];
  private _title: string;
  private _xAxis: string;
  private _yAxis: string;
  private _name: string;
  private _labels: string[];

  @Input()
  private get values() {
    return this._values;
  }
  private set values(val: number[]) {
    this._values = val;
  }

  @Input()
  private get title() {
    return this._title;
  }
  private set title(val: string) {
    this._title = val;
  }

  @Input()
  private get name() {
    return this._name;
  }
  private set name(val: string) {
    this._name = val;
  }

  @Input()
  private get xAxis() {
    return this._xAxis;
  }
  private set xAxis(val: string) {
    this._xAxis = val;
  }

  // TODO: Set y-axis using telemetryType table info.
  @Input()
  private get yAxis() {
    return this._yAxis;
  }
  private set yAxis(val: string) {
    this._yAxis = val;
  }

  @Input()
  private get labels() {
    return this._labels;
  }
  private set labels(val: string[]) {
    this._labels = val;
  }

  Highcharts = Highcharts;
  chartOptions: any;

  constructor() { }

  ngOnInit() {
    var msLabels = this.labels.map(x => new Date(x).getTime());
    this.chartOptions = {
      title: {
        text: this.title
      },
      xAxis: {
        title: {
          text: this.xAxis
        },
        categories: msLabels,
        type: 'datetime',
        labels: {
          format: '{value:%Y-%m-%d}',
        }
      },
      yAxis: {
        title: {
          text: this.yAxis
        }
      },
      tooltip: {
        crosshairs: [true],
        formatter: function(){
          return new Date(this.x).toUTCString() + "<br/>" + this.y;
        }
      },
      series: [{
        name: this.name,
        type: 'line',
        showInLegend: false,
        data: this.values,
      }]
    }
}

}
