import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComponentTelemetry } from 'src/classes/component-telemetry';
import { HttpClient } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';

/**
 * Service handling all {@link ComponentTelemetry} app server routing.
 */
@Injectable({
  providedIn: 'root'
})
export class ComponentTelemetryService {

  /**
   * Creates a new instance of {@link ComponentTelemetryService}.
   * @param http The HttpClient service.
   */
  constructor(private http: HttpClient) { }

  /**
   * Route URL for component telemetries.
   */
  private componentTelemetryUrl = `${env.apiRouteBase}/component-telemetry`;

  /**
   * Gets all {@link ComponentTelemetry} objects associated with the given {@link Component}
   * ID.
   * @param componentID The ID of the {@link Component}.
   */
  getComponentTelemetries(componentID: number) : Observable<ComponentTelemetry[]>
  {
    var getComponentUrl = this.componentTelemetryUrl + "/" + componentID;
    return this.http.get<ComponentTelemetry[]>(getComponentUrl);
  }

  getComponentTelemetryWithType(telemetryTypeID: number) : Observable<ComponentTelemetry[]>
  {
    const params = {
      'telemetryTypeID': telemetryTypeID.toString()
    }
    return this.http.get<ComponentTelemetry[]>(this.componentTelemetryUrl, { params: params });
  }

  /**
   * Saves the given {@link ComponentTelemetry} in the 'componentTelemetry' database 
   * table.
   * @param componentTelemetry The new {@link ComponentTelemetry} to save.
   */
  createComponentTelemetry(componentTelemetry: ComponentTelemetry) : Observable<Number>
  {
    return this.http.post<Number>(this.componentTelemetryUrl, componentTelemetry);
  }

  /**
   * Updates the given {@link ComponentTelemetry} in the 'componentTelemetry' database 
   * table.
   * @param componentTelemetry The updated {@link ComponentTelemetry} to save.
   */
  updateComponentTelemetry(componentTelemetry: ComponentTelemetry) : Observable<Number>
  {
    return this.http.put<Number>(`${this.componentTelemetryUrl}/${componentTelemetry.componentTelemetryID}`, componentTelemetry);
  }

  /**
   * Removes the given {@link ComponentTelemetry} from the 'componentTelemetry' database 
   * table.
   * @param componentTelemetry The {@link ComponentTelemetry} to remove.
   */
  removeComponentTelemetry(componentTelemetry: ComponentTelemetry) : Observable<ComponentTelemetry>
  {
    return this.http.delete<ComponentTelemetry>(`${this.componentTelemetryUrl}/${componentTelemetry.componentTelemetryID}`);
  }
}
