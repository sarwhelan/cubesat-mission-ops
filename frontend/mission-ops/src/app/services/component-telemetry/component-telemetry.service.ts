import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComponentTelemetry } from '../../../classes/component-telemetry';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ComponentTelemetryService {

  constructor(private http: HttpClient) { }

  private componentTelemetryUrl = "http://localhost:3000/component-telemetry";

  getComponentTelemetries(componentID: number) : Observable<ComponentTelemetry[]>
  {
    var getComponentUrl = this.componentTelemetryUrl + "/" + componentID;
    return this.http.get<ComponentTelemetry[]>(getComponentUrl);
  }
}