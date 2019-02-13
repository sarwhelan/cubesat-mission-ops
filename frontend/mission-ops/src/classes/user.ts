import { CognitoIdentityServiceProvider } from 'aws-sdk'

export class User {
    public email: string;
    public administrator: boolean;

    constructor(user: CognitoIdentityServiceProvider.UserType) {
        user.Attributes.forEach((att) => {
            if (att.Name === 'email') {
                this.email = att.Value;
            } else if (att.Name === 'custom:administrator') {
                this.administrator = att.Value === 'true';
            }
        });
    }
}