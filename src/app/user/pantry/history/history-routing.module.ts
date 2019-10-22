import { RouterModule } from '@angular/router';

/** Components */
import { UserHistoryComponent } from './history.component';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';

export const UserHistoryRoutingModule = RouterModule.forChild([
  { path: '', component: UserHistoryComponent, canActivate: [AuthGuard] }
]);
