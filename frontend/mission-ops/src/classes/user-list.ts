import { CognitoIdentityServiceProvider } from 'aws-sdk';

import { User } from './user';

export class UserList {
    public paginationToken: string;
    public users: Array<User>;
    
    constructor(params: UserList = {} as UserList) {
        let {
            paginationToken = '',
            users = []
        } = params;

        this.paginationToken = paginationToken;
        this.users = users;
    }
}