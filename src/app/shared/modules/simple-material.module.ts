import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatTableModule,
  MatDialogModule,
  MatIconModule
} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatTableModule,
    MatDialogModule,
    MatIconModule
  ],
  exports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatTableModule,
    MatDialogModule,
    MatIconModule
  ]
})
export class SimpleMaterialModule {}
