import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: './+auth/auth.module#AuthModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: './+admin/admin.module#AdminModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'user',
    loadChildren: './+user/user.module#UserModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: './+auth/auth.module#AuthModule',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
