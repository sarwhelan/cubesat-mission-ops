import { Injectable } from '@angular/core';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

export interface ICreateUserCallback {
  onSuccess: () => void,
  onFailure: (err: any) => void
}

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

  public createUser(username: string, password: string, email: string, admin: boolean, callback: ICreateUserCallback): void {
    // TODO: Validate input

    this.cognitoIdentityServiceProvider.adminCreateUser({
      UserPoolId: 'us-east-2_0v71IeMge',
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

  public getUsers(limit: number = 10, attributesToGet: Array<string> = null): void {
    this.cognitoIdentityServiceProvider.listUsers({
      UserPoolId: 'us-east-2_0v71IeMge',
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
