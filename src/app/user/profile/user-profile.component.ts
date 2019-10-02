import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserModule } from '../user.module';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: UserModel;
  formGroup: FormGroup;
  constructor(
    private auth: AuthService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      email: [''],
      displayName: ['']
    });
    this.disableFormControls();
  }

  ngOnInit() {
    const userId = this.auth.currentUser.id;
    if (userId) {
      this.userService.get(userId).subscribe(res => {
        this.user = res;
        this.formGroup.patchValue(res, { emitEvent: false });
      });
    }
  }
  updateProfile() {
    this.user.displayName = this.formGroup.controls.displayName.value;
    this.userService.update(this.user).then(res => {
      NotificationService.showSuccessMessage('Update successfully.');
    });
  }
  private disableFormControls() {
    this.formGroup.controls.email.disable();
  }
}
