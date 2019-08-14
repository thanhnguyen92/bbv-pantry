import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';

/** Components */
import { UserComponent } from './user.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from '../shared/interceptors';

@NgModule({
  imports: [CommonModule, UserRoutingModule],
  declarations: [UserComponent],
  providers: []
})
export class UserModule {}
