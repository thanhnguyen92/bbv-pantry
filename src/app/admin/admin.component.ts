import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  onRestaurant() {
    this.router.navigate(['admin', 'restaurant']);
  }

  onMenu() {
    this.router.navigate(['admin', 'menu']);
  }

  testNotification() {
    this.notifyMe();
  }
  notifyMe() {
    // Let's check if the browser supports notifications
    if (!('Notification' in window)) {
      alert('This browser does not support system notifications');
      // This is not how you would really do things if they aren't supported. :)
    }
    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === 'granted') {
      // If it's okay let's create a notification
      const notification = new Notification('Hi there!');
    }
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(permission => {
        // If the user accepts, let's create a notification
        if (permission === 'granted') {
          const notification = new Notification('Hi there!');
        }
      });
    }

    // Finally, if the user has denied notifications and you
    // want to be respectful there is no need to bother them any more.
  }
}
