import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TelemetryData } from '../../../classes/telemetry-data';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ComponentTelemetryDataService {

  constructor(private http: HttpClient) { }

  private telemetryDataUrl = "http://localhost:3000/telemetry-data";

  getTelemetryData(componentTelemetryID: number): Observable<TelemetryData[]> {
    var getTelemetryDataUrl = this.telemetryDataUrl + "/" + componentTelemetryID;
    return this.http.get<TelemetryData[]>(getTelemetryDataUrl);
  }
}
