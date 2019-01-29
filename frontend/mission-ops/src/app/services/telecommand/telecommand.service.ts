import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Telecommand } from '../../../classes/telecommand';
import { TELECOMMANDS } from './mock-telecommands';

@Injectable({
  providedIn: 'root'
})
export class TelecommandService {

  constructor() { }

  getTelecommands() : Observable<Telecommand[]>
  {
    return of(TELECOMMANDS);
  }
}
