import { PublishSubcribeService } from './shared/services/publish-subcribe.service';
import { Subscription } from 'rxjs';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewChecked
} from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { Utilities } from './shared/services/utilities';
import { PubSubChannel } from './shared/constants/pub-sub-channel.constant';
import { AppService } from './shared/services/app.service';
import { Router } from '@angular/router';
import { NotificationService } from './shared/services/notification.service';
import { PushNotificationModel } from './shared/models/push-notification.model';
import { PushNotificationService } from './shared/services/push-notification.service';
import { environment } from 'src/environments/environment';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';

const MENU_DATA: MenuNode[] = [
  {
    name: 'Admin',
    action: 'goToAdmin()',
    children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }]
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{ name: 'Broccoli' }, { name: 'Brussel sprouts' }]
      },
      {
        name: 'Orange',
        children: [{ name: 'Pumpkins' }, { name: 'Carrots' }]
      }
    ]
  }
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
  title = 'bbv-pantry';
  isLogged = false;
  isLoading = false;
  loggedUser;
  assetsUrl = environment.assetsUrl;

  treeControl = new FlatTreeControl<MenuFlatNode>(
    node => node.level,
    node => node.expandable
  );
  // tslint:disable-next-line:variable-name
  private _transformer = (node: MenuNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      acction: node.action,
      level
    };
  };
  // tslint:disable-next-line:member-ordering
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  /** Flat node with expandable and level information */
  hasChild = (_: number, node: MenuFlatNode) => node.expandable;
  private isLoggedSub: Subscription;
  private isLoadingSub: Subscription;
  private notificationSubscription: Subscription;

  constructor(
    public authService: AuthService,
    private route: Router,
    private pubSubService: PublishSubcribeService,
    private appService: AppService,
    private cdr: ChangeDetectorRef,
    private pushNotificationService: PushNotificationService
  ) {
    this.isLogged = authService.getIsLogged();
    this.isLoadingSub = this.appService.isLoading.subscribe(
      (isLoading: boolean) => {
        this.isLoading = isLoading;
      }
    );

    this.loggedUser = this.authService.currentUser;

    this.dataSource.data = MENU_DATA;
  }

  ngOnInit(): void {
    NotificationService.requestPermissionNotificationWindows();

    this.pubSubService.subscribe(PubSubChannel.IS_USER_LOGGED, content => {
      this.isLogged = content;
      setTimeout(() => {
        this.loggedUser = this.authService.currentUser;
      }, 100);
    });
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

  goToAdmin() {
    this.setupNotification();
    this.route.navigate(['admin']);
  }

  goToUser() {
    this.setupNotification();
    this.route.navigate(['user']);
  }

  goToRestaurant() {
    this.setupNotification();
    this.route.navigate(['admin/restaurant']);
  }

  goToMenu() {
    this.setupNotification();
    this.route.navigate(['admin', 'menu']);
  }

  goToUserHistory() {
    this.setupNotification();
    this.route.navigate(['user', 'history']);
  }

  goToBooking() {
    this.setupNotification();
    this.route.navigate(['admin', 'booking']);
  }

  goToOrder() {
    this.setupNotification();
    this.route.navigate(['admin', 'order']);
  }

  goToUserManagement() {
    this.setupNotification();
    this.route.navigate(['admin', 'user-management']);
  }
  profile() {
    this.route.navigate(['user', 'profile']);
  }
  get profileName() {
    let result = '';
    const displayName = this.loggedUser.displayName || '';
    const firstChar = displayName.slice(0, 1);
    result += firstChar;
    const arrayName = this.loggedUser.displayName.split(' ');
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
}

interface MenuNode {
  name: string;
  action?: string;
  children?: MenuNode[];
}

interface MenuFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
