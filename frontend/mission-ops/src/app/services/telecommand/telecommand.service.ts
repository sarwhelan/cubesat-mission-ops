import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Telecommand } from 'src/classes/telecommand';
import { HttpClient } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TelecommandService {

  constructor(private http: HttpClient) { }

  private telecommandsUrl = `${env.apiRouteBase}/telecommands`

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
