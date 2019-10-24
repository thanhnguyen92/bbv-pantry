import { PublishSubcribeService } from './shared/services/publish-subcribe.service';
import { Subscription } from 'rxjs';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewChecked,
  ViewChild,
  ElementRef
} from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { Utilities } from './shared/services/utilities';
import { PubSubChannel } from './shared/constants/pub-sub-channel.constant';
import { AppService } from './shared/services/app.service';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  NavigationStart
} from '@angular/router';
import { NotificationService } from './shared/services/notification.service';
import { PushNotificationModel } from './shared/models/push-notification.model';
import { PushNotificationService } from './shared/services/push-notification.service';
import { environment } from 'src/environments/environment';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlattener,
  MatTreeFlatDataSource,
  MatButton,
  MatMenu,
  MatDialog
} from '@angular/material';
import { map, finalize } from 'rxjs/operators';
import { PluginModel } from './shared/models/plugin.model';
import { PluginItemComponent } from './user/plugins/plugin-item/plugin-item.component';
import { PluginService } from './shared/services/plugin.service';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
  title = 'bbv-pantry';
  menuSelectedName = '';
  haveLogin = false;
  isLogged = false;
  isLoading = false;
  isPantryApp = false;
  loggedUser;
  assetsUrl = environment.assetsUrl;
  activeRouteName: string;
  menuItems: PluginModel[];
  
  @ViewChild('buttonMenu', { static: false }) buttonMenu: MatButton;
  
  over = 'over';
  private isLoggedSub: Subscription;
  private isLoadingSub: Subscription;
  private notificationSubscription: Subscription;

  constructor(
    public authService: AuthService,
    private route: Router,
    private pubSubService: PublishSubcribeService,
    private appService: AppService,
    private cdr: ChangeDetectorRef,
    private pushNotificationService: PushNotificationService,
    private dialog: MatDialog,
    private pluginService: PluginService
  ) {
    this.isLogged = authService.getIsLogged();
    this.isLoadingSub = this.appService.isLoading.subscribe(
      (isLoading: boolean) => {
        this.isLoading = isLoading;
      }
    );

    this.loggedUser = this.authService.currentUser;
    this.route.events.subscribe(res => {
      this.activeRouteName = this.route.url;
    });
  }

  ngOnInit(): void {
    NotificationService.requestPermissionNotificationWindows();

    this.pubSubService.subscribe(PubSubChannel.IS_USER_LOGGED, content => {
      this.isLogged = content;
      setTimeout(() => {
        this.loggedUser = this.authService.currentUser;
      }, 100);
    });

    this.loadPluginsMenu();
  }

  ngOnDestroy(): void {
    Utilities.unsubscribe(this.isLoggedSub);
    Utilities.unsubscribe(this.isLoadingSub);
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  logOut() {
    this.authService.logOut().then(() => {
      this.loggedUser = null;
      this.authService.setIsLogged(false);
      this.isLogged = false;
    });
  }

  logIn() {
    this.route.navigate(['auth', 'login']);
  }

  gotoRegister() {
    this.route.navigate(['auth', 'register']);
  }
  goToAdmin() {
    this.setupNotification();
    this.route.navigate(['admin']);
  }

  goToUser() {
    this.setupNotification();
    this.route.navigate(['user']);
  }
  gotoUserOrder() {
    (this.buttonMenu._elementRef as ElementRef).nativeElement.click();
    this.setupNotification();
    this.route.navigate(['user', 'pantry', 'order']);
  }
  goToRestaurant() {
    (this.buttonMenu._elementRef as ElementRef).nativeElement.click();
    this.setupNotification();
    this.route.navigate(['admin/restaurant']);
  }

  goToMenu() {
    (this.buttonMenu._elementRef as ElementRef).nativeElement.click();
    this.setupNotification();
    this.route.navigate(['admin', 'menu']);
  }

  goToUserHistory() {
    (this.buttonMenu._elementRef as ElementRef).nativeElement.click();
    this.setupNotification();
    this.route.navigate(['user', 'pantry', 'history']);
  }

  goToBooking() {
    (this.buttonMenu._elementRef as ElementRef).nativeElement.click();
    this.setupNotification();
    this.route.navigate(['admin', 'booking']);
  }

  goToOrder() {
    (this.buttonMenu._elementRef as ElementRef).nativeElement.click();
    this.setupNotification();
    this.route.navigate(['admin', 'order']);
  }

  goToUserManagement() {
    (this.buttonMenu._elementRef as ElementRef).nativeElement.click();
    this.setupNotification();
    this.route.navigate(['admin', 'user-management']);
  }

  goToMenuHappyHours() {
    (this.buttonMenu._elementRef as ElementRef).nativeElement.click();
    this.route.navigate(['user', 'pantry', 'happy-hours']);
  }

  goToRegisters() {
    (this.buttonMenu._elementRef as ElementRef).nativeElement.click();
    this.route.navigate(['user', 'pantry', 'registers']);
  }
  gotoPantry() {
    (this.buttonMenu._elementRef as ElementRef).nativeElement.click();
    this.route.navigate(['user', 'pantry']);
  }
  profile() {
    this.route.navigate(['user', 'profile']);
  }

  gotoPmWeb() {
    this.haveLogin = false;
    (this.buttonMenu._elementRef as ElementRef).nativeElement.click();
    this.route.navigate(['user', 'pm-web']);
  }
  gotoPlanner() {
    this.haveLogin = false;
    (this.buttonMenu._elementRef as ElementRef).nativeElement.click();
    this.route.navigate(['user', 'project-planner']);
  }

  gotoWiki() {
    this.haveLogin = false;
    (this.buttonMenu._elementRef as ElementRef).nativeElement.click();
    this.route.navigate(['user', 'wiki']);
  }
  redirect(menuItem) {
    this.menuSelectedName = menuItem.routeName;
    this.haveLogin = false;
    (this.buttonMenu._elementRef as ElementRef).nativeElement.click();
    this.route.navigate(menuItem.routeRedirect, {
      queryParams: { url: menuItem.url }
    });
  }
  gotoPerfomanceReview() {}
  gotoProficiencyEvalution() {}
  isActiveMenuItem(routeName: string) {
    if (!this.activeRouteName) {
      return false;
    }
    return this.activeRouteName.indexOf(routeName) !== -1;
  }

  showPopupAddPluginItem() {
    this.dialog.closeAll();
    const diaLogRef = this.dialog.open(PluginItemComponent, {
      width: '250px',
      data: {},
      hasBackdrop: false
    });

    const dialogSubscription = diaLogRef
      .afterClosed()
      .pipe(finalize(() => Utilities.unsubscribe(dialogSubscription)))
      .subscribe((data: PluginModel) => {
        if (data) {
          let service;
          if (data.id) {
            service = this.pluginService.update({ ...data });
          } else {
            service = this.pluginService.add({
              ...data
              // ...{ restaurantId: this.restaurantId }
            });
          }
          service
            .then(() => {
              NotificationService.showSuccessMessage('Save successful');
            })
            .catch(() => {
              NotificationService.showErrorMessage('Save failed');
            });
        }
      });
  }
  removePlugin(plugin) {
    this.showDialogConfirmDelete(plugin);
  }
  get profileName() {
    let result = '';
    const displayName = this.loggedUser.displayName || '';
    const firstChar = displayName.slice(0, 1);
    result += firstChar;
    const arrayName = displayName.split(' ');
    if (arrayName.length >= 2) {
      result += arrayName[1].slice(0, 1);
    }
    return result;
  }

  private setupNotification() {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    const user = this.authService.currentUser;
    if (user) {
      this.notificationSubscription = this.pushNotificationService
        .getByEmailOrUserId(user.email, user.uid)
        .subscribe(res => {
          if (res && res !== [] && res.length > 0) {
            NotificationService.showNotificationWindows(
              (res[0] as PushNotificationModel).message
            );
            const type = typeof res;
            if (type === 'object') {
              this.pushNotificationService
                .delete((res[0] as PushNotificationModel).id)
                .then(result => console.log(result));
              // res.forEach(item => {
              //   this.pushNotificationService
              //     .delete((res as PushNotificationModel).uid)
              //     .then(result => console.log(result));
              // });
            }
          }
        });
    }
  }
  private loadPluginsMenu() {
    const currentUser = this.authService.currentUser;
    const currentUserId = currentUser ? currentUser.id : '';
    // if (currentUserId) {
    //   this.menuItems = [];
    //   return;
    // }
    this.pluginService
      .getByUserId(currentUserId)
      .pipe(
        map(entities => {
          return entities.map(entity => {
            return {
              name: entity.name,
              routeName: entity.name,
              routeRedirect: ['user', 'plugins'],
              url: entity.url,
              id: entity.id
            };
          });
        })
      )
      .subscribe(res => {
        console.log(res);
        this.menuItems = res;
      });
  }

  private showDialogConfirmDelete(plugin: PluginModel) {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title: 'Confirmation',
        content: 'Are you sure to delete?',
        noButton: 'No',
        yesButton: 'Yes'
      }
    });
    const deleteConfirmationSub = dialogRef
      .afterClosed()
      .pipe(finalize(() => Utilities.unsubscribe(deleteConfirmationSub)))
      .subscribe(res => {
        if (res) {
          this.pluginService
            .delete(plugin.id)
            .then(() => {
              NotificationService.showSuccessMessage('Delete successful');
            })
            .catch(() => {
              NotificationService.showErrorMessage(
                'Something went wrong, please try again'
              );
            });
        }
      });
  }
}
