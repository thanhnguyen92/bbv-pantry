import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { Subscription } from 'rxjs';
import { locale as enLocale } from './booking-en.locale';
import { finalize } from 'rxjs/operators';

/** Components */
import { ConfirmDialogComponent } from 'app/shared/components/confirm-dialog/confirm-dialog.component';
import { BookingItemAdminComponent } from './booking-item/booking-item.component';

/** Models */
import { BookingModel } from 'app/shared/models/booking.model';
import { RestaurantModel } from 'app/shared/models/restaurant.model';

/** Services */
import { Utilities } from 'app/shared/services/utilities';
import { AppService } from 'app/shared/services/app.service';
import { RestaurantService } from 'app/shared/services/restaurant.service';
import { BookingService } from 'app/shared/services/booking.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-booking-admin',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingAdminComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  bookings: BookingModel[] = [];
  restaurants: RestaurantModel[] = [];
  dataSource = new MatTableDataSource<BookingModel>();
  displayedColumns = ['restaurantName',
    'bookingFrom',
    'bookingTo',
    'isClosed',
    'isPreBooking',
    'actions'];
  restaurantId: string;

  // Private
  private _getBookingSubscription: Subscription;
  private _getRestaurantSub: Subscription;

  constructor(
    private _dialog: MatDialog,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _appService: AppService,
    private _bookingService: BookingService,
    private _restaurantService: RestaurantService) {
    this._fuseTranslationLoaderService.loadTranslations(enLocale);
  }

  ngOnInit() {
    // Fetch restaurant data
    this._appService.setLoadingStatus(true);
    this._getRestaurantSub = this._restaurantService.gets()
      .subscribe(results => {
        this.restaurants = [...results];

        this.restaurants.unshift({
          id: '0',
          name: '-- Please select --'
        } as RestaurantModel);
        this.restaurantId = this.restaurants[0].id;

        // Fetch booking data
        this.fetchData();
      }, () => this._appService.setLoadingStatus(false));
  }

  ngOnDestroy() {
    Utilities.unsubscribe(this._getBookingSubscription);
  }

  applyFilter(event) {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }

  onRestaurantSelected(event) {
    this.restaurantId = event.value;
    let source;
    if (this.restaurantId === '0') {
      source = this.bookings;
    } else {
      source = this.bookings.filter(t => t.restaurantId === this.restaurantId);
    }

    // Filter by restaurant
    this.dataSource.data = source;
  }

  onCreate() {
    this.showPopupBookingItem();
  }

  onCloseBooking(element) {
    this._appService.setLoadingStatus(true);
    const getBookingSubscription = this._bookingService
      .getById(element.id)
      .pipe(finalize(() => Utilities.unsubscribe(getBookingSubscription)))
      .subscribe(booking => {
        if (booking) {
          booking.isClosed = !element.isClosed;
          this._bookingService
            .update(booking)
            .then(() => {
              NotificationService.showSuccessMessage('Update successful');
              this._appService.setLoadingStatus(false);
            })
            .catch(() => {
              NotificationService.showErrorMessage(
                'Update failed, please try again'
              );
              this._appService.setLoadingStatus(false);
            });
        } else {
          this._appService.setLoadingStatus(false);
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
    this.paginator.pageSize = 10;
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;

    this._appService.setLoadingStatus(true);
    this.dataSource.sort = this.sort;

    this._getBookingSubscription = this._bookingService.gets().subscribe(
      bookings => {
        if (bookings && bookings.length > 0) {
          this._restaurantService.gets().subscribe(
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
              this.bookings = bookings.sort(
                Utilities.fieldsSort(['-bookingFrom', '-bookingTo'])
              );
              this.dataSource.data = this.bookings;
              this._appService.setLoadingStatus(false);
              console.log(this.bookings);
            },
            () => this._appService.setLoadingStatus(false)
          );
        } else {
          this._appService.setLoadingStatus(false);
        }
      },
      () => this._appService.setLoadingStatus(false)
    );
  }

  private showPopupBookingItem(bookingItem?: BookingModel) {
    this._dialog.closeAll();
    const diaLogRef = this._dialog.open(BookingItemAdminComponent, {
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
            service = this._bookingService.update({ ...data });
          } else {
            service = this._bookingService.add({
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
    this._dialog.closeAll();
    dialogRef = this._dialog.open(ConfirmDialogComponent, {
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
          this._bookingService
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
