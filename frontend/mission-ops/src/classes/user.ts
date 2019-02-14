import { CognitoIdentityServiceProvider } from 'aws-sdk'
import { CognitoUser } from 'amazon-cognito-identity-js';

export class User {
    public email: string;
    public administrator: boolean;

    constructor(params: User = {} as User) {
        let {
            email = '',
            administrator = false
        } = params;

        this.email = email;
        this.administrator = administrator;
    }
}