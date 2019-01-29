import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TelecommandBatch } from '../../../classes/telecommandBatch';
import { TELECOMMANDBATCHES } from './mock-batches';

@Injectable({
  providedIn: 'root'
})
export class TelecommandBatchService {

  constructor() { }

  getTelecommandBatches() : Observable<TelecommandBatch[]>
  {
    return of(TELECOMMANDBATCHES);
  }
}
