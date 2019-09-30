import { BookingModel } from 'src/app/shared/models/booking.model';
import { Subscription, Observable } from 'rxjs';
import { AppService } from './../../shared/services/app.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { OrderService } from 'src/app/shared/services/order.service';
import { Utilities } from 'src/app/shared/services/utilities';
import { OrderModel } from 'src/app/shared/models/order.model';
import {
  MatTableDataSource,
  MatSort,
  MatDialog
} from '@angular/material';
import { UserService } from 'src/app/shared/services/user.service';
import { RestaurantModel } from 'src/app/shared/models/restaurant.model';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { BookingService } from 'src/app/shared/services/booking.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { finalize } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { PushNotificationService } from 'src/app/shared/services/push-notification.service';
import { OrderItem } from 'src/app/shared/models/order-item.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  providers: [OrderService]
})
export class OrderComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  orders: OrderModel[] = [];
  dataSource = new MatTableDataSource(this.orders);
  displayedColumns: string[] = [
    'displayName',
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
    private dialog: MatDialog,
    private appService: AppService,
    private orderService: OrderService,
    private userService: UserService,
    private bookingService: BookingService,
    private restaurantService: RestaurantService,
    private pushNotificationService: PushNotificationService
  ) { }

  ngOnInit() {
    this.appService.setLoadingStatus(true);
    this.restaurantService.gets().subscribe(
      res => {
        if (res) {
          this.restaurants = res;
          this.restaurantId = res.length > 0 ? res[0].id : undefined;
          this.bookingService.getByRestaurantId(this.restaurantId).subscribe(
            bookings => {
              if (bookings) {
                this.bookings = bookings;
                this.bookingId =
                  bookings.length > 0 ? bookings[0].id : undefined;
                this.fetchOrderData(this.bookingId);
              } else {
                this.appService.setLoadingStatus(false);
              }
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
            const orderedItem = orderedItems.find(t => t.menuId === dbItem.menuId);
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
        clipboardText += `${item.name} (${item.amount})`;
        if (idx < orderedItems.length - 1) {
          clipboardText += `\r\n`;
        }
      });

      const listener = (e: ClipboardEvent) => {
        e.clipboardData.setData('text/plain', (clipboardText));
        e.preventDefault();
      };

      document.addEventListener('copy', listener);
      document.execCommand('copy');
      document.removeEventListener('copy', listener);
      NotificationService.showSuccessMessage('Copied to clipboard');
    }
  }

  onRestaurantSelected(event) {
    this.appService.setLoadingStatus(true);
    this.restaurantId = event.value;
    this.bookingService.getByRestaurantId(this.restaurantId).subscribe(
      bookings => {
        if (bookings) {
          this.bookings = bookings;
          this.bookingId = bookings.length > 0 ? bookings[0].id : undefined;
          this.fetchOrderData(this.bookingId);
        } else {
          this.appService.setLoadingStatus(false);
        }
      },
      () => this.appService.setLoadingStatus(false)
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

    this.dialog.closeAll();
    dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title: 'Confirmation',
        content:
          'Are you sure to mark this Order as Paid? It cannot be reverted.',
        noButton: 'No',
        yesButton: 'Yes'
      }
    });

    const payConfirmationSub = dialogRef.afterClosed()
      .pipe(finalize(() => Utilities.unsubscribe(payConfirmationSub)))
      .subscribe(res => {
        if (res) {
          this.appService.setLoadingStatus(true);
          const getOrderSubscription = this.orderService
            .getById(element.id)
            .pipe(finalize(() => Utilities.unsubscribe(getOrderSubscription)))
            .subscribe(order => {
              if (order) {
                order.isPaid = true;
                order.isPaymentNotified = false;
                this.orderService
                  .update(order)
                  .then(() => {
                    NotificationService.showSuccessMessage('Pay successful');
                    this.appService.setLoadingStatus(false);
                  })
                  .catch(() => {
                    NotificationService.showErrorMessage(
                      'Pay failed, please try again'
                    );
                    this.appService.setLoadingStatus(false);
                  });
              } else {
                this.appService.setLoadingStatus(false);
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
      this.pushNotificationService.push({
        email: element.email,
        type: 1,
        message: `Please complete the payment for your order at ${restaurant.name} (ignore this message if you're already paid). Thank you!`
      });
    }
  }

  private fetchOrderData(bookingId) {
    this.dataSource.sort = this.sort;
    Utilities.unsubscribe(this.getOrderSubscription);

    this.orderService.getByBookingId(bookingId).subscribe(
      results => {
        if (results) {
          let isDecoratedUsers = false;
          let isDecoratedBookings = false;

          // Decorate user information
          this.userService.getByUserIds(results.map(t => t.userId)).subscribe(
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
                this.appService.setLoadingStatus(false);
              }
            },
            () => this.appService.setLoadingStatus(false)
          );

          // Decorate booking information
          this.bookingService.getByIds(results.map(t => t.bookingId)).subscribe(
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
                this.appService.setLoadingStatus(false);
              }
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
}
