import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TelecommandBatch } from '../../../classes/telecommandBatch';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TelecommandBatchService {

  constructor(private http: HttpClient) { }

  private telecommandBatchesUrl = "http://localhost:3000/telecommand-batches"

  getTelecommandBatches() : Observable<TelecommandBatch[]>
  {
    return this.http.get<TelecommandBatch[]>(this.telecommandBatchesUrl);
  }

  updateTelecommandBatch(batch: TelecommandBatch) : Observable<any>
  {
    var updateURL = this.telecommandBatchesUrl + "/" + batch.batchID;

    return this.http.put(updateURL, batch);
  }

  deleteTelecommandBatch(batchID: number) : Observable<any>
  {
    var deleteURL = this.telecommandBatchesUrl + "/" + batchID;

    return this.http.delete(deleteURL);
  }

  createNewTelecommandBatch(newBatch: TelecommandBatch): Observable<any>
  {
    return this.http.post(this.telecommandBatchesUrl, newBatch);
  }
}
