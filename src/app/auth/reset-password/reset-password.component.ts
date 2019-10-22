import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppService } from 'src/app/shared/services/app.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      userName: ['']
    });
  }

  ngOnInit() {}

  submitResetPasword(event) {
    if (event.keyCode === 13) {
      this.resetPassword();
    }
  }
  resetPassword() {
    const formVal = this.resetForm.value;
    const email = formVal.userName;

    this.appService.setLoadingStatus(true);
    this.authService
      .resetPassword(email)
      .then(async () => {
        this.appService.setLoadingStatus(false);
        NotificationService.showSuccessMessage(
          'An email has been sent to email with further instructions on how to reset your password.'
        );
      })
      .catch(err => {
        NotificationService.showErrorMessage(err.message);
        this.appService.setLoadingStatus(false);
      });
  }
  gotoLogin() {
    this.router.navigate(['auth', 'login']);
  }
}
