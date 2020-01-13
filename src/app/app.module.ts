import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import { AppService } from './shared/services/app.service';
import { AuthService } from './shared/services/auth.service';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { MatTableModule, MatPaginatorModule } from '@angular/material';
import { AdminModule } from './admin/admin.module';

const appRoutes: Routes = [
    { path: '', loadChildren: './main/main.module#MainModule' },
    { path: 'main', loadChildren: './main/main.module#MainModule' },
    { path: 'admin', loadChildren: './admin/admin.module#AdminModule' }
];

@NgModule({
    declarations: [
        AppComponent,
        ConfirmDialogComponent,
        NotificationComponent
    ],
    entryComponents: [
        ConfirmDialogComponent,
        NotificationComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),
        TranslateModule.forRoot(),

        // Firebase Cloud
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        SampleModule
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        AppService,
        AuthService
    ]
})
export class AppModule {
}
