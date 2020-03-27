import { Component, OnInit } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from './i18n/en';
import { AuthService } from 'app/shared/services/auth.service';
import { PublishSubcribeService } from 'app/shared/services/pub-sub.service';
import { PubSubChannel } from 'app/shared/constants/pub-sub-channels.contants';
import { UserModel } from 'app/shared/models/user.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  user: UserModel = {};

  constructor(
    private _authService: AuthService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _pubSubService: PublishSubcribeService) {
    this._fuseTranslationLoaderService.loadTranslations(english);
    this._pubSubService.subscribe(
      PubSubChannel.LOGGED_STATE, () => {
        const user = this._authService.currentUser;
        if (user) {
          this.user = {
            displayName: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.mobileNumber
          };
        }
      }
    );
  }

  ngOnInit() {
    const user = this._authService.currentUser;

    if (!user) {
      this.user = {
        displayName: 'Guest',
        email: 'guest@bbv.vn'
      };
    } else {
      this.user = user;
      this.user['displayName'] = `${user.firstName} ${user.lastName}`;
    }
  }
}
