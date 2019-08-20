import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { RestaurantBooking } from 'src/app/shared/models/booking.model';
import { BookingItemComponent } from './booking-item/booking-item.component';
import { BookingService } from 'src/app/shared/services/booking.service';
import { AppService } from 'src/app/shared/services/app.service';
import { Subscription } from 'rxjs';
import { Utilities } from 'src/app/shared/services/utilities';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  bookings: RestaurantBooking[] = [];
  dataSource = new MatTableDataSource(this.bookings);
  displayedColumns: string[] = [
    'bookingFrom',
    'bookingTo',
    'isClosed',
    'isPreBooking',
    'restaurantName'
  ];

  private getsBookingSubscribtion: Subscription;
  constructor(
    private dialog: MatDialog,
    private bookingService: BookingService,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  onCreate() {
    this.showDialog();
  }

  onEdit(booking: RestaurantBooking) {
    this.showDialog(booking);
  }
  private fetchData() {
    this.appService.setLoadingStatus(true);
    this.dataSource.sort = this.sort;
    Utilities.unsubscribe(this.getsBookingSubscribtion);
    this.getsBookingSubscribtion = this.bookingService.gets().subscribe(
      result => {
        this.dataSource.data = result;
        this.appService.setLoadingStatus(false);
      },
      () => this.appService.setLoadingStatus(false)
    );
  }
  private showDialog(restaurant: RestaurantBooking = new RestaurantBooking()) {
    const dialogRef = this.dialog.open(BookingItemComponent, {
      width: '250px',
      data: { ...restaurant },
      hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe((result: RestaurantBooking) => {
      if (!result) {
        return;
      }

      let service;
      if (result.uid) {
        // Edit
        service = this.bookingService.update({ ...result });
      } else {
        // Create
        service = this.bookingService.add({ ...result });
      }

      service
        .then(() => {
          NotificationService.showSuccessMessage('Save successful');
        })
        .catch(() => {
          NotificationService.showErrorMessage(
            'Something went wrong, please try again'
          );
        });
    });
  }
}
