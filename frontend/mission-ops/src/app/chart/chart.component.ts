import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';

NoDataToDisplay(Highcharts);

/**
 * A component for populating and displaying a Highcharts chart
 * with telemetry data.
 * 
 * @class ChartComponent
 */
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})

export class ChartComponent implements OnInit {

  private _values: number[];
  private _minValue: number;
  private _maxValue: number;
  private _title: string;
  private _xAxis: string;
  private _yAxis: string;
  private _name: string;
  private _labels: string[];

  /**
   * The start date of the values to be populated.
   */
  @Input() startDate: Date;

  /**
   * The end date of the values to be populated.
   */
  @Input() endDate: Date;

  /**
   * The data points in the chart.
   * 
   * @memberof ChartComponent
   */
  @Input()
  private get values() {
    return this._values;
  }
  private set values(val: number[]) {
    this._values = val;
  }

  /**
   * The minimum value allowed; the lower bound.
   * This can be null depending on the component telemetry.
   * 
   * @memberof ChartComponent
   */
  @Input()
  private get minValue() {
    return this._minValue;
  }
  private set minValue(val: number) {
    this._minValue = val;
  }

  /**
   * The maximum value allowed; the upper bound.
   * This can be null depending on the component telemetry.
   * 
   * @memberof ChartComponent
   */
  @Input()
  private get maxValue() {
    return this._maxValue;
  }
  private set maxValue(val: number) {
    this._maxValue = val;
  }

  /**
   * The title of the graph.
   * 
   * @memberof ChartComponent
   */
  @Input()
  private get title() {
    return this._title;
  }
  private set title(val: string) {
    this._title = val;
  }

  /**
   * The name of the series.
   * 
   * @memberof ChartComponent
   */
  @Input()
  private get name() {
    return this._name;
  }
  private set name(val: string) {
    this._name = val;
  }

  /**
   * The x-axis label.
   * 
   * @memberof ChartComponent
   */
  @Input()
  private get xAxis() {
    return this._xAxis;
  }
  private set xAxis(val: string) {
    this._xAxis = val;
  }

  /**
   * The y-axis label.
   * 
   * @memberof ChartComponent
   */
  @Input()
  private get yAxis() {
    return this._yAxis;
  }
  private set yAxis(val: string) {
    this._yAxis = val;
  }

  /**
   * The x-axis data labels to display.
   * 
   * @memberof ChartComponent
   */
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
    this.buildChart();
}

ngOnChanges(changes: SimpleChanges) {
  // If the change includes a change in the values collection and the graph exists with a
  // valid start and end date, rebuild the graph.
  if (changes.values && this.Highcharts && this.Highcharts.charts.length > 0 && this.startDate && this.endDate) {
    this.buildChart();
  }
}

/**
 * Builds the graph using the Input values listed above.
 * 
 * @memberof ChartComponent
 */
buildChart() : void
{
  // Map the time labels to the Date value.
  var msLabels = this.labels.map(x => new Date(x).getTime());
  
  // Create lines for the min and max values.
  var maxValues = new Array(this.values.length).fill(this.maxValue);
  var minValues = new Array(this.values.length).fill(this.minValue);
  var zones;

  // If it has a max value, create the zones that
  // will highlight a value outside the allowed range.
  if (this.maxValue) {
    zones = [{
      value: this.minValue,
      color: '#FF0000',
    }, {
      value: this.maxValue,
    }, {
      color: '#FF0000',
    }];
  } else {
    zones = [];
  }

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
        format: '{value:%Y-%m-%d %H:%M:%S}',
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
        // On hover, displays the datetime and the value of the data point.
        return new Date(this.x).toUTCString() + "<br/>" + this.y;
      }
    },
    series: [{
      name: this.name,
      type: 'line',
      showInLegend: false,
      data: this.values,
      zones: zones,
      animation: {
        duration: 1000,
      }
    }, {
      name: "Max Value",
      type: 'line',
      showInLegend: false,
      data: maxValues,
      color: "#ff0000",
      marker: {enabled: false},
      states: { hover: { enabled: false } },
    }, {
      name: "Min Value",
      type: 'line',
      showInLegend: false,
      data: minValues,
      color: "#ff0000",
      marker: {enabled: false},
      states: { hover: { enabled: false } },
    }],
    lang: {
      noData: "No data to display."
    },
    noData: {
        style: {
            fontWeight: 'bold',
            fontSize: '15px',
            color: '#303030'
        }
    }
  }
}

}
