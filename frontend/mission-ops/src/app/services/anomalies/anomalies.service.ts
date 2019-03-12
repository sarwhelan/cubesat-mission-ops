import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Anomaly } from '../../../classes/anomaly';

@Injectable({
  providedIn: 'root'
})
export class AnomaliesService {

  constructor(private http: HttpClient) { }

  private systemUrl = "http://localhost:3000/anomalies";

  getAnomalies(): Observable<Anomaly[]>
  {
    return this.http.get<Anomaly[]>(this.systemUrl);
  }
}
