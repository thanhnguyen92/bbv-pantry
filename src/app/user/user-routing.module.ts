import { RouterModule } from '@angular/router';

/** Components */
import { AuthGuard } from '../shared/guards/auth.guard';
import { UserProfileComponent } from './profile/user-profile.component';
import { AnonimousGuard } from '../shared/guards/anonimous.guard';
import { PmWebComponent } from './pm-web/pm-web.component';
import { ProjectPlannerComponent } from './project-planner/project-planner.component';
import { WikiComponent } from './wiki/wiki.component';
import { PluginsComponent } from './plugins/plugins.component';

export const UserRoutingModule = RouterModule.forChild([
  { path: '', component: PmWebComponent, canActivate: [AnonimousGuard] },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'wiki',
    component: WikiComponent,
    canActivate: [AnonimousGuard]
  },
  {
    path: 'pm-web',
    component: PmWebComponent,
    canActivate: [AnonimousGuard]
  },
  {
    path: 'project-planner',
    component: ProjectPlannerComponent,
    canActivate: [AnonimousGuard]
  },
  {
    path: 'pantry',
    loadChildren: './pantry/pantry.module#PantryModule'
  },
  {
    path: 'plugins',
    component: PluginsComponent,
    canActivate: [AnonimousGuard]
  }
]);
