import { UserRole } from 'src/app/shared/enums/user-role.enum';
import { UserModel } from './../../shared/models/user.model';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

/** Services */
import { UserService } from 'src/app/shared/services/user.service';
import { Subscription } from 'rxjs';
import { Utilities } from 'src/app/shared/services/utilities';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { SecurityService } from 'src/app/auth/services/security.service';
import { AppService } from 'src/app/shared/services/app.service';
import { UserItemComponent } from './user-item/user-item.component';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  users: UserModel[] = [];
  dataSource = new MatTableDataSource(this.users);
  displayedColumns: string[] = ['displayName', 'email', 'emailVerified', 'roles', 'actions'];
  roleEnum = UserRole;

  private getUserSubscription: Subscription;

  constructor(
    private dialog: MatDialog,
    private appService: AppService,
    private userService: UserService,
    private securityService: SecurityService) { }

  ngOnInit() {
    this.appService.setLoadingStatus(true);
    this.getUserSubscription = this.userService.gets().subscribe(users => {
      this.users = users;
      this.dataSource.data = this.users;
      if (users && users.length > 0) {
        const userIds = users.map(t => t.id);
        this.securityService.getRolesByUserIds(userIds).subscribe(userRoles => {
          if (userRoles) {
            userRoles.forEach(roleItem => {
              const user = this.users.find(t => t.id === roleItem.userId);
              if (user) {
                user['roles'] = roleItem.roles;
              }
            });
          }
          this.appService.setLoadingStatus(false);
        }, () => this.appService.setLoadingStatus(false));
      } else {
        this.appService.setLoadingStatus(false);
      }
    }, () => this.appService.setLoadingStatus(false));
  }

  ngOnDestroy(): void {
    Utilities.unsubscribe(this.getUserSubscription);
  }

  onEdit(element: UserModel) {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(UserItemComponent, {
      data: { ...element },
      hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe((res: UserModel) => {
      if (res) {
        this.appService.setLoadingStatus(true);
        this.userService.get(res.id).subscribe(user => {
          if (user) {
            user.displayName = res.displayName;
            let updateUserInfoComplete = false;
            let updateUserRoleComplete = false;

            // Update user information
            this.userService.update(user).then(() => {
              updateUserInfoComplete = true;
              if (updateUserRoleComplete) {
                this.appService.setLoadingStatus(false);
                NotificationService.showSuccessMessage('Update successful');
              }
            })
              .catch(() => {
                this.appService.setLoadingStatus(false);
                NotificationService.showErrorMessage(
                  'Update failed, please try again'
                );
              });

            // Update user roles
            if (!res['roles']) {
              updateUserRoleComplete = true;
            } else {
              this.securityService.updateRoles(user.id, res['roles']).then(() => {
                updateUserRoleComplete = true;
                if (updateUserInfoComplete) {
                  this.appService.setLoadingStatus(false);
                  NotificationService.showSuccessMessage('Update successful');
                }
              })
                .catch(() => {
                  this.appService.setLoadingStatus(false);
                  NotificationService.showErrorMessage(
                    'Update failed, please try again'
                  );
                });
            }
          }
        }, () => this.appService.setLoadingStatus(false));
      }
    });
  }
}
