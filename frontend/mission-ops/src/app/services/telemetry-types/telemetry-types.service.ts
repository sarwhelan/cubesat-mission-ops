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
}
