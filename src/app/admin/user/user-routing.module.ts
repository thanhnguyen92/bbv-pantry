import { RouterModule } from '@angular/router';

/** Components */
import { UserAdminComponent } from './user.component';

export const UserAdminRoutingModule = RouterModule.forChild([
    { path: '', component: UserAdminComponent }
]);
