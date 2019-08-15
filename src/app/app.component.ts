import { PublishSubcribeService } from './shared/services/publish-subcribe.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { Utilities } from './shared/services/utilities';
import { PubSubChannel } from './shared/constants/pub-sub-channel.constant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'bbv-pantry';
  isLogged = false;

  private isLoggedSub: Subscription;

  constructor(
    private pubSubService: PublishSubcribeService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.pubSubService.subscribe(PubSubChannel.IS_USER_LOGGED, content => {
      this.isLogged = content;
    });
  }

  ngOnDestroy(): void {
    Utilities.unsubscribe(this.isLoggedSub);
  }

  logOut() {
    this.authService.logOut().then(() => {
      this.authService.setIsLogged(false);
      this.isLogged = false;
    });
  }
}
