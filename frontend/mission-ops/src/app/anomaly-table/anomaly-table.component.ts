import { Component, OnInit } from '@angular/core';
import { AnomaliesService } from '../services/anomalies/anomalies.service';
import { Anomaly } from '../../classes/anomaly';
const dateFormat = require('dateformat');

@Component({
  selector: 'app-anomaly-table',
  templateUrl: './anomaly-table.component.html',
  styleUrls: ['./anomaly-table.component.scss']
})
export class AnomalyTableComponent implements OnInit {

  constructor(private anomService: AnomaliesService) { }

  anomalies: Anomaly[];
  collectionSize: number;

  ngOnInit() {
    this.getAnomalies();
  }

  getFormatedDate(unformatedDate: Date)
  {
    return dateFormat(unformatedDate, "dddd, mmmm dS, yyyy, HH:MM:ss");
  }

  getAnomalies() {
    this.anomService.getAnomalies().subscribe(anoms => {
      this.anomalies = anoms;
      this.collectionSize = this.anomalies.length;
    })
  }

}
