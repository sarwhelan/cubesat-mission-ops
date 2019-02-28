import { Component, OnInit, ViewChild } from '@angular/core';

import { UsersService } from '../services/users/users.service';
import { User } from '../../classes/user';
import { ModalComponent } from '../modal/modal.component';
import { AuthService } from '../services/auth/auth.service';
import { AlertComponent } from '../alert/alert.component';

/**
 * A component for displaying the list of all users in the system.
 *
 * @export
 * @class UsersComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @ViewChild('deleteUserModal')
  private deleteUserModal: ModalComponent;
  @ViewChild('deleteUserAlert')
  private deleteUserAlert: AlertComponent;

  private userLimit: number = 10;
  private userList: User[];

  private deletingUser: User;
  private deleteConfirm: string;

  private processing: boolean;

  constructor(private users: UsersService, private auth: AuthService) { }

  ngOnInit() {
    this.initUserList();
  }

  /**
   * Populates the list of users, starting from the beginning
   * of the users collection.
   *
   * @private
   * @memberof UsersComponent
   */
  private initUserList() {
    this.users.getUsers()
      .subscribe((userList) => this.userList = userList);
  }

  /**
   * Prompts the user if they want to delete the given user from
   * the application.
   *
   * @param {User} user The user to be deleted.
   * @memberof UsersComponent
   */
  public promptDeleteUser(user: User): void {
    this.deleteUserModal.open();
    this.deletingUser = user;
  }

  /**
   * Deletes the user currently selected by promptDeleteUser(),
   * and then re-initializes the displayed users. If an error occurs,
   * it is displayed in the pop-up window.
   *
   * @memberof UsersComponent
   */
  public deleteUser(): void {
    this.processing = true;
    this.deleteUserAlert.hide();

    const sub = this.users.deleteUser(this.deletingUser).subscribe(() => {
      this.deleteUserModal.close();
      this.userList = null;
      this.initUserList();
    },
    (err) => {
      this.deleteUserAlert.show(err.name, err.message);
    },
    () => {
      // Unsubscribe upon completion (which should be immediately after next/error occurs)
      sub.unsubscribe();
      this.processing = false;
    });
  }
}
