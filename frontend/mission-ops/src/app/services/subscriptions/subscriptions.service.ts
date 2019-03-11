import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from '../../../classes/subscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  private systemUrl = "http://localhost:3000/subscriptions/";

  getSubscriptions(userID): Observable<Subscription[]>
  {
    return this.http.get<Subscription[]>(this.systemUrl + userID);
  }
}
