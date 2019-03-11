import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PassLimit } from '../../../classes/pass-limit';
import { HttpClient } from '@angular/common/http';

/**
 * Service handling all {@link PassLimit} app server routing.
 */
@Injectable({
  providedIn: 'root'
})
export class PassLimitService {

  /**
   * Route URL for pass limits.
   */
  private passLimitsUrl = "http://localhost:3000/pass-limits";

  /**
   * Creates a new instance of {@link PassLimitService}.
   * @param http The HttpClient service.
   */
  constructor(private http: HttpClient) { }

  /**
   * Gets all {@link PassLimit} objects from the app server.
   */
  getPassLimits() : Observable<PassLimit[]>
  {
    return this.http.get<PassLimit[]>(this.passLimitsUrl);
  }

  /**
   * Updates the given {@link PassLimit} in the 'passLimits' database table.
   * @param passLimit The updated {@link PassLimit} to save.
   */
  updatedPassLimit(passLimit: PassLimit) : Observable<any>{
    return this.http.put(`${this.passLimitsUrl}/${passLimit.limitID}`, passLimit);
  }

  /**
   * Saves the given {@link PassLimit} in the 'passLimits' database table.
   * @param passLimit The new {@link PassLimit} to save.
   */
  createPassLimit(passLimit: PassLimit)  : Observable<any>{
    return this.http.post(this.passLimitsUrl, passLimit);
  }
}
