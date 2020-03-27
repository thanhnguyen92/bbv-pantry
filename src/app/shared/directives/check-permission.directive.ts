import { Directive, Input, ViewContainerRef, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PublishSubcribeService } from '../services/pub-sub.service';
import { PubSubChannel } from '../constants/pub-sub-channels.contants';
import { Subscription } from 'rxjs';
import { Utilities } from '../services/utilities';

@Directive({
    selector: '[checkPermissions]'
})

export class CheckPermissionDirective implements OnInit, OnDestroy {
    @Input() requiredRoles: any[];

    private pubSub: Subscription;

    constructor(
        private _viewContainer: ViewContainerRef,
        private _templateRef: TemplateRef<any>,
        private _pubSubService: PublishSubcribeService,
        private _authService: AuthService) { }

    ngOnInit(): void {
        this.pubSub = this._pubSubService.subscribe(PubSubChannel.LOGGED_STATE, authState => {
            if (authState) {
                const roles = this._authService.userRoles as any[];
                const res = this.requiredRoles.filter((v) => {
                    return roles.indexOf(v) > -1;
                });

                console.log(res.length > 0);
                if (res.length > 0) {
                    this.render();
                } else {
                    this.clear();
                }
            } else {
                this.clear();
            }
        });
    }

    ngOnDestroy(): void {
        Utilities.unsubscribe(this.pubSub);
    }

    render() {
        this._viewContainer.clear();
        this._viewContainer.createEmbeddedView(this._templateRef);
    }

    clear() {
        this._viewContainer.clear();
    }
}
