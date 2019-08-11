import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthComponent } from './AuthComponent';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from '../shared/services/auth.service';

@NgModule({
  imports: [CommonModule, AuthRoutingModule],
  declarations: [AuthComponent],
  providers: [AuthService]
})
export class AuthModule {}
