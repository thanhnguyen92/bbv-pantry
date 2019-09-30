import { UserRole } from './../../../shared/enums/user-role.enum';
import { UserModel } from './../../../shared/models/user.model';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent {
  isAdmin = false;
  isUser = false;

  constructor(
    public dialogRef: MatDialogRef<UserItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserModel) {
    const roles: any[] = this.data['roles'];
    if (roles) {
      roles.forEach(role => {
        switch (role) {
          case UserRole.Admin:
            this.isAdmin = true;
            break;
          case UserRole.User:
            this.isUser = true;
            break;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    const roles = [];
    if (this.isAdmin) {
      roles.push(UserRole.Admin);
    }
    if (this.isUser) {
      roles.push(UserRole.User);
    }
    if (roles.length === 0) {
      NotificationService.showWarningMessage('Please select at least one role');
      return;
    }
    this.data['roles'] = roles;
    this.dialogRef.close(this.data);
  }
}
