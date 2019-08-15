import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './shared/modules/material.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import {
  MatToolbarModule
} from '@angular/material';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './shared/interceptors';
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
    MaterialModule,
    AngularFireMessagingModule
  ],
  entryComponents: [ConfirmDialogComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  exports: [NotificationComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
