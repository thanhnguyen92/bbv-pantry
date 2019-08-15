import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(private authService: AuthService) { }

    canActivate() {
        console.log('admin guard');

        if (this.authService.isAdmin) {
            // Access granted
            return true;
        }

        NotificationService.showErrorMessage('Access denied');
        return false;
    }
}
