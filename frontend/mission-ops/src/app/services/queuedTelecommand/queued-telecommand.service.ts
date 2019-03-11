import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { QueuedTelecommand } from '../../../classes/queuedTelecommand';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PassService } from '../pass/pass.service';
import { PassThrough } from 'stream';
import { Pass } from 'src/classes/pass';

@Injectable({
  providedIn: 'root'
})
export class QueuedTelecommandService {
  
  private queuedTelecommandsUrl = "http://localhost:3000/queued-telecommands"
  private transmissionQueueUrl = "http://localhost:3000/transmission-queue"

  constructor(private http: HttpClient) { }

  getQueuedTelecommands() : Observable<QueuedTelecommand[]>
  {
    return this.http.get<QueuedTelecommand[]>(this.queuedTelecommandsUrl);
  }

  getQueuedTelecommandsTransmission(transmissionPass: Pass) : Observable<QueuedTelecommand[]>
  {
    return this.http.get<QueuedTelecommand[]>(`${this.transmissionQueueUrl}/${transmissionPass.passID}`);
  }

  updatedQueuedTelecommands(queuedTelecommand: QueuedTelecommand) : Observable<any>{
    return this.http.put(this.queuedTelecommandsUrl + "/" + queuedTelecommand.queuedTelecommandID, queuedTelecommand);
  }
  
  createBatchQueuedTelecommands(queuedTelecommands: Object[]) : Observable<any>
  {
    return this.http.post(this.queuedTelecommandsUrl, queuedTelecommands);
  }

  deleteQueuedTelecommand(queuedTelecommand: QueuedTelecommand) : Observable<any> 
  {
    return this.http.delete(`${this.queuedTelecommandsUrl}/${queuedTelecommand.queuedTelecommandID}`);
  }
}
