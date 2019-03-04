import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UsersService } from '../services/users/users.service';
import { User } from '../../classes/user';
import { ModalComponent } from '../modal/modal.component';
import { AuthService } from '../services/auth/auth.service';
import { AlertComponent } from '../alert/alert.component';
import { PagedList } from 'src/classes/paged-list';
import { PageChangeEvent, PaginationComponent } from '../pagination/pagination.component';

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
  @ViewChild(PaginationComponent)
  private pagination: PaginationComponent

  private _userLimit: number = 10;
  private get userLimit() {
    return this._userLimit;
  }
  private set userLimit(val: number) {
    this._userLimit = val;
    this.pagination.goToPage(1);
  }

  private userList: PagedList<User>;
  private pages: number = 1;

  private deletingUser: User;
  private deleteConfirm: string;

  private processing: boolean;

  constructor(private users: UsersService, private auth: AuthService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    let page = Number(this.activatedRoute.snapshot.queryParamMap.get('page'));
    let limit = Number(this.activatedRoute.snapshot.queryParamMap.get('limit'));
    
    if (limit) {
      this.userLimit = limit;
    }
    if (!page) {
      page = 1;
    } 

    this.pagination.goToPage(page);
  }

  /*
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
      this.getUsers(1);
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

  /**
   * Event received from the pagination component whenever
   * the current page is changed.
   *
   * @private
   * @param {PageChangeEvent} pageData An object containing the previous page and the current page.
   * @memberof UsersComponent
   */
  private pageChanged(pageData: PageChangeEvent): void {
    this.getUsers(pageData.page);
  }

  /**
   * Gets the given page of users, replacing the current page of users.
   *
   * @private
   * @param {number} [page=1] The page of users to get. Pages are 1-indexed.
   * @memberof UsersComponent
   */
  private getUsers(page: number = 1) {
    this.updateQueryParams(page);
    this.userList = null;
    this.users.getUsers(this.userLimit, page - 1)
      .subscribe((pagedUserList) => {
        this.userList = pagedUserList;
        this.pages = Math.ceil(this.userList.total / this.userLimit);
      });
  }

  private updateQueryParams(page: number) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        limit: this.userLimit,
        page: page
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
