import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

/** Components */
import { UserItemAdminComponent } from './user-item/user-item.component';
import { UserRolesAdminComponent } from './user-roles/user-roles.component';

/** Models */
import { UserModel } from 'app/shared/models/user.model';
import { AppService } from 'app/shared/services/app.service';
import { Router, ActivatedRoute } from '@angular/router';

/** Services */
import { UserService } from 'app/shared/services/user.service';
import { Utilities } from 'app/shared/services/utilities';
import { AuthService } from 'app/shared/services/auth.service';
import { SecurityService } from 'app/shared/services/security.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { UserRole } from 'app/shared/enums/user-roles.enum';
import { UserViewModel } from 'app/shared/view-models/user.model';
import { SecurityModel } from 'app/shared/models/security.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserAdminComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  roleEnum = UserRole;
  dataSource = new MatTableDataSource<UserModel>();
  displayedColumns = ['firstName', 'lastName', 'email', 'emailSecondary', 'mobileNumber', 'birthday', 'roles', 'actions'];

  // Private
  private getUserSubscription: Subscription;
  private getRolesSub: Subscription;

  constructor(
    private _dialog: MatDialog,
    private _appService: AppService,
    private _route: Router,
    private _activatedRoute: ActivatedRoute,
    private _userService: UserService,
    private _securityService: SecurityService) { }

  ngOnInit() {
    this.onRefresh();
  }

  ngOnDestroy() {
    Utilities.unsubscribe(this.getUserSubscription);
  }

  applyFilter(event) {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }

  onRefresh() {
    this.paginator.pageSize = 10;
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;
    this.fetchData();
  }

  onEdit(user: UserViewModel) {
    this._appService.setLoadingStatus(true);
    Utilities.unsubscribe(this.getRolesSub);
    this.getRolesSub = this._securityService.getRolesByUserId(user.id).subscribe((security: SecurityModel) => {
      user.roles = [];
      if (security) {
        user.roles = security.roles;
      }
      this._appService.setLoadingStatus(false);

      this._dialog.closeAll();
      const dialogRef = this._dialog.open(UserItemAdminComponent, {
        width: '350px',
        data: { ...user },
        hasBackdrop: true
      });

      const afterClosedSub = dialogRef.afterClosed()
        .pipe(finalize(() => Utilities.unsubscribe(afterClosedSub)))
        .subscribe((res: UserViewModel) => {
          console.log(res);
          if (res) {
            this._appService.setLoadingStatus(true);
            this._userService.get(res.id).subscribe((resUser: UserViewModel) => {
              if (resUser) {
                resUser.firstName = res.firstName ? res.firstName : '';
                resUser.lastName = res.lastName ? res.lastName : '';
                resUser.emailSecondary = res.emailSecondary ? res.emailSecondary : '';
                resUser.displayName = res.firstName + ' ' + res.lastName;
                let updateUserInfoComplete = false;
                let updateUserRoleComplete = false;

                // Update user information
                this._userService.update(resUser).then(() => {
                  updateUserInfoComplete = true;
                  if (updateUserRoleComplete) {
                    this._appService.setLoadingStatus(false);
                    NotificationService.showSuccessMessage('Update successful');
                  }
                })
                  .catch(() => {
                    this._appService.setLoadingStatus(false);
                    NotificationService.showErrorMessage(
                      'Update failed, please try again'
                    );
                  });

                // Update user roles
                if (!res.roles) {
                  updateUserRoleComplete = true;
                } else {
                  resUser.roles = res.roles;
                  this._securityService.updateRoles(resUser.id, resUser.roles).then(() => {
                    updateUserRoleComplete = true;
                    if (updateUserInfoComplete) {
                      this._appService.setLoadingStatus(false);
                      NotificationService.showSuccessMessage('Update successful');
                    }
                  })
                    .catch(() => {
                      this._appService.setLoadingStatus(false);
                      NotificationService.showErrorMessage(
                        'Update failed, please try again'
                      );
                    });
                }
              }
            }, () => this._appService.setLoadingStatus(false));
          }
        });
    }, () => this._appService.setLoadingStatus(false));
  }

  assignRoles(user) {
    this._dialog.closeAll();
    const dialogRef = this._dialog.open(UserRolesAdminComponent, {
      width: '350px',
      data: { ...user },
      hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
    });
  }

  onDisable(user) {
    console.log(user);
  }

  private fetchData() {
    this._appService.setLoadingStatus(true);
    Utilities.unsubscribe(this.getUserSubscription);
    this.getUserSubscription = this._userService.gets()
      .subscribe((results: UserViewModel[]) => {
        if (results) {
          results.forEach(user => {
            if (user.displayName) {
              const names = user.displayName.split(' ');
              if (!user.firstName) { user.firstName = names[0]; }
              if (!user.lastName && names.length > 1) { user.lastName = names[1]; }
            }
          });
        }

        const userIds = results.map(t => t.id);
        this._securityService.getRolesByUserIds(userIds).subscribe(userRoles => {
          if (userRoles) {
            userRoles.forEach(roleItem => {
              const user = results.find(t => t.id === roleItem.userId);
              if (user) {
                user.roles = roleItem.roles;
              }
            });
          }

          this.dataSource.data = [...results];
          this.dataSource.sort = this.sort;
          this._appService.setLoadingStatus(false);
        }, () => this._appService.setLoadingStatus(false));
      }, () => this._appService.setLoadingStatus(false));
  }
}
