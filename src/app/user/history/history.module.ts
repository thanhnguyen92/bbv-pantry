import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserHistoryRoutingModule } from './history-routing.module';
import { UserHistoryComponent } from './history.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';

@NgModule({
  declarations: [UserHistoryComponent],
  imports: [
    MaterialModule,
    CommonModule,
    UserHistoryRoutingModule
  ]
})
export class UserHistoryModule { }
