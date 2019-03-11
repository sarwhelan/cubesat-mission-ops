import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { PanoramicMedia } from 'src/classes/panoramic-media';
import { PagedList } from 'src/classes/paged-list';

@Injectable({
  providedIn: 'root'
})
export class PanoramicMediaService {

  private _fakeMedia: PanoramicMedia[] = [
    {
      src: '',
      previewSrc: '',
      type: 'image',
      name: 'Test Image 1',
      tags: [ 'test', 'dope' ],
      created: new Date('2019-01-05'),
      id: '1'
    },
    {
      src: '',
      previewSrc: '',
      type: 'image',
      name: 'Test Image 2',
      tags: [ 'photo', 'pretty' ],
      created: new Date('2019-01-29'),
      id: '2'
    },
    {
      src: '',
      previewSrc: '',
      type: 'video',
      name: 'Test Video 1',
      tags: [ 'wow' ],
      created: new Date('2019-02-15'),
      id: '3'
    },
    {
      src: '',
      previewSrc: '',
      type: 'image',
      name: 'Test Image 1',
      tags: [ 'test', 'dope' ],
      created: new Date('2019-01-05'),
      id: '4'
    },
    {
      src: '',
      previewSrc: '',
      type: 'image',
      name: 'Test Image 2',
      tags: [ 'photo', 'pretty' ],
      created: new Date('2019-01-29'),
      id: '5'
    },
    {
      src: '',
      previewSrc: '',
      type: 'video',
      name: 'Test Video 1',
      tags: [ 'wow' ],
      created: new Date('2019-02-15'),
      id: '6'
    },
    {
      src: '',
      previewSrc: '',
      type: 'image',
      name: 'Test Image 1',
      tags: [ 'test', 'dope' ],
      created: new Date('2019-01-05'),
      id: '7'
    },
    {
      src: '',
      previewSrc: '',
      type: 'image',
      name: 'Test Image 2',
      tags: [ 'photo', 'pretty' ],
      created: new Date('2019-01-29'),
      id: '8'
    },
    {
      src: '',
      previewSrc: '',
      type: 'video',
      name: 'Test Video 1',
      tags: [ 'wow' ],
      created: new Date('2019-02-15'),
      id: '9'
    },
  ];

  private media: Array<PanoramicMedia>;
  private mediaObs$: Observable<Array<PanoramicMedia>>;

  constructor(private http: HttpClient) {
    this.mediaObs$ = this.fetchMediaList();
  }

  /**
   * Fetches the media data from the back end, returning an observable that
   * will return an array of all panoramic media objects.
   * 
   * TODO: Rewrite this method to actually a back end instead of the fake data it currently uses.
   *
   * @private
   * @returns {Observable<Array<PanoramicMedia>>}
   * @memberof PanoramicMediaService
   */
  private fetchMediaList(): Observable<Array<PanoramicMedia>> {
    const observables$ = [];
    // Get src for each image
    for(let i = 0; i < this._fakeMedia.length; i++) {
      observables$.push(
        this.http.get(`assets/${this._fakeMedia[i].name}.txt`, {
          responseType: 'text'
        }).pipe(
          tap((val) => this._fakeMedia[i].src = val)
        )
      );
    }

    // Get previewSrc for each image
    for(let i = 0; i < this._fakeMedia.length; i++) {
      observables$.push(
        this.http.get(`assets/${this._fakeMedia[i].name} Preview.txt`, {
          responseType: 'text'
        }).pipe(
          tap((val) => this._fakeMedia[i].previewSrc = val)
        )
      );
    }

    return forkJoin(observables$).pipe(
      map(() => this._fakeMedia),
      tap((val) => {
        this.media = val;
        this.mediaObs$ = null;
      })
    );
  }

  /**
   * Gets a list of panoramic media objects. The returned list starts at `pageSize * page` items
   * into the collection, and contains up to `pageSize` items.
   *
   * @param {number} [pageSize=10]
   * @param {number} [page=0]
   * @returns {Observable<PagedList<PanoramicMedia>>}
   * @memberof PanoramicMediaService
   */
  public getMediaList(pageSize: number = 10, page: number = 0): Observable<PagedList<PanoramicMedia>> {
    let obs$: Observable<Array<PanoramicMedia>>;

    if (this.mediaObs$) {
      // There's new media data waiting to be pulled, so use that
      obs$ = this.mediaObs$;
    } else {
      // There's no new data, so use the cached data
      obs$ = new Observable<Array<PanoramicMedia>>((subscriber) => {
        subscriber.next(this.media);
        subscriber.complete();
      });
    }

    return obs$.pipe(
      map((val) => new PagedList<PanoramicMedia>({
        items: val.slice(pageSize * page, pageSize * (page + 1)),
        page: page,
        total: this.media.length
      }))
    );
  }

  /**
   * Gets the PanoramicMedia object indicated by the given id.
   *
   * @param {string} id The id of the PanoramicMedia object to get.
   * @returns {Observable<PanoramicMedia>}
   * @memberof PanoramicMediaService
   */
  public getMedia(id: string): Observable<PanoramicMedia> {
    let obs$: Observable<Array<PanoramicMedia>>;
    if (this.mediaObs$) {
      obs$ = this.mediaObs$;
    } else {
      obs$ = new Observable<Array<PanoramicMedia>>((subscriber) => {
        subscriber.next(this.media);
        subscriber.complete();
      });
    }
    return obs$.pipe(
      map((val) => val.find((m) => m.id === id))
    );
  }
}
