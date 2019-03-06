import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { System } from '../../../classes/system';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  constructor(private http: HttpClient) { }

  private systemUrl = "http://localhost:3000/systems";

  getSystems(): Observable<System[]>
  {
    return this.http.get<System[]>(this.systemUrl);
  }

  createSystem(system: System): Observable<System> 
  {
    return this.http.post<System>(this.systemUrl, system);
  }

  updateSystem(system: System): Observable<System>
  {
    return this.http.put<System>(this.systemUrl, system);
  }

  removeSystem(system: System): Observable<System> 
  {
    return this.http.delete<System>(`${this.systemUrl}/${system.systemID}`);
  }
}
