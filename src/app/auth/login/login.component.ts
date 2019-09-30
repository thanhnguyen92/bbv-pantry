import { UserService } from 'src/app/shared/services/user.service';
import { SectionSelectionComponent } from './section-selection/section-selection.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Security } from 'src/app/shared/models/security.model';
import { SecurityService } from '../services/security.service';
import { UserRole } from 'src/app/shared/enums/user-role.enum';
import { MatDialog } from '@angular/material';
import { AppService } from 'src/app/shared/services/app.service';
import { PublishSubcribeService } from 'src/app/shared/services/publish-subcribe.service';
import { PubSubChannel } from 'src/app/shared/constants/pub-sub-channel.constant';
import { UserModel } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLogged = false;
  adminAccess = false;
  isRegister = false;

  constructor(
    private route: ActivatedRoute,
    private pubSubService: PublishSubcribeService,
    private dialog: MatDialog,
    private securityService: SecurityService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private appService: AppService,
    private userService: UserService) {
    this.loginForm = this.formBuilder.group({
      userName: [''],
      displayName: [''],
      isRegister: false,
      password: ['']
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.adminAccess = params.spadmin;
      }
    });

    this.isLogged = this.authService.getIsLogged();
    if (this.isLogged) {
      if (this.authService.isAdmin) {
        // Show selection
        this.showSectionSelection();
      } else {
        // Navigate to User
        this.router.navigate(['user']);
      }
    }

    this.pubSubService.subscribe(PubSubChannel.IS_USER_LOGGED, content => {
      this.isLogged = content;
    });
  }

  login() {
    this.appService.setLoadingStatus(true);
    const formVal = this.loginForm.value;
    this.authService
      .login(formVal.userName, formVal.password)
      .then(async result => {
        if (result) {
          const loggedUser = result.user;
          if (!loggedUser.emailVerified) {
            NotificationService.showErrorMessage(
              'Please check your email for verification'
            );
            this.appService.setLoadingStatus(false);
            this.authService.logOut();
            return;
          } else {
            // Update state in database
            await this.userService.get(loggedUser.uid).subscribe(async user => {
              if (!user.emailVerified) {
                user.emailVerified = true;
                loggedUser.displayName = user.displayName;
                this.authService.currentUser = loggedUser;
                await this.authService.setUserData(user);
              }
            });
          }

          await this.securityService.getRoles(loggedUser.uid).subscribe(results => {
            this.appService.setLoadingStatus(false);
            if (results) {
              const security = results[0] as Security;

              this.authService.setIsLogged(true);
              this.authService.setUserRoles(security.roles);
              this.isLogged = true;
              if (this.authService.isAdmin) {
                // Show selection
                this.showSectionSelection();
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
      })
      .catch(() => {
        NotificationService.showErrorMessage(
          `Login failed. Please check your email and password`
        );
        this.appService.setLoadingStatus(false);
        this.isLogged = false;
      });
  }

  register() {
    const formVal = this.loginForm.value;
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

        // Add roles
        if (this.adminAccess) {
          await this.securityService.assignRoles(userData.id, [
            UserRole.Admin,
            UserRole.User
          ]);
        } else {
          await this.securityService.assignRoles(userData.id, [UserRole.User]);
        }

        await this.authService.sendVerification();
        await this.authService.setUserData(userData);

        this.appService.setLoadingStatus(false);
        NotificationService.showSuccessMessage(
          'Register successful. Please check your email for verification'
        );
        this.authService.logOut();
      })
      .catch(error => {
        this.appService.setLoadingStatus(false);
        NotificationService.showErrorMessage(error.message);
      });
  }

  onRegisterAccount(event) {
    if (event) {
      this.isRegister = event.checked;
    }
  }

  private showSectionSelection() {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(SectionSelectionComponent, {
      width: '250px',
      data: {},
      hasBackdrop: false
    });

    dialogRef.afterClosed().subscribe();
  }
}
