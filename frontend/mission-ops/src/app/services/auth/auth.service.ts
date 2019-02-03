import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails, CognitoUserSession } from 'amazon-cognito-identity-js';

export interface ISignInCallback {
  onSuccess: (accessToken: string) => void,
  onFailure: (err: any) => void,
  mfaRequired: (challengeName: any, challengeParameters: any) => string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userPool: any;
  private poolData = { 
    UserPoolId : 'XXXXXXXXXXXXXXXXXXXXXXXXXXX',                 //CognitoUserPool
    ClientId : 'XXXXXXXXXXXXXXXXXXXXXXXXXXX'                    //CognitoUserPoolClient 
  };
  private identityPool: string = 'XXXXXXXXXXXXXXXXXXXXXXXXXXX'; //CognitoIdentityPool 
  private apiURL: string = 'XXXXXXXXXXXXXXXXXXXXXXXXXXX';       //ApiUrl
  private region: string = 'us-east-2';                         //Region Matching CognitoUserPool region

  private accessToken: string;

  constructor() {
    this.userPool = new CognitoUserPool(this.poolData);
  }

  public signUp(username: string, password: string, email: string): void {
    // TODO: validate incoming data

    let attributeList = [];

    let attributeEmail = new CognitoUserAttribute({
      Name: 'email',
      Value: email
    });
    attributeList.push(attributeEmail);

    this.userPool.signUp(username, password, attributeList, null, function(err, result) {
      if (err) {
        // TODO: Do something about the error
      } else {
        let cognitoUser = result.user;
        // TODO: Do something with the user
      }
    });
  }

  public confirmSignUp(username: string, code: string): void {
    let userData = {
      Username: username,
      Pool: this.userPool
    };
    let cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, function(err, result) {
      if (err) {
        // Do something with the error
      } else {
        // Do something with the result
      }
    });
  }

  public signIn(username: string, password: string, callback: ISignInCallback): void {
    let authData = {
      Username: username,
      Password: password
    };
    let authDetails = new AuthenticationDetails(authData);
    let userData = {
      Username: username,
      Pool: this.userPool
    };
    let cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: function(session: CognitoUserSession) {
        this.accessToken = session.getAccessToken().getJwtToken();
        callback.onSuccess(this.accessToken);
      },
      onFailure: function(err: any) {
        callback.onFailure(err);
      },
      mfaRequired: function(challengeName: any, challengeParameters: any) {
        // TODO: investigate replacing this with a promise because the user will need time to dig out MFA stuff
        let verificationCode = callback.mfaRequired(challengeName, challengeParameters);
        cognitoUser.sendMFACode(verificationCode, this);
      }
    });
  }

  public getAccessToken(): string {
    return this.accessToken;
  }
}
