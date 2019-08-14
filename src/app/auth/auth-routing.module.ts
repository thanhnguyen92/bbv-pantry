import { RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';


export const AuthRoutingModule = RouterModule.forChild([
  { path: '', component: AuthComponent },
  { path: 'login', loadChildren: './login/login.module#LoginModule' }
]);
