import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  constructor(
    private router: Router) { }

  ngOnInit() { }

  onRestaurant() {
    this.router.navigate(['admin', 'restaurant']);
  }

  onMenu() {
    this.router.navigate(['admin', 'menu']);
  }

  onBooking() {
    this.router.navigate(['admin', 'booking']);
  }

  onOrder() {
    this.router.navigate(['admin', 'order']);
  }
}
