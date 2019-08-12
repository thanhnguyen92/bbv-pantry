import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivate,
  Router,
  RouterLinkActive
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  /**
   *
   */
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    switch (true) {
      case !this.authService.isLogged:
        this.router.navigate(['auth', 'login']);
        return false;
      case this.authService.isLogged && this.authService.isAdmin:
        // this.router.navigate(['admin']);
        const isAdminRoute =
          route.url.findIndex(a => a.path.indexOf('admin') !== -1) !== -1;
        return isAdminRoute;
      case this.authService.isLogged && !this.authService.isAdmin:
        // this.router.navigate(['user']);
        const isUserRoute =
          route.url.findIndex(a => a.path.indexOf('user') !== -1) !== -1;
        return isUserRoute;
      default:
        return false;
    }
  }
}
