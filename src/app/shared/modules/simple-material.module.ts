import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatTableModule
} from '@angular/material';

@NgModule({
  imports: [MatButtonModule, MatButtonToggleModule, MatTableModule],
  exports: [MatButtonModule, MatButtonToggleModule, MatTableModule]
})
export class SimpleMaterialModule {}
