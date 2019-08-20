<<<<<<< HEAD
import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from 'src/app/shared/services/order.service';
import { MatTableDataSource } from '@angular/material/table';
import { Order } from 'src/app/shared/models/order.model';
import { MatSort } from '@angular/material/sort';
import { AppService } from 'src/app/shared/services/app.service';
=======
import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/services/order.service';
>>>>>>> 5498246818741e915f4fa7fdc36653b875a6106a

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  providers: [OrderService]
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource = new MatTableDataSource(this.orders);
  displayedColumns: string[] = ['userId', 'orderDate', 'totalPrice'];
  constructor(
    private orderService: OrderService,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  private fetchData() {
    this.appService.setLoadingStatus(true);
    this.dataSource.sort = this.sort;
    this.orderService.getsPaidOrUnpaid(false).subscribe(
      (results: Order[]) => {
        console.log(results);

        this.dataSource.data = results;
        this.appService.setLoadingStatus(false);
      },
      () => this.appService.setLoadingStatus(false)
    );
  }
}
