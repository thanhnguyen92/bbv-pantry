import { RouterModule } from '@angular/router';

/** Components */
import { UserComponent } from './user.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { UserProfileComponent } from './profile/user-profile.component';
import { HappyHoursComponent } from './happy-hours/happy-hours.component';
import { AnonimousGuard } from '../shared/guards/anonimous.guard';

export const UserRoutingModule = RouterModule.forChild([
  { path: '', component: UserComponent, canActivate: [AuthGuard] },
  {
    path: 'history',
    loadChildren: './history/history.module#UserHistoryModule'
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'happy-hours',
    component: HappyHoursComponent,
    canActivate: [AnonimousGuard]
  }
]);
