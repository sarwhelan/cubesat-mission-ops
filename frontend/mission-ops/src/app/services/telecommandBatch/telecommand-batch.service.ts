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
}
