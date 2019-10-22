import { RouterModule } from '@angular/router';
import { HappyHoursComponent } from './happy-hours/happy-hours.component';
import { AnonimousGuard } from 'src/app/shared/guards/anonimous.guard';
import { HappyHoursListComponent } from './happy-hours/happy-hours-list/happy-hours-list.component';
import { PantryComponent } from './pantry.component';
import { UserComponent } from '../user.component';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';

export const PantryRoutingModule = RouterModule.forChild([
  { path: '', component: PantryComponent, canActivate: [AnonimousGuard] },
  { path: 'order', component: UserComponent, canActivate: [AuthGuard] },
  {
    path: 'history',
    loadChildren: './history/history.module#UserHistoryModule'
  },
  {
    path: 'happy-hours',
    component: HappyHoursComponent,
    canActivate: [AnonimousGuard]
  },
  {
    path: 'registers',
    component: HappyHoursListComponent,
    canActivate: [AnonimousGuard]
  }
]);
