import { Component, OnInit, isDevMode, ViewChild } from '@angular/core';

import { AuthService } from '../services/auth/auth.service';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  @ViewChild(AlertComponent)
  private alert: AlertComponent;

  private username: string;
  private password: string;
  private confirmPassword: string;
  private email: string;
  private phoneNumber: string;

  private processing: boolean = false;

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  public create(): void {
    this.processing = true;

    let errorList = [];
    if (!this.username) {
      errorList.push('Username field cannot be blank.');
    }
    if (!this.password) {
      errorList.push('Password field cannot be blank.');
    }
    if (!this.confirmPassword) {
      errorList.push('Confirm Password field cannot be blank.');
    }
    if (this.password !== this.confirmPassword) {
      errorList.push('Password field and Confirm Password field must match.');
    }
    // TODO: Validate email and phone number formats

    if (errorList.length > 0) {   
      this.alert.showList('Error', errorList);
      this.processing = false;
      return; // Break out of the function before attempting to send bad info to the auth service
    }

    this.auth.signUp(this.username, this.password, this.email, this.phoneNumber, {
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
