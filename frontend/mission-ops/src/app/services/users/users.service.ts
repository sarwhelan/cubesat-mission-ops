import { Injectable } from '@angular/core';
import { CognitoIdentityServiceProvider, AWSError } from 'aws-sdk';
import { Observable } from 'rxjs';

import { User } from '../../../classes/user';
import { UserList } from '../../../classes/user-list';

export interface ICreateUserCallback {
  onSuccess: () => void,
  onFailure: (err: any) => void
}

/**
 * A service for creating, getting, updating, and listing users.
 *
 * @export
 * @class UsersService
 */
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private cognitoIdentityServiceProvider: CognitoIdentityServiceProvider;

  constructor() { 
    // TODO: move this configuration information somewhere appropriate
    this.cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
      accessKeyId: 'AKIAITKTCDI7BY3DPTFA',
      secretAccessKey: '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',
      region: 'us-east-2'
    });
  }

  /**
   * Creates a new user using the given parameters, and calls the given
   * callbacks depending on the success of the operation.
   *
   * @param {string} username The username of the user. This can be the same as the user's email.
   * @param {string} password A temporary password for the user. The user will be forced to change it on their first login. If left blank, a temporary password will be automatically generated.
   * @param {string} email The user's email address. A welcome email with the user's username and password will be sent to this address once user creation succeeds.
   * @param {boolean} admin Whether or not this user is an administrator. This will be used to determine whether or not they have access to certain features.
   * @param {ICreateUserCallback} callback An object containing the callback methods called when the operation succeeds or fails.
   * @memberof UsersService
   */
  public createUser(username: string, password: string, email: string, admin: boolean, callback: ICreateUserCallback): void {
    // TODO: Validate input

    this.cognitoIdentityServiceProvider.adminCreateUser({
      UserPoolId: 'us-east-2_eniCDFvnv',
      Username: username,
      TemporaryPassword: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email
        },
        {
          Name: 'custom:administrator',
          Value: admin ? 'true' : 'false'
        }
      ],
      DesiredDeliveryMediums: [
        'EMAIL'
      ]
    }, (err, data) => {
      if (err) {
        console.log('Error creating user');
        console.log(err);
        callback.onFailure(err);
      } else {
        console.log('Success creating user');
        console.log(data);
        callback.onSuccess();
      }
    });
  }

  /**
   * Gets the list of all users that exist in the user pool. Currently returns nothing,
   * but at some point will allow for accessing paginated results somehow.
   *
   * @param {number} [limit=10] The number of users to retrieve.
   * @param {Array<string>} [attributesToGet=null] The attributes to get for each user. If unspecified, all attributes are retrieved.
   * @memberof UsersService
   */
  public listUsers(limit: number = 10, attributesToGet: Array<string> = null, paginationToken: string = null): Observable<UserList> {
    const obs = new Observable<UserList>((subscriber) => {
      this.cognitoIdentityServiceProvider.listUsers({
        UserPoolId: 'us-east-2_eniCDFvnv',
        AttributesToGet: attributesToGet,
        Limit: limit,
        PaginationToken: paginationToken
      }, (err, data) => {
        if (err) {
          subscriber.error(err);
        } else {
          const users: Array<User> = [];

          // Convert incoming user data into user objects
          data.Users.forEach((u) => {
            const user = new User();
            u.Attributes.forEach((att) => {
              if (att.Name === 'email') {
                user.email = att.Value;
              } else if (att.Name === 'custom:administrator') {
                user.administrator = att.Value === 'true';
              }
            });
            users.push(user);
          });

          // Build user list using incoming data
          const userList: UserList = new UserList({
            paginationToken: data.PaginationToken,
            users: users
          });

          subscriber.next(userList);
        }
        subscriber.complete();
      });
    });

    return obs;
  }

  /**
   * Deletes the given user from the application, and returns an
   * Observable that will send one result when the operation completes,
   * or error if an error occurs.
   *
   * @param {User} user The user to be deleted.
   * @returns {Observable<void>}
   * @memberof UsersService
   */
  public deleteUser(user: User): Observable<void> {
    const obs = new Observable<void>((subscriber) => {
      this.cognitoIdentityServiceProvider.adminDeleteUser({
        UserPoolId: 'us-east-2_eniCDFvnv',
        Username: user.email
      }, (err, data) => {
        if (err) {
          subscriber.error(err);
        } else {
          subscriber.next();
        }
        subscriber.complete();
      });
    });
    return obs;
  }
}
