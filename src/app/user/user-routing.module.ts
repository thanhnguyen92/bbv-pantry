import { RouterModule } from '@angular/router';

/** Components */
import { UserComponent } from './user.component';
import { AuthGuard } from '../shared/guards/auth.guard';

export const UserRoutingModule = RouterModule.forChild([
  { path: '', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'history', loadChildren: './history/history.module#UserHistoryModule' }
]);
