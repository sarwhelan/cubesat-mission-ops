import { Component, OnInit, isDevMode } from '@angular/core';

import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  private username: string;
  private password: string;
  private confirmPassword: string;
  private email: string;
  private phoneNumber: string;

  private showAlert: boolean = false;
  private errorHeading: string;
  private errorBody: string;

  private processing: boolean = false;

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  public create(): void {
    this.processing = true;
    // TODO: validate input

    this.auth.signUp(this.username, this.password, this.email, this.phoneNumber, {
      onSuccess: () => {
        this.processing = false;
        console.log('Sign up success!');
      },
      onFailure: (err: any) => {
        this.processing = false;

        this.showAlert = true;
        this.errorHeading = err.name;
        this.errorBody = err.message;
        console.log('Sign up failed.');
        console.log(err);
      }
    })
  }
}
