import { PublishSubcribeService } from './shared/services/publish-subcribe.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { Utilities } from './shared/services/utilities';
import { PubSubChannel } from './shared/constants/pub-sub-channel.constant';
import { AppService } from './shared/services/app.service';
import { Router } from '@angular/router';
import { NotificationService } from './shared/services/notification.service';

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

  private isLoggedSub: Subscription;
  private isLoadingSub: Subscription;
  constructor(
    public authService: AuthService,
    private route: Router,
    private pubSubService: PublishSubcribeService,
    private appService: AppService,
    private cdr: ChangeDetectorRef) {
    this.isLogged = authService.getIsLogged();
    this.isLoadingSub = this.appService.isLoading.subscribe(
      (isLoading: boolean) => {
        this.isLoading = isLoading;
      }
    );

    this.loggedUser = this.authService.currentUser;
  }

  ngOnInit(): void {
    NotificationService.requestPermissionNotificationWindows();

    this.pubSubService.subscribe(PubSubChannel.IS_USER_LOGGED, content => {
      this.isLogged = content;
      this.loggedUser = this.authService.currentUser;
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
    this.route.navigate(['admin']);
  }

  goToUser() {
    this.route.navigate(['user']);
  }

  goToRestaurant() {
    this.route.navigate(['admin', 'restaurant']);
  }

  goToMenu() {
    this.route.navigate(['admin', 'menu']);
  }

  goToUserHistory() {
    this.route.navigate(['user', 'history']);
  }

  goToBooking() {
    this.route.navigate(['admin', 'booking']);
  }

  goToOrder() {
    this.route.navigate(['admin', 'order']);
  }
}
