import { Injectable } from '@angular/core';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails, CognitoUserSession } from 'amazon-cognito-identity-js';
import { Observable } from 'rxjs';

export interface ISignInCallback {
  onSuccess: (accessToken: string) => void,
  onFailure: (err: any) => void,
  newPasswordRequired?: () => Observable<string>,
  mfaRequired?: (challengeName: any, challengeParameters: any) => string,
  totpRequired?: (challengeName: any, challengeParameters: any) => void,
  customChallenge?: (challengeParameters: any) => void,
  mfaSetup?: (challengeName: any, challengeParameters: any) => void,
  selectMFAType?: (challengeName: any, challengeParameters: any) => void
}

export interface ISignUpCallback {
  onSuccess: () => void,
  onFailure: (err: any) => void
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userPool: any;
  private poolData = { 
    UserPoolId : 'us-east-2_0v71IeMge',                 //CognitoUserPool
    ClientId : '1jhd5ghteq1utussi99vm4h4h2'                    //CognitoUserPoolClient 
  };

  private cognitoUser: CognitoUser;
  private session: CognitoUserSession;

  constructor() {
    this.userPool = new CognitoUserPool(this.poolData);
  }

  public signUp(username: string, password: string, email: string, phoneNumber: string, callback: ISignUpCallback): void {
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
        callback.onFailure(err);
      } else {
        let cognitoUser = result.user;
        console.log(result);
        // TODO: Do something with the user
        callback.onSuccess();
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

  // TODO: Support MFA and force changing password on first signin
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
    this.cognitoUser = new CognitoUser(userData);
    this.cognitoUser.authenticateUser(authDetails, {
      onSuccess: function(session: CognitoUserSession) {
        console.log('success');
        console.log(session);
        this.session = session;
        callback.onSuccess(this.getAccessToken());
      },
      onFailure: function(err: any) {
        callback.onFailure(err);
      },
      mfaRequired: function(challengeName: any, challengeParameters: any) {
        // TODO: investigate replacing this with a promise because the user will need time to dig out MFA stuff
        let verificationCode = callback.mfaRequired(challengeName, challengeParameters);
        this.cognitoUser.sendMFACode(verificationCode, this);
      },
      newPasswordRequired: function(userAttributes: any, requiredAttributes: any) {
        let subscription = callback.newPasswordRequired().subscribe((newPassword) => {
          // Providing 'this' as the callback object causes this set of callbacks to handle any new callback operations
          this.cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, this);
          subscription.unsubscribe();
        },
        (err) => {
          this.onFailure({
            name: 'Error',
            message: 'You must change your password.'
          });
        });
      }
    });
  }

  public signOut(): void {
    this.cognitoUser.signOut();
  }

  public getAccessToken(): string {
    return this.session.getAccessToken().getJwtToken();
  }
}
