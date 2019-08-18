import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  displayedColumns: string[] = ['bookingFrom', 'bookingTo', 'isClosed', 'isPreBooking', 'restaurantName'];

  constructor() { }

  ngOnInit() {
  }

}
