import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './shared/modules/material.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { MatToolbarModule } from '@angular/material';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { NotificationComponent } from './shared/components/notification/notification.component';

@NgModule({
  declarations: [AppComponent, ConfirmDialogComponent, NotificationComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MaterialModule
  ],
  entryComponents: [ConfirmDialogComponent],
  exports: [NotificationComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
