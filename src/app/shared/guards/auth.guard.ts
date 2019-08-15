import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }

  canActivate() {
    console.log('auth guard');
    const isLogged = this.authService.getIsLogged();
    if (!isLogged) {
      this.router.navigate(['auth', 'login']);
      return false;
    }

    return true;
  }
}
