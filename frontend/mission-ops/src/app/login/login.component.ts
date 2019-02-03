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
  private isDevMode: boolean;
  private errorHeading: string;
  private errorBody: string;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.isDevMode = isDevMode();
  }

  public signIn() {
    this.auth.signIn(this.username, this.password, {
      onSuccess: (accessToken: string) => {
        console.log(`Sign in success! Access Token: ${accessToken}`);
      },
      onFailure: (err: any) => {
        this.showAlert = true;
        this.errorHeading = err.name;
        this.errorBody = err.message;
      },
      mfaRequired: (challengeName: any, challengeParameters: any) => {
        console.log('mfa required');
        console.log(challengeName);
        console.log(challengeParameters);
        return '';
      }
    })
  }

}
