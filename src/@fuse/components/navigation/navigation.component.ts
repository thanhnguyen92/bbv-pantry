import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { AuthService } from 'app/shared/services/auth.service';
import { PublishSubcribeService } from 'app/shared/services/pub-sub.service';
import { PubSubChannel } from 'app/shared/constants/pub-sub-channels.contants';
import { FuseNavigation } from '@fuse/types';

@Component({
    selector: 'fuse-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuseNavigationComponent implements OnInit {
    @Input()
    layout = 'vertical';

    @Input()
    navigation: any;

    roles = [];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     *
     * @param {ChangeDetectorRef} _changeDetectorRef
     * @param {FuseNavigationService} _fuseNavigationService
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
        private _pubSubService: PublishSubcribeService,
        private _authService: AuthService) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this._pubSubService.subscribe(PubSubChannel.LOGGED_STATE, authState => {
            // Load the navigation
            this.navigation = this._fuseNavigationService.getCurrentNavigation();
            const roles = this._authService.userRoles as any[];
            this.renderNavigation(this.navigation, roles);
            console.log(this.navigation, roles);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    private renderNavigation(navigation: FuseNavigation[], roles: any[], isChild = false) {
        navigation.forEach(nav => {
            nav.visible = false;
            if (!nav.permissions) {
                nav.visible = true;

                if (nav.children && nav.children.length > 0) {
                    this.renderNavigation(nav.children, roles, true);
                }
            } else {
                if (roles) {
                    const res = nav.permissions.filter((v) => {
                        return roles.indexOf(v) > -1;
                    });

                    if (res.length > 0) {
                        nav.visible = true;
                    }

                    if (nav.children && nav.children.length > 0) {
                        this.renderNavigation(nav.children, roles, true);
                    }
                }
            }

        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Load the navigation either from the input or from the service
        this.navigation = this.navigation || this._fuseNavigationService.getCurrentNavigation();

        // Subscribe to the current navigation changes
        this._fuseNavigationService.onNavigationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {

                // Load the navigation
                this.navigation = this._fuseNavigationService.getCurrentNavigation();
                const roles = this._authService.userRoles as any[];
                this.renderNavigation(this.navigation, roles);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to navigation item
        merge(
            this._fuseNavigationService.onNavigationItemAdded,
            this._fuseNavigationService.onNavigationItemUpdated,
            this._fuseNavigationService.onNavigationItemRemoved
        ).pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }
}
