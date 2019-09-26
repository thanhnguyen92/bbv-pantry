import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { SecurityService } from '../services/security.service';
import { SectionSelectionComponent } from './section-selection/section-selection.component';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [LoginComponent, SectionSelectionComponent ],
  providers: [SecurityService],
  entryComponents: [SectionSelectionComponent]
})
export class LoginModule { }
