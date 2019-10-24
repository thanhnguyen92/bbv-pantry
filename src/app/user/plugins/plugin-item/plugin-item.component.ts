import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PluginModel } from 'src/app/shared/models/plugin.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { PluginService } from 'src/app/shared/services/plugin.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-plugin-item',
  templateUrl: './plugin-item.component.html',
  styleUrls: ['./plugin-item.component.scss']
})
export class PluginItemComponent implements OnInit {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<any>,
    private pluginService: PluginService,
    private authService: AuthService
  ) {
    this.form = fb.group({
      name: ['', Validators.required],
      url: ['', Validators.required]
    });
  }

  ngOnInit() {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.form.valid) {
      const data = this.form.value as PluginModel;
      const currentUserId = this.authService.currentUser;
      data.userId = currentUserId ? currentUserId.id : '';
      this.pluginService
        .add(data)
        .then(res => {
          console.log(res);
          NotificationService.showSuccessMessage('Add Plugin successfully.');
        })
        .catch(err => {
          NotificationService.showErrorMessage('Add Plugin failled.');
        })
        .finally(() => {
          this.dialogRef.close();
        });
    }
  }
}
