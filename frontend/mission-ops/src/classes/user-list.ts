import { CognitoIdentityServiceProvider } from 'aws-sdk';

import { User } from './user';

export class UserList {
    public paginationToken: string;
    public users: Array<User>;
    
    constructor(listUsersResponse: CognitoIdentityServiceProvider.ListUsersResponse) {
        this.paginationToken = listUsersResponse.PaginationToken;
        this.users = [];
        listUsersResponse.Users.forEach((u) => this.users.push(new User(u)));
    }
}