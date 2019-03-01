import { Injectable } from '@angular/core';
import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserSession, CognitoAccessToken, CognitoIdToken, CognitoRefreshToken } from 'amazon-cognito-identity-js';
import { Observable } from 'rxjs';
import { User } from 'src/classes/user';

/**
 * Callback object for the signin process.
 * Currently only onSuccess, onFailure, mfaRequired, and newPasswordRequired
 * are supported, although mfaRequired is untested and may not work.
 *
 * @export
 * @interface ISignInCallback
 */
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

/**
 * A service for managing authentication.
 * Provides facilities for sigining in and out of the application,
 * as well as checking the current authentication state.
 *
 * @export
 * @class AuthService
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userPool: CognitoUserPool;
  // TODO: move this configuration information somewhere appropriate
  private poolData = { 
    UserPoolId : 'us-east-2_YZSlXzFlB',                 //CognitoUserPool
    ClientId : '1bn896ocv98neen3r2djed4r7i'                    //CognitoUserPoolClient 
  };

  private _currentUser: User;
  private _cognitoUser: CognitoUser;
  private _session: CognitoUserSession;
  
  private get currentUser(): User {
    if (!this._currentUser) {
      this._currentUser = JSON.parse(sessionStorage.getItem('currentUser')) as User;
    }
    return this._currentUser;
  }
  private set currentUser(val: User) {
    this._currentUser = val;
    if (val) {
      sessionStorage.setItem('currentUser', JSON.stringify(val));
    } else {
      sessionStorage.removeItem('currentUser');
    }
  }

  private get cognitoUser(): CognitoUser {
    if (!this._cognitoUser) {
      // User does not exist in memory, so try to get it from session storage
      this._cognitoUser = JSON.parse(sessionStorage.getItem('cognitoUser')) as CognitoUser;
      if (this._cognitoUser) {
        // Got the user object out of storage, now we need to restore all of its functions
        // @ts-ignore Reset prototype that got removed by JSON parsing
        this._cognitoUser.__proto__ = CognitoUser.prototype;
        // @ts-ignore Reset prototype that got removed by JSON parsing
        this._cognitoUser.pool.__proto__ = CognitoUserPool.prototype;
        // @ts-ignore Replace storage object that got removed by JSON parsing
        this._cognitoUser.storage = localStorage;
      }
    }
    return this._cognitoUser;
  }
  private set cognitoUser(val: CognitoUser) {
    this._cognitoUser = val;
    if (val) {
      sessionStorage.setItem('cognitoUser', JSON.stringify(val));
    } else {
      sessionStorage.removeItem('cognitoUser');
    }
  }

  private get session(): CognitoUserSession {
    if (!this._session) {
      // Session does not exist in memeory, so try to get it from session storage
      this._session = JSON.parse(sessionStorage.getItem('cognitoSession')) as CognitoUserSession;
      if (this._session) {
        // Got the session object out of storage, so now we need to restore all of its functions
        // @ts-ignore Reset prototype that got removed by JSON parsing
        this._session.__proto__ = CognitoUserSession.prototype;
        // @ts-ignore Reset prototype that got removed by JSON parsing
        this._session.getAccessToken().__proto__ = CognitoAccessToken.prototype;
        // @ts-ignore Reset prototype that got removed by JSON parsing
        this._session.getIdToken().__proto__ = CognitoIdToken.prototype;
        // @ts-ignore Reset prototype that got removed by JSON parsing
        this._session.getRefreshToken().__proto__ = CognitoRefreshToken.prototype;
      }
    }
    return this._session;
  }
  private set session(val: CognitoUserSession) {
    this._session = val;
    if (val) {
      sessionStorage.setItem('cognitoSession', JSON.stringify(val));
    } else {
      sessionStorage.removeItem('cognitoSession');
    }
  }

  constructor() {
    this.userPool = new CognitoUserPool(this.poolData);
  }

  /**
   * Signs in as the given user.
   * Signing in may trigger additional actions such as password changes
   * and multi-factor authentication depending on the user.
   *
   * @param {string} username The username of the user to sign in as.
   * @param {string} password The password of the user to sign in as.
   * @param {ISignInCallback} callback An object containing callbacks to be used in the event further action is needed.
   * @memberof AuthService
   */
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

    let self = this;
    this.cognitoUser.authenticateUser(authDetails, {
      onSuccess: function(session: CognitoUserSession) {
        // Login was successful
        self.session = session;
        // Grab user attributes to check if they're an administrator
        self.cognitoUser.getUserAttributes((err, result) => {
          if (err) {
            callback.onFailure(err);
          } else {
            const user = new User();
            result.forEach((att) => {
              if (att.getName() === 'email') {
                user.email = att.getValue();
              } else if (att.getName() === 'custom:administrator') {
                user.administrator = att.getValue() === 'true';
              } else if (att.getName() === 'sub') {
                user.id = att.getValue();
              } else if (att.getName() === 'phone_number') {
                user.phone = att.getValue();
              } else if (att.getName() === 'custom:prefContactMethod') {
                user.preferredContactMethod = att.getValue();
              }
            });
            self.currentUser = user;
            callback.onSuccess(self.getAccessToken());
          }
        });
      },
      onFailure: function(err: any) {
        // Login failed
        callback.onFailure(err);
      },
      mfaRequired: function(challengeName: any, challengeParameters: any) {
        // MFA is required for this user, so we'll need to get the user to input the challenge value.
        // TODO: investigate replacing this with a promise because the user will need time to dig out MFA stuff
        let verificationCode = callback.mfaRequired(challengeName, challengeParameters);
        self.cognitoUser.sendMFACode(verificationCode, this);
      },
      newPasswordRequired: function(userAttributes: any, requiredAttributes: any) {
        // This is the user's first time signing in, so they must change their password
        let subscription = callback.newPasswordRequired().subscribe((newPassword) => {
          // Providing 'this' as the callback object causes this set of callbacks to handle any new callback operations
          self.cognitoUser.completeNewPasswordChallenge(newPassword, requiredAttributes, this);
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

  /**
   * Signs out the currently signed in user.
   *
   * @memberof AuthService
   */
  public signOut(): void {
    if (this.cognitoUser) {
      this.cognitoUser.signOut();
      this.cognitoUser = null;
      this.session = null;
      this.currentUser = null;
    }
  }

  /**
   * Gets the JSON Web Token for the current session, or null if the session does not exist.
   * This provides no guarantee that the session is valid, for that you must check isAuthenticated().
   *
   * @returns {string} The JWT for the currently signed in user, or null if there is no active session.
   * @memberof AuthService
   */
  public getAccessToken(): string {
    if (this.session) {
      return this.session.getAccessToken().getJwtToken();
    } else {
      return null;
    }
  }
  
  /**
   * Checks if the current sign in session is still valid. Returns false if there is no currently active session.
   *
   * @returns {boolean} Wether or not the current sign in session is valid, or false if there is no session.
   * @memberof AuthService
   */
  public isAuthenticated(): boolean {
    if (this.session) {
      return this.session.isValid();
    } else {
      return false;
    }
  }

  /**
   * Checks whether or not the currently signed in user is an administrator. Returns false if there is no
   * currently signed in user.
   *
   * @returns {boolean} Whether or not the currently signed in user is an administrator, or false if there is no currently signed in user.
   * @memberof AuthService
   */
  public isAdministrator(): boolean {
    if (this.cognitoUser) {
      return this.currentUser.administrator;
    } else {
      return false;
    }
  }

  public getCurrentUser(): User {
    return this.currentUser;
  }
}
