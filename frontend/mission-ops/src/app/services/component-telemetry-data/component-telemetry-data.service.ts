import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TelemetryData } from 'src/classes/telemetry-data';
import { HttpClient } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComponentTelemetryDataService {

  constructor(private http: HttpClient) { }

  private telemetryDataUrl = `${env.apiRouteBase}/telemetry-data`;

  getTelemetryData(componentTelemetryID: number): Observable<TelemetryData[]> {
    var getTelemetryDataUrl = this.telemetryDataUrl + "/" + componentTelemetryID;
    return this.http.get<TelemetryData[]>(getTelemetryDataUrl);
  }

  getTelemetryDataBetween(componentTelemetryID: number, startDate: Date, endDate: Date) : Observable<TelemetryData[]>
  {
    const params = {
      'startDate': startDate.getTime().toString(),
      'endDate': endDate.getTime().toString(),
    }
    console.log(params, `${this.telemetryDataUrl}/${componentTelemetryID}`);

    return this.http.get<TelemetryData[]>(`${this.telemetryDataUrl}/${componentTelemetryID}`, {params: params});
  }
}
