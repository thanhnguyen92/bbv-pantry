import { Component, Inject, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { navigation } from 'app/navigation/navigation';
import { locale as navigationEnglish } from 'app/navigation/i18n/en';
import { locale as generalEnglish } from './shared/i18n/en';
import { locale as navigationTurkish } from 'app/navigation/i18n/tr';
import { FuseNavigation } from '@fuse/types';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { AppService } from './shared/services/app.service';
import { BroadcastService } from '@azure/msal-angular';
import { Utilities } from './shared/services/utilities';
import { AuthService } from './shared/services/auth.service';
import { NotificationService } from './shared/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    fuseConfig: any;
    navigation: FuseNavigation[];
    isLoading = false;

    // Private
    private _unsubscribeAll: Subject<any>;
    private _loginFailureSubscription: Subscription;
    private _loginSuccessSubscription: Subscription;

    /**
     * Constructor
     *
     * @param {DOCUMENT} document
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseSplashScreenService} _fuseSplashScreenService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {Platform} _platform
     * @param {TranslateService} _translateService
     */
    constructor(
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _fuseProgressBarService: FuseProgressBarService,
        private _translateService: TranslateService,
        private _platform: Platform,
        private _dialog: MatDialog,
        private _appService: AppService,
        private _authService: AuthService,
        private _cdr: ChangeDetectorRef,
        private msalBroadcastService: BroadcastService) {
        // Get default navigation
        this.navigation = navigation;

        // Register the navigation to the service
        this._fuseNavigationService.register('main', this.navigation);

        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('main');

        // Add languages
        this._translateService.addLangs(['en', 'de']);

        // Set the default language
        this._translateService.setDefaultLang('en');

        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(navigationEnglish, generalEnglish, navigationTurkish);

        // Use a language
        this._translateService.use('en');

        this._appService.isLoading.subscribe(
            (isLoading: boolean) => {
                setTimeout(() => {
                    this.isLoading = isLoading;
                });

                if (isLoading) {
                    this._fuseProgressBarService.show();
                    this._fuseProgressBarService.setMode('indeterminate');
                } else {
                    this._fuseProgressBarService.hide();
                }
            }
        );

        Utilities.unsubscribe(this._loginFailureSubscription);
        this._loginFailureSubscription = this.msalBroadcastService.subscribe('msal:loginFailure', (payload) => {
            if (payload) {
                // Handle error
                switch (payload.error) {
                    case 'popup_window_error':
                        this._dialog.open(ConfirmDialogComponent, {
                            width: '250px',
                            data: { title: 'Warning', content: payload.errorDesc, noButton: 'BUTTON.OK' }
                        });
                        // NotificationService.showWarningMessage(payload.errorDesc, '', {}, 6500);
                        break;
                }
                NotificationService.showWarningMessage(payload.errorDesc, '', {}, 3000);
            }
            // console.log('loginFailure', payload);
        });

        Utilities.unsubscribe(this._loginSuccessSubscription);
        this._loginSuccessSubscription = this.msalBroadcastService.subscribe('msal:loginSuccess', (payload) => {
            // console.log('loginSuccess', payload);
            if (payload) {
                this._authService.accessToken = payload.token;
            }
        });

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix Start
         * ----------------------------------------------------------------------------------------------------
         */

        /**
         * If you are using a language other than the default one, i.e. Turkish in this case,
         * you may encounter an issue where some of the components are not actually being
         * translated when your app first initialized.
         *
         * This is related to ngxTranslate module and below there is a temporary fix while we
         * are moving the multi language implementation over to the Angular's core language
         * service.
         **/

        // Set the default language to 'en' and then back to 'tr'.
        // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
        // been selected and there is no way to force it, so we overcome the issue by switching
        // the default language back and forth.
        /**
         setTimeout(() => {
            this._translateService.setDefaultLang('en');
            this._translateService.setDefaultLang('tr');
         });
         */

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix End
         * ----------------------------------------------------------------------------------------------------
         */

        // Add is-mobile class to the body if the platform is mobile
        if (this._platform.ANDROID || this._platform.IOS) {
            this.document.body.classList.add('is-mobile');
        }

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {

                this.fuseConfig = config;

                // Boxed
                if (this.fuseConfig.layout.width === 'boxed') {
                    this.document.body.classList.add('boxed');
                }
                else {
                    this.document.body.classList.remove('boxed');
                }

                // Color theme - Use normal for loop for IE11 compatibility
                this.document.body.classList.forEach(className => {
                    if (className.startsWith('theme-')) {
                        this.document.body.classList.remove(className);
                    }
                });

                // for (let i = 0; i < this.document.body.classList.length; i++) {
                //     const className = this.document.body.classList[i];

                //     if (className.startsWith('theme-')) {
                //         this.document.body.classList.remove(className);
                //     }
                // }

                this.document.body.classList.add(this.fuseConfig.colorTheme);
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        this.msalBroadcastService.getMSALSubject().next(1);
        Utilities.unsubscribe(this._loginFailureSubscription);
        Utilities.unsubscribe(this._loginSuccessSubscription);
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
}
