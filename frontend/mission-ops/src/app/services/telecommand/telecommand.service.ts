import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Telecommand } from '../../../classes/telecommand';
import { TELECOMMANDS } from './mock-telecommands';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TelecommandService {

  constructor(private http: HttpClient) { }

  private telecommandsUrl = "http://localhost:3000/telecommands"

  getTelecommands() : Observable<Telecommand[]>
  {
    return this.http.get<Telecommand[]>(this.telecommandsUrl);
  }
}
