import 'hammerjs';
import { fuseConfig } from 'app/fuse-config';
import { environment } from 'environments/environment';

/** Components */
import { AppComponent } from 'app/app.component';
import { Error404Component } from './errors/error-404/error-404.component';
import { Error500Component } from './errors/error-500/error-500.component';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';

/** App Modules */
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from '@angular/fire';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AuthGuard } from './core/guards/auth.guard';

/** Telerik Modules */
import { WindowModule } from '@progress/kendo-angular-dialog';

/** Fuse Modules */
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

/** Mat Modules */
import { MatTableModule, MatPaginatorModule, MatSnackBarModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

/** Services */
import { AppService } from './shared/services/app.service';
import { AuthService } from './shared/services/auth.service';

/** Azure */
import { MsalInterceptor, MsalModule } from '@azure/msal-angular';
import { UserService } from './shared/services/user.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IframeComponent } from './iframe/iframe.component';
import { SafePipe } from './iframe/safe-url.pipe';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

const appRoutes: Routes = [
    { path: '', loadChildren: './main/main.module#MainModule' },
    { path: 'main', loadChildren: './main/main.module#MainModule' },
    { path: 'admin', loadChildren: './admin/admin.module#AdminModule', canActivate: [AuthGuard] },
    // { path: 'iframe', component: IframeComponent },
    { path: 'covid19', component: IframeComponent },
    { path: '**', component: Error404Component }
];

@NgModule({
    declarations: [
        AppComponent,
        ConfirmDialogComponent,
        NotificationComponent,
        Error404Component,
        Error500Component,
        IframeComponent,
        SafePipe
    ],
    entryComponents: [
        ConfirmDialogComponent
    ],
    imports: [
        // Angular modules
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        TranslateModule.forRoot(),

        // Firebase Cloud
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,

        // Material
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatSnackBarModule,
        MatMomentDateModule,
        MatTooltipModule,
        NgxMaterialTimepickerModule,
        
        // Telerik modules
        WindowModule,
        ButtonsModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        SampleModule,

        // Azure module
        MsalModule.forRoot({
            clientID: environment.aadClientId,
            authority: environment.aadAuthority,
            consentScopes: ['user.read', environment.aadScope],
            validateAuthority: true,
            cacheLocation: 'sessionStorage',
            protectedResourceMap: [[environment.firebase.databaseURL, [environment.aadScope]]],
            redirectUri: environment.url,
            storeAuthStateInCookie: window.navigator.userAgent.indexOf('MSIE ') > -1
                || window.navigator.userAgent.indexOf('Trident/') > -1
        })
    ],
    exports: [
        NotificationComponent,
        NgxMaterialTimepickerModule
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        // Services
        AppService,
        AuthService,
        UserService,

        // Guards
        AuthGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MsalInterceptor,
            multi: true
        }
    ]
})
export class AppModule {
}
