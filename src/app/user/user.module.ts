import { MaterialModule } from './../shared/modules/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';

/** Components */
import { UserComponent } from './user.component';

@NgModule({
  imports: [CommonModule, UserRoutingModule, MaterialModule],
  declarations: [UserComponent],
  providers: []
})
export class UserModule { }
