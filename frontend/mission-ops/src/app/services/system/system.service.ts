import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { System } from 'src/classes/system';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  private systemUrl = `${env.apiRouteBase}/systems`;

  getSystems(): Observable<System[]>
  {
    console.log("getting systems in system service...");
    var systems = this.http.get<System[]>(this.systemUrl);
    console.log(systems);
    return systems;
  }

  createSystem(system: System): Observable<Number> 
  {
    return this.http.post<Number>(this.systemUrl, JSON.stringify(system), this.httpOptions);
  }

  updateSystem(system: System): Observable<Number>
  {
    return this.http.put<Number>(`${this.systemUrl}/${system.systemID}`, JSON.stringify(system), this.httpOptions);
  }

  removeSystem(system: System): Observable<System> 
  {
    return this.http.delete<System>(`${this.systemUrl}/${system.systemID}`);
  }
}
