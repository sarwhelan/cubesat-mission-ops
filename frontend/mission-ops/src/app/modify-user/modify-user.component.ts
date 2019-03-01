import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from '../../classes/user';
import { UsersService } from '../services/users/users.service';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.scss']
})
export class ModifyUserComponent implements OnInit {

  @ViewChild(AlertComponent)
  private alert: AlertComponent;

  private user: User;

  private processing: boolean = false;

  constructor(private route: ActivatedRoute, private users: UsersService) { }

  ngOnInit() {
    const userId = this.route.snapshot.queryParamMap.get('id');
    this.users.getUser(userId).subscribe((u) => {
      this.user = u;
    }, (err) => {
      console.log(err);
    });
  }

  public saveChanges(): void {
    // TODO: validate form values

    this.alert.hide();
    this.processing = true;

    this.users.updateUser(this.user).subscribe(() => {
      this.alert.show('Success!', 'User was updated successfully.', 'success')
    }, (err) => {
      this.alert.show(err.name, err.message, 'danger');
      this.processing = false;
    }, () => {
      this.processing = false;
    })
  }
}
