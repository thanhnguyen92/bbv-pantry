import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AppService } from 'src/app/shared/services/app.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserModel } from 'src/app/shared/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private authService: AuthService,
    private route: Router
  ) {
    this.registerForm = this.fb.group({
      userName: [''],
      displayName: [''],
      password: ['']
    });
  }

  ngOnInit() {}
  submitRegister(event) {
    if (event.keyCode === 13) {
      this.register();
    }
  }
  register() {
    if (!this.registerForm.valid) {
      NotificationService.showWarningMessage(
        'Please fill in some required fields'
      );
      return;
    }
    const formVal = this.registerForm.value;
    this.appService.setLoadingStatus(true);
    this.authService
      .register(formVal.userName, formVal.password)
      .then(async result => {
        const userData: UserModel = {
          id: result.user.uid,
          email: result.user.email,
          displayName: formVal.displayName,
          photoURL: result.user.photoURL,
          emailVerified: result.user.emailVerified
        };

        await this.authService.sendVerification();
        await this.authService.setUserData(userData);

        this.appService.setLoadingStatus(false);
        NotificationService.showSuccessMessage(
          'Register successful. Please check your email for verification'
        );
      })
      .catch(error => {
        this.appService.setLoadingStatus(false);
        NotificationService.showErrorMessage(error.message);
      });
  }

  gotoResetPassword() {
    this.route.navigate(['auth', 'reset-password']);
  }
}
