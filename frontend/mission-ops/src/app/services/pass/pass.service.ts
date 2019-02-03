import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pass } from '../../../classes/pass';
import { PASSES } from './mock-passes';

@Injectable({
  providedIn: 'root'
})
export class PassService {

  constructor() { }

  getPasses() : Observable<Pass[]>
  {
    return of(PASSES);
  }
}
