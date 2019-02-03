import { Component, OnInit } from '@angular/core';

import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private username: string;
  private password: string;

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  public signIn() {
    console.log(`Sign in triggered. Username is ${this.username} and password is ${this.password}`);
  }

}
