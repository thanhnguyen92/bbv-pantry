import { RouterModule } from '@angular/router';

import { AuthComponent } from "./AuthComponent";

export const AuthRoutingModule = RouterModule.forChild([
  { path: '', component: AuthComponent },
  { path: 'login', loadChildren: './login/login.module#LoginModule' }
]);
