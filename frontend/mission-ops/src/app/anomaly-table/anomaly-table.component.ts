import { Component, ViewChildren, QueryList } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
const dateFormat = require('dateformat');

import { AnomaliesService } from 'src/app/services/anomalies/anomalies.service';
import { Anomaly } from 'src/classes/anomaly';
import { SortableDirective, SortEvent } from 'src/app/services/anomalies/sortable.directive';

@Component({
  selector: 'app-anomaly-table',
  templateUrl: './anomaly-table.component.html',
  styleUrls: ['./anomaly-table.component.scss'],
  providers: [AnomaliesService, DecimalPipe]
})
export class AnomalyTableComponent {
  anomalies$: Observable<Anomaly[]>;
  total$: Observable<number>;

  @ViewChildren(SortableDirective) headers: QueryList<SortableDirective>;

  constructor(public service: AnomaliesService) {
    this.anomalies$ = service.anomalies$;
    this.total$ = service.total$;
  }

  onSort({column, direction}: SortEvent) {

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  getFormattedDate(unformattedDate: Date)
  {
    return dateFormat(unformattedDate, "dddd, mmmm dS, yyyy, HH:MM:ss");
  }
}
