import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Telecommand } from '../../../classes/telecommand';
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

  deleteTelecommand(telecommandID : number) : Observable<any>{
    var deleteUrl = this.telecommandsUrl + "/" + telecommandID;

    return this.http.delete(deleteUrl);
  }

  createTelecommand(telecommand: Telecommand) : Observable<any>{
    return this.http.post(this.telecommandsUrl, telecommand);
  }
}
