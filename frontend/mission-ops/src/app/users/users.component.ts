import { Component, OnInit } from '@angular/core';

import { UsersService } from '../services/users/users.service';
import { UserList } from '../../classes/user-list';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  private userLimit: number = 10;

  private userList: UserList;

  constructor(private users: UsersService) { }

  ngOnInit() {
    this.users.listUsers(this.userLimit)
      .subscribe((userList) => this.userList = userList);
  }

}
