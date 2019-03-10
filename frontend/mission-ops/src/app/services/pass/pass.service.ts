import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pass } from '../../../classes/pass';
import { HttpClient } from '@angular/common/http';

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
  private passesUrl = "http://localhost:3000/passes"

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

  getPassTransmissionSums() : Observable<any>{
    return this.http.get(`${this.passesUrl}/transmission-sum`);
  }

  getPassExecutionSums() : Observable<any>{
    return this.http.get(`${this.passesUrl}/execution-sum`);
  }
}
