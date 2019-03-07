import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Component } from '../../../classes/component';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor(private http: HttpClient) { }

  private componentUrl = "http://localhost:3000/components";

  getComponents() : Observable<Component[]>
  {
    return this.http.get<Component[]>(this.componentUrl);
  }

  getComponentsFromSystem(systemId: number) : Observable<Component[]>
  {
    return this.http.get<Component[]>(`${this.componentUrl}/${systemId}`);
  }

  createComponent(component: Component) : Observable<Number>
  {
    return this.http.post<Number>(this.componentUrl, component);
  }

  updateComponent(component: Component) : Observable<Number>
  {
    return this.http.put<Number>(`${this.componentUrl}/${component.componentID}`, component);
  }

  removeComponent(component: Component) : Observable<Component>
  {
    return this.http.delete<Component>(`${this.componentUrl}/${component.componentID}`);
  }
}
