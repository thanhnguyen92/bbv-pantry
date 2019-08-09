import { RouterModule } from '@angular/router';

/** Components */
import { LoginComponent } from './login.component';

export const LoginRoutingModule = RouterModule.forChild([
  { path: '', component: LoginComponent }
]);
