import { SectionSelectionComponent } from './section-selection/section-selection.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Security } from 'src/app/shared/models/security.model';
import { SecurityService } from '../services/security.service';
import { map } from 'rxjs/operators';
import { UserRole } from 'src/app/shared/enums/user-role.enum';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private dialog: MatDialog,
    private securityService: SecurityService,
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
    this.authService.login(formVal.userName, formVal.password)
      .then(result => {
        if (result) {
          const loggedUser = result.user;
          if (!loggedUser.emailVerified) {
            NotificationService.showErrorMessage('Please check your email for verification');
            this.authService.logOut();
            return;
          }

          this.securityService.gets(t => t.where('userId', '==', loggedUser.uid)).get().pipe(map(entities => {
            return entities.docs.map(entity => {
              return entity.data();
            });
          })).subscribe(results => {
            if (results) {
              const security = results[0] as Security;

              this.authService.setIsLogged(true);
              this.authService.setUserRoles(security.roles);

              if (this.authService.isAdmin) {
                if (security.roles && security.roles.length > 1) {
                  // Show selection
                  this.showSectionSelection();
                }
              } else {
                // Navigate to User
                this.router.navigate(['user']);
              }
            } else {
              NotificationService.showErrorMessage('Access denied');
              this.authService.logOut();
            }
          });
        }
      }).catch(() => NotificationService.showErrorMessage(`Login failed. Please check your email and password`));
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

  private showSectionSelection() {
    const dialogRef = this.dialog.open(SectionSelectionComponent, {
      width: '250px',
      data: {},
      hasBackdrop: false
    });

    dialogRef.afterClosed().subscribe();
  }
}
