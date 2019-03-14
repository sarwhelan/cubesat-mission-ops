import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'src/classes/subscription';
import { environment as env } from 'src/environments/environment';
import { retry, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  private systemUrl = `${env.apiRouteBase}/subscriptions/`;

  getSubscriptions(userID): Observable<Subscription[]>
  {
    return this.http.get<Subscription[]>(this.systemUrl + userID);
  }

  addSubscription(systemID: Number, userID: String): Observable<Number>
  {
    return this.http.post<Number>(this.systemUrl + userID, JSON.stringify({"systemID": systemID}), this.httpOptions)
      /*.pipe(
        retry(3),
        catchError(val => {
          this.handleRequestError(val, "add");
          return never();
        })
      );*/
  }

  deleteSubscription(systemID: Number, userID: String): Observable<Subscription>
  {
    return this.http.delete<Subscription>(this.systemUrl + userID + "." + systemID);
  }

  handleRequestError(err, eventType: string) {
    this.toastr.error();
  }
  
}
