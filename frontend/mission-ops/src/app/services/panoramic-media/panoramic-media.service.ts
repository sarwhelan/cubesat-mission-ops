import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';

import { PanoramicMedia } from 'src/classes/panoramic-media';
import { PagedList } from 'src/classes/paged-list';

@Injectable({
  providedIn: 'root'
})
export class PanoramicMediaService {

  private mediaApiUrl = `${env.apiRouteBase}/media`
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
    return this.http.get(this.mediaApiUrl).pipe(
      map((val) => val as Array<PanoramicMedia>),
      map((val) => {
        for(let i = 0; i < val.length; i++) {
          // Replace source fields with full urls
          val[i].src = `${env.apiRouteBase}${val[i].src}`;
          val[i].previewSrc = `${env.apiRouteBase}${val[i].previewSrc}`;
        }
        return val;
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
        total: val.length
      }))
    );
  }

  /**
   * Gets the PanoramicMedia object indicated by the given id.
   *
   * @param {number} id The id of the PanoramicMedia object to get.
   * @returns {Observable<PanoramicMedia>}
   * @memberof PanoramicMediaService
   */
  public getMedia(id: number): Observable<PanoramicMedia> {
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
