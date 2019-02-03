import { Component, OnInit, isDevMode } from '@angular/core';

import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private username: string;
  private password: string;

  private showAlert: boolean = false;
  private errorHeading: string;
  private errorBody: string;

  private processing: boolean = false;

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  public signIn() {
    this.processing = true;

    this.auth.signIn(this.username, this.password, {
      onSuccess: (accessToken: string) => {
        this.processing = false;
        console.log(`Sign in success! Access Token: ${accessToken}`);
      },
      onFailure: (err: any) => {
        this.processing = false;

        this.showAlert = true;
        if (isDevMode()) {
          // Only display real error when developing to avoid information leaks
          this.errorHeading = err.name;
          this.errorBody = err.message;
        } else {
          this.errorHeading = "Error";
          this.errorBody = "Username or Password is Incorrect.";
        }
      },
      mfaRequired: (challengeName: any, challengeParameters: any) => {
        this.processing = false;

        console.log('mfa required');
        console.log(challengeName);
        console.log(challengeParameters);
        return '';
      }
    })
  }

}
