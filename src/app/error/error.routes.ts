import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './error.component';

const routes: Routes = [
  {
    path: '',
    component: ErrorComponent,
    data: {
      meta: {
        title: 'Error',
        override: true
      }
    }
  },
];

export const ROUTES = RouterModule.forChild(routes);
