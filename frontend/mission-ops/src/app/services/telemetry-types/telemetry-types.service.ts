import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TelemetryType } from '../../../classes/telemetry-type';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TelemetryTypesService {

  constructor(private http: HttpClient) { }

  private telemetryTypeUrl = "http://localhost:3000/telemetry-types"

  getTelemetryTypes() : Observable<TelemetryType[]>
  {
    return this.http.get<TelemetryType[]>(this.telemetryTypeUrl);
  }

  createTelemetryType(telemetryType: TelemetryType) : Observable<TelemetryType>
  {
    return this.http.post<TelemetryType>(this.telemetryTypeUrl, telemetryType);
  }

  updateTelemetryType(telemetryType: TelemetryType) : Observable<any>
  {
    return this.http.put(`${this.telemetryTypeUrl}/${telemetryType.telemetryTypeID}`, telemetryType);
  }

  removeTelemetryType(telemetryType: TelemetryType) : Observable<any>
  {
    return this.http.delete(`${this.telemetryTypeUrl}/${telemetryType.telemetryTypeID}`);
  }
}
