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

  private email: string;
  private admin: boolean;

  private processing: boolean = false;

  constructor(private users: UsersService) { }

  ngOnInit() {
  }

  public create(): void {
    this.processing = true;
    this.alert.hide();

    let errorList = [];
    if (!this.email) {
      errorList.push('Email field cannot be blank.');
    }
    // TODO: Validate email format

    if (errorList.length > 0) {
      this.alert.showList('Error', errorList, 'danger');
      this.processing = false;
      return; // Break out of the function before attempting to send bad info to the auth service
    }

    this.users.createUser(this.email, null, this.email, this.admin, {
      onSuccess: () => {
        this.processing = false;
        this.alert.show('Success!', `User ${this.email} has been created, and a welcome email has been sent to them.`, 'success');
        
        this.email = '';
        this.admin = false;
      },
      onFailure: (err: any) => {
        this.processing = false;
        this.alert.show(err.name, err.message);
      }
    })
  }
}
