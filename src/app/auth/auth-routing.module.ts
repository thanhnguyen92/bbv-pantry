import { RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const AuthRoutingModule = RouterModule.forChild([
  { path: '', component: AuthComponent },
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent }
]);
