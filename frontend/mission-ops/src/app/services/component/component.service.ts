import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Component } from '../../../classes/component';
import { HttpClient } from '@angular/common/http';

/**
 * Service handling all {@link Component} app server routing.
 */
@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  /**
   * Creates a new instance of {@link ComponentService}.
   * @param http The HttpClient service.
   */
  constructor(private http: HttpClient) { }

  /**
   * Route URL for components.
   */
  private componentUrl = "http://localhost:3000/components";

  /**
   * Gets all {@link Component} objects from the app server.
   */
  getComponents() : Observable<Component[]>
  {
    return this.http.get<Component[]>(this.componentUrl);
  }

  /**
   * Gets all {@link Component} objects associated with the given {@link System}
   * ID.
   * @param systemId The ID of the {@link System}.
   */
  getComponentsFromSystem(systemId: number) : Observable<Component[]>
  {
    return this.http.get<Component[]>(`${this.componentUrl}/${systemId}`);
  }

  /**
   * Saves the given {@link Component} in the 'components' database table.
   * @param component The new {@link Component} to save.
   */
  createComponent(component: Component) : Observable<Number>
  {
    return this.http.post<Number>(this.componentUrl, component);
  }

  /**
   * Updates the given {@link Component} in the 'components' database table.
   * @param component The updated {@link Component} to save.
   */
  updateComponent(component: Component) : Observable<Number>
  {
    return this.http.put<Number>(`${this.componentUrl}/${component.componentID}`, component);
  }

  /**
   * Removes the given {@link Component} from the 'components' database table.
   * @param component The {@link Component} to remove.
   */
  removeComponent(component: Component) : Observable<Component>
  {
    return this.http.delete<Component>(`${this.componentUrl}/${component.componentID}`);
  }
}
