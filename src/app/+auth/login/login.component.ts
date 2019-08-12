import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

  ngOnInit() {}

  login() {
    console.log(this.loginForm.value);
    // this.router.navigate['admin'];
    const formVal = this.loginForm.value;
    this.authService
      .SigIn(formVal.userName, formVal.password)
      .then(result => {
        debugger;
        if (result) {
          this.router.navigate(['admin']);
        }
      })
      .catch(error => this.messageFailedCallBack(error));
  }

  register() {
    const formVal = this.loginForm.value;
    this.authService
      .SignUp(formVal.userName, formVal.password)
      .then(result => {
        if (result) {
          window.alert(result);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  // getFontSize() {
  //   return Math.max(10, [16, Validators.min(10)]);
  // }

  private messageSuccessCallback(message) {
    window.alert(message);
  }

  private messageFailedCallBack(message) {
    window.alert(message);
  }
}
