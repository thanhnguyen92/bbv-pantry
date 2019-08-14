import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu.component';

const MenuRouting: Routes = [{ path: '', component: MenuComponent }];

export const MenuRoutingModule = RouterModule.forChild(MenuRouting);
