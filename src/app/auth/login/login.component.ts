import { NotificationService } from 'src/app/shared/services/notification.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      userName: ['toannguyen@yopmail.com'],
      password: ['123456']
    });
  }

  ngOnInit() { }

  login() {
    const formVal = this.loginForm.value;
    this.authService
      .login(formVal.userName, formVal.password)
      .catch(() => NotificationService.showErrorMessage('Login failed'));
  }

  register() {
    const formVal = this.loginForm.value;
    this.authService
      .register(formVal.userName, formVal.password)
      .then(result => {
        if (result) {
          window.alert(result);
        }
      })
      .catch(() => {
        NotificationService.showErrorMessage('Login failed');
      });
  }
}
