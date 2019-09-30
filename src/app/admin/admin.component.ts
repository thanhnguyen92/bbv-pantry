import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PushNotificationService } from '../shared/services/push-notification.service';
import { AuthService } from '../shared/services/auth.service';
import { NotificationService } from '../shared/services/notification.service';
import { PushNotificationModel } from '../shared/models/push-notification.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  constructor(
    private router: Router,
    private pushNotificationService: PushNotificationService,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  onRestaurant() {
    this.router.navigate(['admin', 'restaurant']);
  }

  onMenu() {
    this.router.navigate(['admin', 'menu']);
  }
}
