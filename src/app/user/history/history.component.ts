import { AuthService } from './../../shared/services/auth.service';
import { BookingService } from 'src/app/shared/services/booking.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { OrderModel } from 'src/app/shared/models/order.model';
import { OrderService } from 'src/app/shared/services/order.service';
import { AppService } from 'src/app/shared/services/app.service';
import { Subscription } from 'rxjs';
import { Utilities } from 'src/app/shared/services/utilities';
import { finalize } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class UserHistoryComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = [
    'restaurantName',
    'orderDate',
    'orderItems',
    'totalPrice',
    'actions'
  ];
  orders: OrderModel[] = [];
  dataSource = new MatTableDataSource(this.orders);
  private getOrdersSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private appService: AppService,
    private orderService: OrderService,
    private restaurantService: RestaurantService,
    private bookingService: BookingService) { }

  ngOnInit() {
    if (this.authService.getIsLogged()) {
      this.fetchData(false);
    }
  }

  ngOnDestroy(): void {
    Utilities.unsubscribe(this.getOrdersSubscription);
  }

  onCancelOrder(element: OrderModel) {
    if (element && !element.isPaid) {
      this.appService.setLoadingStatus(true);
      const getBookingSubscription = this.bookingService.getById(element.bookingId)
        .pipe(finalize(() => Utilities.unsubscribe(getBookingSubscription)))
        .subscribe(booking => {
          if (booking && !booking.isClosed) {
            this.orderService.delete(element.id)
              .then(() => {
                NotificationService.showSuccessMessage('Cancel order successful');
                this.appService.setLoadingStatus(false);
              }).catch(() => {
                NotificationService.showErrorMessage('Cancel failed, please try again');
                this.appService.setLoadingStatus(false);
              });
          } else {
            NotificationService.showWarningMessage('Unfortunately, you cannot cancel this order');
            this.appService.setLoadingStatus(false);
          }
        }, () => this.appService.setLoadingStatus(false));
    } else {
      NotificationService.showWarningMessage('Unfortunately, you cannot cancel this order');
    }
  }

  onNotifyPaid(element: OrderModel) {
    this.appService.setLoadingStatus(true);
    const getOrderSubscription = this.orderService
      .getById(element.id)
      .pipe(finalize(() => Utilities.unsubscribe(getOrderSubscription)))
      .subscribe(order => {
        if (order) {
          order.isPaymentNotified = true;
          this.orderService
            .update(order)
            .then(() => {
              NotificationService.showSuccessMessage('Notify successful');
              this.appService.setLoadingStatus(false);
            })
            .catch(() => {
              NotificationService.showErrorMessage(
                'Notify failed, please try again'
              );
              this.appService.setLoadingStatus(false);
            });
        } else {
          this.appService.setLoadingStatus(false);
        }
      });
  }

  filterChanged(event) {
    if (event.value === 'paid') {
      // Get paid orders
      this.fetchData(true);
    } else {
      // Get unpaid orders
      this.fetchData(false);
    }
  }

  private fetchData(isPaid) {
    this.appService.setLoadingStatus(true);
    this.dataSource.sort = this.sort;
    Utilities.unsubscribe(this.getOrdersSubscription);
    this.getOrdersSubscription = this.orderService.getsByPaymentState(isPaid, this.authService.currentUser.uid)
      .subscribe(results => {
        if (results) {
          if (results.length > 0) {
            this.restaurantService.gets().subscribe(restaurants => {
              results.forEach(item => {
                if (restaurants) {
                  const restaurant = restaurants.find(t => t.id === item.restaurantId);
                  item['restaurantName'] = restaurant.name;
                }
                item.orderDate = Utilities.convertTimestampToDate(item.orderDate);
              });
              this.dataSource.data = results;
            });
          } else {
            this.dataSource.data = results;
          }
        } else {
          this.dataSource.data = results;
        }

        this.appService.setLoadingStatus(false);
      }, () => this.appService.setLoadingStatus(false));
  }
}
