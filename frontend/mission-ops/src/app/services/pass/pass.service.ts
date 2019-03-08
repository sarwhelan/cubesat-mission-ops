import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pass } from '../../../classes/pass';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PassService {
  
  private passesUrl = "http://localhost:3000/passes"

  constructor(private http: HttpClient) { }

  getPasses() : Observable<Pass[]>
  {
    return this.http.get<Pass[]>(this.passesUrl);
  }

  updatedPass(pass: Pass) : Observable<any>{
    return this.http.put(this.passesUrl + "/" + pass.passID, pass);
  }

  createPass(pass: Pass)  : Observable<any>{
    return this.http.post(this.passesUrl, pass);
  }
}
