import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { QueuedTelecommand } from '../../../classes/queuedTelecommand';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QueuedTelecommandService {
  
  private queuedTelecommandsUrl = "http://localhost:3000/queued-telecommands"

  constructor(private http: HttpClient) { }

  getQueuedTelecommands() : Observable<QueuedTelecommand[]>
  {
    return this.http.get<QueuedTelecommand[]>(this.queuedTelecommandsUrl);
  }

  updatedQueuedTelecommands(queuedTelecommand: QueuedTelecommand) : Observable<any>{
    return this.http.put(this.queuedTelecommandsUrl + "/" + queuedTelecommand.queuedTelecommandID, queuedTelecommand);
  }

  createQueuedTelecommands(queuedTelecommand: QueuedTelecommand)  : Observable<any>{
    return this.http.post(this.queuedTelecommandsUrl, queuedTelecommand);
  }
}
