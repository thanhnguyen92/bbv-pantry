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
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Utilities } from 'src/app/shared/services/utilities';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  bookingItems: BookingModel[] = [];
  dataSource = new MatTableDataSource(this.bookingItems);
  displayedColumns: string[] = [
    'restaurantName',
    'bookingFrom',
    'bookingTo',
    'isClosed',
    'isPreBooking',
    'actions'
  ];

  private getBookingSub: Subscription;

  constructor(
    private appService: AppService,
    private dialog: MatDialog,
    private bookingService: BookingService,
    private restaurantService: RestaurantService
  ) { }

  ngOnInit() {
    this.fetchData();
  }

  ngOnDestroy(): void {
    Utilities.unsubscribe(this.getBookingSub);
  }

  onCreate() {
    this.showPopupBookingItem();
  }

  onCloseBooking(element) {
    this.appService.setLoadingStatus(true);
    const getBookingSubscription = this.bookingService.getById(element.id)
      .pipe(finalize(() => Utilities.unsubscribe(getBookingSubscription)))
      .subscribe(booking => {
        if (booking) {
          booking.isClosed = !element.isClosed;
          this.bookingService.update(booking)
            .then(() => {
              NotificationService.showSuccessMessage('Update successful');
              this.appService.setLoadingStatus(false);
            }).catch(() => {
              NotificationService.showErrorMessage('Update failed, please try again');
              this.appService.setLoadingStatus(false);
            });
        } else {
          this.appService.setLoadingStatus(false);
        }
      });
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

    this.getBookingSub = this.bookingService.gets().subscribe(
      bookings => {
        if (bookings && bookings.length > 0) {
          this.restaurantService.gets().subscribe(
            restaurants => {
              if (restaurants && restaurants.length > 0) {
                bookings.forEach(item => {
                  const restaurant = restaurants.find(
                    t => t.id === item.restaurantId
                  );
                  if (restaurant) {
                    item['restaurantName'] = restaurant.name;
                  }
                });
              }
              this.dataSource.data = bookings;
              this.appService.setLoadingStatus(false);
            },
            () => this.appService.setLoadingStatus(false)
          );
        } else {
          this.appService.setLoadingStatus(false);
        }
      },
      () => this.appService.setLoadingStatus(false)
    );
  }

  private showPopupBookingItem(bookingItem?: BookingModel) {
    const diaLogRef = this.dialog.open(BookingItemComponent, {
      width: '250px',
      data: { ...bookingItem },
      hasBackdrop: false
    });

    const popupBookingItemSub = diaLogRef
      .afterClosed()
      .pipe(finalize(() => Utilities.unsubscribe(popupBookingItemSub)))
      .subscribe((data: BookingModel) => {
        if (data) {
          let service;
          if (data.id) {
            service = this.bookingService.update({ ...data });
          } else {
            service = this.bookingService.add({
              ...data
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
      data: {
        title: 'Confirmation',
        content: 'Are you sure to delete?',
        noButton: 'No',
        yesButton: 'Yes'
      }
    });

    const deleteConfirmationSub = dialogRef
      .afterClosed()
      .pipe(finalize(() => Utilities.unsubscribe(deleteConfirmationSub)))
      .subscribe(res => {
        if (res) {
          this.bookingService
            .delete(bookingItem.id)
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
