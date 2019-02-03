import { Component, OnInit } from '@angular/core';

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

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  public create(): void {
    // TODO: validate input

    this.auth.signUp(this.username, this.password, this.email, this.phoneNumber, {
      onSuccess: function() {
        console.log('Sign up success!');
      },
      onFailure: function(err: any) {
        console.log('Sign up failed.');
        console.log(err);
      }
    })
  }
}
