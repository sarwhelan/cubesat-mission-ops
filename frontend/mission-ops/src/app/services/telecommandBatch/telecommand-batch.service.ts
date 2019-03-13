import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TelecommandBatch } from 'src/classes/telecommandBatch';
import { HttpClient } from '@angular/common/http';
import { environment as env } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TelecommandBatchService {

  constructor(private http: HttpClient) { }

  private telecommandBatchesUrl = `${env.apiRouteBase}/telecommand-batches`

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
