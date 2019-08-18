import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Order } from 'src/app/shared/models/order.model';
import { OrderService } from 'src/app/shared/services/order.service';
import { AppService } from 'src/app/shared/services/app.service';
import { Subscription } from 'rxjs';
import { Utilities } from 'src/app/shared/services/utilities';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class UserHistoryComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = [
    'orderDate',
    'totalPrice'
  ];
  orders: Order[] = [];
  dataSource = new MatTableDataSource(this.orders);
  private getOrdersSubscription: Subscription;

  constructor(private appService: AppService,
    private orderService: OrderService) { }

  ngOnInit() {
    this.fetchData(false);
  }

  ngOnDestroy(): void {
    Utilities.unsubscribe(this.getOrdersSubscription);
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
    this.getOrdersSubscription = this.orderService.gets(isPaid).subscribe(results => {
      results.forEach(item => {
        item.orderDate = new Date(item.orderDate.seconds * 1000)
      });
      this.dataSource.data = results;

      this.appService.setLoadingStatus(false);
    }, () => this.appService.setLoadingStatus(false));
  }
}
