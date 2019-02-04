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
    // TODO: validate input
    let errorList = [];
    if (!this.username) {
      errorList.push('A username must be provided.');
    }
    if (!this.password) {
      errorList.push('A password must be provided.');
    }
    if (this.password !== this.confirmPassword) {
      errorList.push('Password and Confirm Password fields must match.');
    }

    if (errorList.length > 0) {
      let errorMessage = '';
      for (let i = 0; i < errorList.length; i++) {
        errorMessage += errorList[i];
        if (i < errorList.length - 1) {
          errorMessage += ' ';
        }
      }
      
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
