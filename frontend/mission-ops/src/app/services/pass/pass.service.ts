import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pass } from 'src/classes/pass';
import { HttpClient } from '@angular/common/http';
import { PassSum } from 'src/classes/pass-sum';
import { environment as env } from 'src/environments/environment';

/**
 * Service handling all {@link Pass} app server routing.
 */
@Injectable({
  providedIn: 'root'
})
export class PassService {
  
  /**
   * Route URL for passes.
   */
  private passesUrl = `${env.apiRouteBase}/passes`;

  /**
   * Creates a new instance of {@link PassService}.
   * @param http The HttpClient service.
   */
  constructor(private http: HttpClient) { }

  /**
   * Gets all {@link Pass} objects from the app server.
   */
  getPasses() : Observable<Pass[]>
  {
    return this.http.get<Pass[]>(this.passesUrl);
  }

  /**
   * Updates the given {@link Pass} in the 'passes' database table.
   * @param pass The updated {@link Pass} to save.
   */
  updatedPass(pass: Pass) : Observable<any>{
    return this.http.put(this.passesUrl + "/" + pass.passID, pass);
  }

  /**
   * Saves the given {@link Pass} in the 'passes' database table.
   * @param pass The new {@link Pass} to save.
   */
  createPass(pass: Pass)  : Observable<any>{
    return this.http.post(this.passesUrl, pass);
  }

  getPassTransmissionSums() : Observable<PassSum[]>{
    return this.http.get<PassSum[]>(`${this.passesUrl}/transmission-sum`);
  }

  getPassExecutionSums() : Observable<PassSum[]>{
    return this.http.get<PassSum[]>(`${this.passesUrl}/execution-sum`);
  }
}
