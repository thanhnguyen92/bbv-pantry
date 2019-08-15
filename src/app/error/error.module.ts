import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error.component';
import { ROUTES } from './error.routes';

@NgModule({
  declarations: [ErrorComponent],
  imports: [
    CommonModule,
    ROUTES
  ]
})
export class ErrorModule { }
