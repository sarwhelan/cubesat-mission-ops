import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueuedTelecommand } from 'src/classes/queuedTelecommand';
import { HttpClient } from '@angular/common/http';
import { Pass } from 'src/classes/pass';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QueuedTelecommandService {
  
  private queuedTelecommandsUrl = `${env.apiRouteBase}/queued-telecommands`
  private transmissionQueueUrl = `${env.apiRouteBase}/transmission-queue`
  private executionQueueUrl = `${env.apiRouteBase}/execution-queue`

  constructor(private http: HttpClient) { }

  getQueuedTelecommands() : Observable<QueuedTelecommand[]>
  {
    return this.http.get<QueuedTelecommand[]>(this.queuedTelecommandsUrl);
  }

  getQueuedTelecommandsTransmission(transmissionPass: Pass) : Observable<QueuedTelecommand[]>
  {
    return this.http.get<QueuedTelecommand[]>(`${this.transmissionQueueUrl}/${transmissionPass.passID}`);
  }

  getQueuedTelecommandsExecution(executionPass: Pass) : Observable<QueuedTelecommand[]>
  {
    return this.http.get<QueuedTelecommand[]>(`${this.executionQueueUrl}/${executionPass.passID}`);
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
