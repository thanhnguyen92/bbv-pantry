import { Component } from '@angular/core';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bbv-pantry';
  isLogged = false;

  constructor(private authService: AuthService) {
    this.isLogged = this.authService.isLogged;
  }

  logOut() {
    this.authService.logOut().then();
  }
}
