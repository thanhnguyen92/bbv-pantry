import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

/** Azure */
import { MsalService } from '@azure/msal-angular';

/** App Services */
import { AuthService } from 'app/shared/services/auth.service';
import { UserService } from 'app/shared/services/user.service';
import { PublishSubcribeService } from 'app/shared/services/pub-sub.service';
import { PubSubChannel } from 'app/shared/constants/pub-sub-channels.contants';
import { AppService } from '../../shared/services/app.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private _pubSubService: PublishSubcribeService,
        private _msalService: MsalService,
        private _authService: AuthService,
        private _appService: AppService,
        private _userService: UserService,
        protected router: Router) { }

    async canActivate() {
        if (!this._authService.accessToken && !this._authService.currentUser) {
            let result = false;
            await this._authService.msalLogin().then(async idToken => {
                const msUser = await this._authService.msalGetUser();

                this._appService.setLoadingStatus(true);
                await this._userService.getUserInfo(msUser.displayableId, idToken).toPromise()
                    .then(user => {
                        console.log(user);
                        this._authService.currentUser = user;
                        this._pubSubService.publish(PubSubChannel.IS_USER_LOGGED, true);
                        result = true;
                    }).catch(err => {
                        result = false;
                        console.log(err);
                    });
            }).catch(err => console.log(err));

            return result;
        } else {
            return true;
        }
    }
}
