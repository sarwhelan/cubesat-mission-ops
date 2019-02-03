import { Component, OnInit } from '@angular/core';

import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private username: string;
  private password: string;

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  public signIn() {
    console.log(`Sign in triggered. Username is ${this.username} and password is ${this.password}`);
    this.auth.signIn(this.username, this.password, {
      onSuccess: function(accessToken: string) {
        console.log(`Sign in success! Access Token: ${accessToken}`);
      },
      onFailure: function(err: any) {
        console.log('Sign in failed');
        console.log(err);
      },
      mfaRequired: function(challengeName: any, challengeParameters: any) {
        console.log('mfa required');
        console.log(challengeName);
        console.log(challengeParameters);
        return '';
      }
    })
  }

}
