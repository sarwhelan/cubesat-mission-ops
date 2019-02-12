import { Injectable } from '@angular/core';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

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
   * WORK IN PROGRESS
   * Gets the list of all users that exist in the user pool. Currently returns nothing,
   * but at some point will allow for accessing paginated results somehow.
   *
   * @param {number} [limit=10] The number of users to retrieve.
   * @param {Array<string>} [attributesToGet=null] The attributes to get for each user. If unspecified, all attributes are retrieved.
   * @memberof UsersService
   */
  public listUsers(limit: number = 10, attributesToGet: Array<string> = null): void {
    this.cognitoIdentityServiceProvider.listUsers({
      UserPoolId: 'us-east-2_eniCDFvnv',
      AttributesToGet: attributesToGet,
      Limit: limit
    }, (err, data) => {
      if (err) {
        console.log('Error');
        console.log(err);
      } else {
        console.log('Success');
        console.log(data);
      }
    });
  }
}
