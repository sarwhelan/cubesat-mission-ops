import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {

  private newPassword: string;
  private confirmNewPassword: string;
  private processing: boolean = false;
  private passwordSubject: Subject<string>;

  constructor() { 
    this.passwordSubject = new Subject<string>();
  }

  ngOnInit() {
  }

  private changePassword(): void {
    this.processing = true;
    // TODO: validate input

    this.passwordSubject.next(this.newPassword);
    this.passwordSubject.complete();
  }

  public getNewPassword(): Observable<string> {
    return this.passwordSubject.asObservable();
  }
}
