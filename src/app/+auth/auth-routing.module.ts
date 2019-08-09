import { RouterModule } from '@angular/router';

/** Components */
import { AuthComponent } from './auth.component';

export const AuthRoutingModule = RouterModule.forChild([
  { path: '', component: AuthComponent },
  { path: 'login', loadChildren: './login/login.module#LoginModule' }
]);
