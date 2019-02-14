import { Component, OnInit, isDevMode, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';

import { AuthService } from '../services/auth/auth.service';
import { AlertComponent } from '../alert/alert.component';
import { ModalComponent } from '../modal/modal.component';


/**
 * A component for logging a user into the application.
 *
 * @export
 * @class LoginComponent
 * @implements {OnInit}
 */
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

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl('/');
    }
  }

  /**
   * Signs the user into the application using the username and password
   * provided in the input fields. Errors are displayed in a dismissable
   * alert. If the user needs to change their password, a modal is openned
   * to handle that.
   *
   * @returns
   * @memberof LoginComponent
   */
  public signIn() {
    this.processing = true;
    this.alert.hide();

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
      onSuccess: () => {
        this.processing = false;
        this.router.navigateByUrl('/');
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
        // TODO: expand this to actually support MFA if needed.
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
