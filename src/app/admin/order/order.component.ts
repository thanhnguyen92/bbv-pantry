import { BookingModel } from 'src/app/shared/models/booking.model';
import { Subscription, Observable } from 'rxjs';
import { AppService } from './../../shared/services/app.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { OrderService } from 'src/app/shared/services/order.service';
import { Utilities } from 'src/app/shared/services/utilities';
import { OrderModel } from 'src/app/shared/models/order.model';
import { MatTableDataSource, MatSort, MatDialogRef, MatDialog } from '@angular/material';
import { UserService } from 'src/app/shared/services/user.service';
import { RestaurantModel } from 'src/app/shared/models/restaurant.model';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { BookingService } from 'src/app/shared/services/booking.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { finalize } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

const ALL_RESTAURANT = '0';
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
    private restaurantService: RestaurantService
  ) { }

  ngOnInit() {
    this.appService.setLoadingStatus(true);
    this.restaurantService.gets().subscribe(
      res => {
        if (res) {
          this.restaurants = res;
          this.restaurants.unshift({
            uid: ALL_RESTAURANT,
            name: 'All'
          } as RestaurantModel);
          this.restaurantId = this.restaurants[0].uid;
        }
        this.fetchOrderData(this.restaurantId);
      },
      () => this.appService.setLoadingStatus(false)
    );
  }

  ngOnDestroy(): void {
    Utilities.unsubscribe(this.getOrderSubscription);
  }

  onRestaurantSelected(event) {
    this.restaurantId = event.value;
    this.fetchOrderData(this.restaurantId);
  }

  onBookingSelected(event) {
    this.bookingId = event.value;
  }

  onPayOrder(element) {
    let dialogRef;
    if (dialogRef) {
      return;
    }
    dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title: 'Confirmation',
        content: 'Are you sure to mark this Order as Paid? It cannot be reverted.',
        noButton: 'No',
        yesButton: 'Yes'
      }
    });

    const payConfirmationSub = dialogRef
      .afterClosed()
      .pipe(finalize(() => Utilities.unsubscribe(payConfirmationSub)))
      .subscribe(res => {
        if (res) {
          this.appService.setLoadingStatus(true);
          const getOrderSubscription = this.orderService.getById(element.uid)
            .pipe(finalize(() => Utilities.unsubscribe(getOrderSubscription)))
            .subscribe(order => {
              if (order) {
                order.isPaid = true;
                this.orderService.update(order)
                  .then(() => {
                    NotificationService.showSuccessMessage('Pay successful');
                    this.appService.setLoadingStatus(false);
                  }).catch(() => {
                    NotificationService.showErrorMessage('Pay failed, please try again');
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
    const restaurant = this.restaurants.find(t => t.uid === element.restaurantId);
    if (restaurant) {
      Utilities.pushNotification(`Please complete the payment for your order at ${restaurant.name}. Thank you!`);
    }
  }

  private fetchOrderData(restaurantId) {
    this.dataSource.sort = this.sort;
    Utilities.unsubscribe(this.getOrderSubscription);

    let queryService: Observable<OrderModel[]>;
    if (restaurantId !== ALL_RESTAURANT) {
      // Get orders by restaurant identifier
      queryService = this.orderService.getByRestaurantId(this.restaurantId);
    } else {
      // Get all orders
      queryService = this.orderService.gets();
    }

    this.getOrderSubscription = queryService.subscribe(
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
                  const user = users.find(t => t.uid === order.userId);
                  if (user) {
                    order['displayName'] =
                      user.displayName && user.displayName.length > 0
                        ? user.displayName
                        : '(null)';
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
                  const booking = bookings.find(t => t.uid === order.bookingId);
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
