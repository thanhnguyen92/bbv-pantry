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

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class UserHistoryComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = [
    'orderDate',
    'orderItems',
    'totalPrice',
    'actions'
  ];
  orders: OrderModel[] = [];
  dataSource = new MatTableDataSource(this.orders);
  private getOrdersSubscription: Subscription;

  constructor(
    private appService: AppService,
    private orderService: OrderService,
    private bookingService: BookingService) { }

  ngOnInit() {
    this.fetchData(false);
  }

  ngOnDestroy(): void {
    Utilities.unsubscribe(this.getOrdersSubscription);
  }

  onCancelOrder(element: OrderModel) {
    if (element && !element.isPaid) {
      console.log(element);
      this.appService.setLoadingStatus(true);
      const getBookingSubscription = this.bookingService.getById(element.bookingId)
        .pipe(finalize(() => Utilities.unsubscribe(getBookingSubscription)))
        .subscribe(booking => {
          if (booking && booking.isClosed) {
            this.orderService.delete(element.uid)
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
    this.getOrdersSubscription = this.orderService.getsPaidOrUnpaid(isPaid)
      .subscribe(results => {
        results.forEach(item => {
          item.orderDate = Utilities.convertTimestampToDate(item.orderDate);
        });
        this.dataSource.data = results;

        this.appService.setLoadingStatus(false);
      }, () => this.appService.setLoadingStatus(false));
  }
}
