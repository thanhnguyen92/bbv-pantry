import { RouterModule, Routes } from '@angular/router';
import { MenuAdminComponent } from './menu.component';

const MenuAdminRouting: Routes = [{ path: '', component: MenuAdminComponent }];

export const MenuAdminRoutingModule = RouterModule.forChild(MenuAdminRouting);
