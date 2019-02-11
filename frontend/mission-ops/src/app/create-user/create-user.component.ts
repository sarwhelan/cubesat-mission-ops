import { Component, OnInit, ViewChild } from '@angular/core';

import { UsersService } from '../services/users/users.service';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  @ViewChild(AlertComponent)
  private alert: AlertComponent;

  private password: string;
  private email: string;
  private admin: boolean;

  private processing: boolean = false;

  constructor(private users: UsersService) { }

  ngOnInit() {
  }

  public create(): void {
    this.processing = true;

    let errorList = [];
    if (!this.email) {
      errorList.push('Email field cannot be blank.');
    }
    if (!this.password) {
      errorList.push('Password field cannot be blank.');
    }
    // TODO: Validate email format

    if (errorList.length > 0) {   
      this.alert.showList('Error', errorList);
      this.processing = false;
      return; // Break out of the function before attempting to send bad info to the auth service
    }

    this.users.createUser(this.email, this.password, this.email, this.admin, {
      onSuccess: () => {
        this.processing = false;
        console.log('Sign up success!');
      },
      onFailure: (err: any) => {
        this.processing = false;
        this.alert.show(err.name, err.message);
      }
    })
  }
}
