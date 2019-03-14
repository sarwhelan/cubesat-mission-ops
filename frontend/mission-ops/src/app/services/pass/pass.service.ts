import { Injectable } from '@angular/core';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { Pass } from '../../../classes/pass';
import { HttpClient } from '@angular/common/http';
import { PassSum } from 'src/classes/pass-sum';
import { mergeMap, switchMap, delay } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';

interface State {
  page: number;
  pageSize: number;
}

interface DividedPass {
  pastPasses: Pass[],
  futurePasses: Pass[],
  pastPassTotal: number,
  futurePassTotal: number
}

/**
 * Service handling all {@link Pass} app server routing.
 */
@Injectable({
  providedIn: 'root'
})
export class PassService {
  private _pastPasses = new BehaviorSubject<Pass[]>([]);
  private _futurePasses = new BehaviorSubject<Pass[]>([]);
  private _pastTotal = new BehaviorSubject<number>(0);
  private _futureTotal = new BehaviorSubject<number>(0);
  private _state: State = {
    page: 1,
    pageSize: 10
  };

  
  
  /**
   * Route URL for passes.
   */
  private _refreshPasses = new Subject<void>();
  private passesUrl = `${env.apiRouteBase}/passes`;

  /**
   * Creates a new instance of {@link PassService}.
   * @param http The HttpClient service.
   */
  constructor(private http: HttpClient) { 
    this._refreshPasses.pipe(
      switchMap(() => this._getPasses(true))
    ).subscribe(result => {
      console.log(result);
      this._pastPasses.next(result.pastPasses);
      this._futurePasses.next(result.futurePasses);
      this._futureTotal.next(result.futurePassTotal);
      this._pastTotal.next(result.pastPassTotal);
    });

    this._refreshPasses.next();
  }

  get pastPasses() { return this._pastPasses.asObservable() }
  get futurePasses() { return this._futurePasses.asObservable() }
  get pastTotal() { return this._pastTotal.asObservable() }
  get futureTotal() { return this._futureTotal.asObservable() }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    console.log(this._state);
    this._refreshPasses.next();
  }

  /**
   * Gets all {@link Pass} objects from the app server.
   */
  private _getPasses(isPaginated: boolean) : Observable<DividedPass>
  {
    const {pageSize, page} = this._state;
    return this.http.get<Pass[]>(this.passesUrl)
      .pipe(mergeMap(result => {
        var pastPasses = result.filter(x => x.passHasOccurred);
        const pastPassTotal = pastPasses.length;
        var futurePasses = result.filter(x => !x.passHasOccurred);
        const futurePassTotal = futurePasses.length;
        if (!isPaginated) return of({pastPasses, futurePasses, pastPassTotal, futurePassTotal});
        pastPasses = pastPasses.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        futurePasses = futurePasses.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
        return of({pastPasses, futurePasses, pastPassTotal, futurePassTotal});
      }));
  }

  /**
   * Updates the given {@link Pass} in the 'passes' database table.
   * @param pass The updated {@link Pass} to save.
   */
  updatedPass(pass: Pass) : Observable<any>{
    return this.http.put(this.passesUrl + "/" + pass.passID, pass);
  }

  /**
   * Saves the given {@link Pass} in the 'passes' database table.
   * @param pass The new {@link Pass} to save.
   */
  createPass(pass: Pass)  : Observable<any>{
    return this.http.post(this.passesUrl, pass);
  }

  getPassTransmissionSums() : Observable<PassSum[]>{
    return this.http.get<PassSum[]>(`${this.passesUrl}/transmission-sum`);
  }

  getPassExecutionSums() : Observable<PassSum[]>{
    return this.http.get<PassSum[]>(`${this.passesUrl}/execution-sum`);
  }

  refreshPasses() :void
  {
    this._refreshPasses.next();

  }
}
