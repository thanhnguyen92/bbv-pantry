import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { navigation } from 'app/navigation/navigation';
import { PublishSubcribeService } from 'app/shared/services/pub-sub.service';
import { AuthService } from 'app/shared/services/auth.service';
import { UserModel } from 'app/shared/models/user.model';
import { PubSubChannel } from 'app/shared/constants/pub-sub-channels.contants';
import { UserService } from '../../../shared/services/user.service';

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit, OnDestroy {
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];
    isUserLogged = false;
    userInfo: UserModel;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */
    constructor(
        private _fuseSidebarService: FuseSidebarService,
        private _pubSubService: PublishSubcribeService,
        private _fuseConfigService: FuseConfigService,
        private _translateService: TranslateService,
        private _authService: AuthService,
        private _userService: UserService
    ) {
        this.userInfo = {
            displayName: 'Guest',
            email: 'guest@bbv.vn'
        };

        // Set the defaults
        this.userStatusOptions = [
            {
                title: 'Online',
                icon: 'icon-checkbox-marked-circle',
                color: '#4CAF50'
            },
            {
                title: 'Away',
                icon: 'icon-clock',
                color: '#FFC107'
            },
            {
                title: 'Do not Disturb',
                icon: 'icon-minus-circle',
                color: '#F44336'
            },
            {
                title: 'Invisible',
                icon: 'icon-checkbox-blank-circle-outline',
                color: '#BDBDBD'
            },
            {
                title: 'Offline',
                icon: 'icon-checkbox-blank-circle-outline',
                color: '#616161'
            }
        ];

        this.languages = [
            {
                id: 'en',
                title: 'English',
                flag: 'us'
            },
            {
                id: 'tr',
                title: 'German',
                flag: 'de'
            }
        ];

        this.navigation = navigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        // Check authentication state
        this.isUserLogged = this._authService.isAuthenticated;
        this._pubSubService.subscribe(
            PubSubChannel.LOGGED_STATE,
            (authState: boolean) => {
                this.isUserLogged = authState;
                if (this._authService.currentUser) {
                    this.userInfo = {
                        displayName: `${this._authService.currentUser.firstName} ${this._authService.currentUser.lastName}`,
                        email: this._authService.currentUser.email,
                        phone: this._authService.currentUser.mobileNumber
                    } as UserModel;
                }
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(settings => {
                this.horizontalNavbar =
                    settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, {
            id: this._translateService.currentLang
        });

        if (this._authService.currentUser) {
            this.userInfo = {
                displayName: `${this._authService.currentUser.firstName} ${this._authService.currentUser.lastName}`,
                email: this._authService.currentUser.email,
                phone: this._authService.currentUser.mobileNumber
            } as UserModel;
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void {
        // Do your search here...
        console.log(value);
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }

    login() {
        this._authService.msalLogin().then(async idToken => {
            const msUser = await this._authService.msalGetUser();

            console.log(msUser, idToken);
            await this._userService
                .getBbvUserInfo(msUser.displayableId, idToken)
                .subscribe(
                    user => {
                        this._authService.currentUser = user;
                        this._pubSubService.publish(
                            PubSubChannel.LOGGED_STATE,
                            true
                        );
                    },
                    err => console.log('login toolbar' + err)
                );
        });
    }

    logOut() {
        this._authService.logOut();
    }

    get shortName() {
        const displayName = this.userInfo.displayName || '';
        const arrayName = displayName.split(' ');
        if (arrayName.length === 1) {
            return arrayName[0].slice(0, 1);
        } else {
            return (
                arrayName[0].slice(0, 1) +
                arrayName[arrayName.length - 1].slice(0, 1)
            );
        }
    }
}
