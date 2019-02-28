import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  Highcharts = Highcharts;
  chartOptions = {
    series: [{
      data: [1, 2, 3]
    }]
  };
  constructor() { }

  ngOnInit() {
  }

}
