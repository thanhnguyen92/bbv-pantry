import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { MenuRoutingComponent } from './menu-routing/menu-routing.component';



@NgModule({
  declarations: [MenuComponent, MenuRoutingComponent],
  imports: [
    CommonModule
  ]
})
export class MenuModule { }
