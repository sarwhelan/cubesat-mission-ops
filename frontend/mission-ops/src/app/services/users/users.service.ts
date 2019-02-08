import { Injectable } from '@angular/core';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

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

  public getUsers(limit: number = 10, attributesToGet: Array<string> = null) {
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
