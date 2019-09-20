import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSort, MatTableDataSource, MatDialog } from '@angular/material';

/** Components */
import { BookingItemComponent } from './booking-item/booking-item.component';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

/** Models */
import { BookingModel } from 'src/app/shared/models/booking.model';

/** Services */
import { AppService } from './../../shared/services/app.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { BookingService } from 'src/app/shared/services/booking.service';
import { forkJoin, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Utilities } from 'src/app/shared/services/utilities';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['bookingFrom', 'bookingTo', 'isClosed', 'isPreBooking', 'restaurantName', 'actions'];

  private getBookingSub: Subscription;

  constructor(
    private appService: AppService,
    private dialog: MatDialog,
    private bookingService: BookingService,
    private restaurantService: RestaurantService) { }

  ngOnInit() {
    this.fetchData();
  }

  ngOnDestroy(): void {
    Utilities.unsubscribe(this.getBookingSub);
  }

  onCreate() {
    this.showPopupBookingItem();
  }

  onEdit(bookingItem: BookingModel) {
    this.showPopupBookingItem(bookingItem);
  }

  onDelete(bookingItem: BookingModel) {
    this.showDialogConfirmDelete(bookingItem);
  }

  private fetchData() {
    this.appService.setLoadingStatus(true);
    this.dataSource.sort = this.sort;

    this.getBookingSub = this.bookingService.gets().subscribe(bookings => {
      if (bookings && bookings.length > 0) {
        const restaurantSub = this.restaurantService.gets()
          .pipe(finalize(() => {
            this.appService.setLoadingStatus(false);
            Utilities.unsubscribe(restaurantSub);
          }))
          .subscribe(restaurants => {
            if (restaurants && restaurants.length > 0) {
              bookings.forEach(item => {
                const restaurant = restaurants.find(t => t.uid === item.restaurantId);
                if (restaurant) {
                  item['restaurantName'] = restaurant.name;
                }
              });
            }
            this.dataSource.data = bookings;
          });
      } else {
        this.appService.setLoadingStatus(false);
      }
    }, () => this.appService.setLoadingStatus(false));
  }

  private showPopupBookingItem(bookingItem: BookingModel = new BookingModel()) {
    const diaLogRef = this.dialog.open(BookingItemComponent, {
      width: '250px',
      data: { ...bookingItem },
      hasBackdrop: false
    });

    const popupBookingItemSub = diaLogRef.afterClosed()
      .pipe(finalize(() => Utilities.unsubscribe(popupBookingItemSub)))
      .subscribe((data: BookingModel) => {
        if (data) {
          let service;
          if (data.uid) {
            service = this.bookingService.update({ ...data });
          } else {
            service = this.bookingService.add({
              ...data,
              // ...{ restaurantId: this.restaurantId }
            });
          }
          service
            .then(() => {
              NotificationService.showSuccessMessage('Save successful');
            })
            .catch(() => {
              NotificationService.showErrorMessage('Save failed');
            });
        }
      });
  }

  private showDialogConfirmDelete(bookingItem: BookingModel) {
    let dialogRef;
    if (dialogRef) {
      return;
    }
    dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { title: 'Confirmation', content: 'Are you sure to delete?', noButton: 'No', yesButton: 'Yes' }
    });

    const deleteConfirmationSub = dialogRef.afterClosed()
      .pipe(finalize(() => Utilities.unsubscribe(deleteConfirmationSub)))
      .subscribe(res => {
        if (res) {
          this.bookingService
            .delete(bookingItem.uid)
            .then(() => {
              NotificationService.showSuccessMessage('Delete successful');
            })
            .catch(() => {
              NotificationService.showErrorMessage(
                'Something went wrong, please try again'
              );
            });
        }
      });
  }
}
