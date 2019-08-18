import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['bookingFrom', 'bookingTo', 'isClosed', 'isPreBooking', 'restaurantName'];

  constructor() { }

  ngOnInit() {
  }

}
