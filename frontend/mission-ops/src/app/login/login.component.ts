import { Component, OnInit, isDevMode, ViewChild } from '@angular/core';
import { from } from 'rxjs';

import { AuthService } from '../services/auth/auth.service';
import { AlertComponent } from '../alert/alert.component';
import { ModalComponent } from '../modal/modal.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild(AlertComponent)
  private alert: AlertComponent;
  @ViewChild(ModalComponent)
  private modal: ModalComponent;

  private username: string;
  private password: string;

  private processing: boolean = false;

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  public signIn() {
    this.processing = true;

    let errorList = [];
    if (!this.username) {
      errorList.push('Username field cannot be blank.');
    }
    if (!this.password) {
      errorList.push('Password field cannot be blank.');
    }

    if (errorList.length > 0) {
      this.processing = false;
      this.alert.showList('Error', errorList);
      return;
    }

    this.auth.signIn(this.username, this.password, {
      onSuccess: (accessToken: string) => {
        this.processing = false;
        console.log(`Sign in success! Access Token: ${accessToken}`);
      },
      onFailure: (err: any) => {
        this.processing = false;

        if (isDevMode()) {
          // Only display real error when developing to avoid information leaks
          this.alert.show(err.name, err.message);
        } else {
          this.alert.show('Error', 'Username or Password is Incorrect');
        }
      },
      mfaRequired: (challengeName: any, challengeParameters: any) => {
        this.processing = false;

        console.log('mfa required');
        console.log(challengeName);
        console.log(challengeParameters);
        return '';
      },
      newPasswordRequired: () => {
        this.processing = false;
        return from(this.modal.open());
      }
    })
  }
}
