import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PresetTelecommand } from '../../../classes/presetTelecommand';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PresetTelecommandService {

  private presetTelecommandUrl = "http://localhost:3000/preset-telecommands"

  constructor(private http: HttpClient) { }

  getPresetTelecommands(batchID: number) : Observable<PresetTelecommand[]>
  {
    var getURL = this.presetTelecommandUrl + "/" + batchID;

    return this.http.get<PresetTelecommand[]>(getURL);
  }

  deletePresetTelecommands(presetTelecommandID: number) : Observable<any>
  {
    var deleteURL = this.presetTelecommandUrl + "/" + presetTelecommandID;

    return this.http.delete<PresetTelecommand[]>(deleteURL);
  }
}
