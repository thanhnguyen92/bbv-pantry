import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatDialog, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

/** Components */
import { ConfirmDialogComponent } from 'app/shared/components/confirm-dialog/confirm-dialog.component';

/** Models */
import { OrderItem } from 'app/shared/models/order-item.model';
import { OrderModel } from 'app/shared/models/order.model';
import { BookingModel } from 'app/shared/models/booking.model';
import { RestaurantModel } from 'app/shared/models/restaurant.model';

/** Services */
import { OrderService } from 'app/shared/services/order.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { Utilities } from 'app/shared/services/utilities';
import { AppService } from 'app/shared/services/app.service';
import { UserService } from 'app/shared/services/user.service';
import { BookingService } from 'app/shared/services/booking.service';
import { RestaurantService } from 'app/shared/services/restaurant.service';

@Component({
  selector: 'app-order-histories-admin',
  templateUrl: './order-histories.component.html',
  styleUrls: ['./order-histories.component.scss']
})
export class OrderHistoriesAdminComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  orders: OrderModel[] = [];
  dataSource = new MatTableDataSource(this.orders);
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    // 'bookingInfo',
    'orderItems',
    'orderDate',
    'totalPrice',
    'isPaid',
    'actions'
  ];
  restaurantId;
  restaurants: RestaurantModel[] = [];
  bookingId;
  bookings: BookingModel[] = [];

  private getOrderSubscription: Subscription;
  private getBookingSubscription: Subscription;

  constructor(
    private _dialog: MatDialog,
    private _appService: AppService,
    private _orderService: OrderService,
    private _userService: UserService,
    private _bookingService: BookingService,
    private _restaurantService: RestaurantService
  ) { }

  ngOnInit() {
    this.paginator.pageSize = 10;
    this.paginator.pageIndex = 0;
    this.dataSource.paginator = this.paginator;

    this._appService.setLoadingStatus(true);
    this._restaurantService.gets().subscribe(res => {
      if (res) {
        this.restaurants = res;
        this.restaurantId = res.length > 0 ? res[0].id : undefined;
        this._bookingService.getByRestaurantId(this.restaurantId).subscribe(
          bookings => {
            if (bookings) {
              this.bookings = bookings.sort(
                Utilities.fieldsSort(['-bookingFrom', '-bookingTo'])
              );
              this.bookingId =
                bookings.length > 0 ? bookings[0].id : undefined;
              this.fetchOrderData(this.bookingId);
            } else {
              this._appService.setLoadingStatus(false);
            }
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

  ngOnDestroy(): void {
    Utilities.unsubscribe(this.getOrderSubscription);
  }

  onCopyOrderItems() {
    if (this.orders && this.orders.length > 0) {
      const orderedItems: OrderItem[] = [];

      this.orders.forEach(order => {
        if (order && order.orderItems && order.orderItems.length > 0) {
          order.orderItems.forEach(item => {
            const dbItem = { ...item };
            const orderedItem = orderedItems.find(
              t => t.menuId === dbItem.menuId
            );
            if (orderedItem) {
              orderedItem.amount += dbItem.amount;
            } else {
              orderedItems.push(dbItem);
            }
          });
        }
      });

      let clipboardText = '';
      orderedItems.forEach((item, idx) => {
        clipboardText += `${item.name} (${item.amount}) (${item.note})`;
        if (idx < orderedItems.length - 1) {
          clipboardText += `\r\n`;
        }
      });

      const listener = (e: ClipboardEvent) => {
        e.clipboardData.setData('text/plain', clipboardText);
        e.preventDefault();
      };

      document.addEventListener('copy', listener);
      document.execCommand('copy');
      document.removeEventListener('copy', listener);
      NotificationService.showSuccessMessage('Copied to clipboard');
    }
  }

  onRestaurantSelected(event) {
    this._appService.setLoadingStatus(true);
    this.restaurantId = event.value;
    this._bookingService.getByRestaurantId(this.restaurantId).subscribe(
      bookings => {
        if (bookings) {
          this.bookings = bookings.sort(
            Utilities.fieldsSort(['-bookingFrom', '-bookingTo'])
          );
          this.bookingId = bookings.length > 0 ? bookings[0].id : undefined;
          this.fetchOrderData(this.bookingId);
        } else {
          this._appService.setLoadingStatus(false);
        }
      },
      () => this._appService.setLoadingStatus(false)
    );
  }

  onBookingSelected(event) {
    this.bookingId = event.value;
    this.fetchOrderData(this.bookingId);
  }

  onPayOrder(element) {
    let dialogRef;
    if (dialogRef && element.isPaid) {
      return;
    }

    this._dialog.closeAll();
    dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title: 'Confirmation',
        content:
          'Are you sure to mark this Order as Paid? It cannot be reverted.',
        noButton: 'No',
        yesButton: 'Yes'
      }
    });

    const payConfirmationSub = dialogRef
      .afterClosed()
      .pipe(finalize(() => Utilities.unsubscribe(payConfirmationSub)))
      .subscribe(res => {
        if (res) {
          this._appService.setLoadingStatus(true);
          const getOrderSubscription = this._orderService
            .getById(element.id)
            .pipe(finalize(() => Utilities.unsubscribe(getOrderSubscription)))
            .subscribe(order => {
              if (order) {
                order.isPaid = true;
                order.isPaymentNotified = false;
                this._orderService
                  .update(order)
                  .then(() => {
                    NotificationService.showSuccessMessage('Pay successful');
                    this._appService.setLoadingStatus(false);
                  })
                  .catch(() => {
                    NotificationService.showErrorMessage(
                      'Pay failed, please try again'
                    );
                    this._appService.setLoadingStatus(false);
                  });
              } else {
                this._appService.setLoadingStatus(false);
              }
            });
        }
      });
  }

  onRemindPayment(element) {
    // Push notification to remind user for payment
    const restaurant = this.restaurants.find(
      t => t.id === element.restaurantId
    );
    if (restaurant) {
      // this.pushNotificationService.push({
      //   email: element.email,
      //   type: 1,
      //   message: `Please complete the payment for your order at ${restaurant.name} (ignore this message if you're already paid). Thank you!`
      // });
    }
  }

  private fetchOrderData(bookingId) {
    this.dataSource.sort = this.sort;
    Utilities.unsubscribe(this.getOrderSubscription);

    this._orderService.getByBookingId(bookingId).subscribe(
      results => {
        if (results) {
          let isDecoratedUsers = false;
          let isDecoratedBookings = false;

          // Decorate user information
          this._userService.getByUserIds(results.map(t => t.userId)).subscribe(
            users => {
              if (users) {
                // Map user information to list orders
                results.forEach(order => {
                  const user = users.find(t => t.id === order.userId);
                  if (user) {
                    order['displayName'] =
                      user.displayName && user.displayName.length > 0
                        ? user.displayName
                        : '(empty)';
                    order['email'] = user.email;
                  }
                });
              }

              isDecoratedUsers = true;
              if (isDecoratedBookings) {
                this.orders = results;
                this.dataSource.data = this.orders;
                this._appService.setLoadingStatus(false);
              }
            },
            () => this._appService.setLoadingStatus(false)
          );

          // Decorate booking information
          this._bookingService.getByIds(results.map(t => t.bookingId)).subscribe(
            bookings => {
              if (bookings) {
                // Map user information to list orders
                results.forEach(order => {
                  const booking = bookings.find(t => t.id === order.bookingId);
                  if (booking) {
                    order['bookingInfo'] = booking;
                  }
                });
              }

              isDecoratedBookings = true;
              if (isDecoratedUsers) {
                this.orders = results;
                this.dataSource.data = this.orders;
                this._appService.setLoadingStatus(false);
              }
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
}
