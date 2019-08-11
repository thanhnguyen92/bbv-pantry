import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivate,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  /**
   *
   */
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    switch (true) {
      case !this.authService.isLogged:
        this.router.navigate(['auth']);
        return true;
      case this.authService.isAdmin:
        this.router.navigate(['admin']);
        return true;
      case !this.authService.isAdmin:
        this.router.navigate(['user']);
        return true;
      default:
        return false;
    }
  }
}
