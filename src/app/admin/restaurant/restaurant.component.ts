import { AppService } from './../../shared/services/app.service';
import { Component, OnInit, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';

/** Components */
import { RestaurantItemComponent } from './restaurant-item/restaurant-item.component';
import { RestaurantModel } from 'src/app/shared/models/restaurant.model';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { map, finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/shared/services/order.service';
import { Order } from 'src/app/shared/models/order.model';
@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit, OnDestroy {
  restaurants: RestaurantModel[] = [];
  dataSource = new MatTableDataSource(this.restaurants);
  loading = false;
  displayedColumns: string[] = ['name', 'phone', 'location', 'actions'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private dialog: MatDialog,
    private restaurantService: RestaurantService,
    private appService: AppService,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.fetchData();
  }

  ngOnDestroy(): void { }
  onCreate() {
    this.showDialog();
  }

  onEdit(restaurant) {
    this.showDialog(restaurant);
  }

  onDelete(restaurant) {
    this.showDialogConfirmDelete(restaurant);
  }
  onGotoMenu(restaurant) {
    this.route.navigate([restaurant.uid, 'menu'], {
      relativeTo: this.activeRoute
    });
  }
  applyFilter(filterVal) {
    this.dataSource.filter = filterVal.trim().toLowerCase();
  }

  testNestedModelOrder() {
    const order = {
      customerName: 'customerName',
      orderItems: [
        {
          menuId: 'menuId'
        },
        { menuId: 'menuId 2' }
      ],
      totalPrice: 'totalPrice'
    } as Order;

    this.orderService
      .add(order)
      .then(() => {
        NotificationService.showSuccessMessage('Success');
        this.loadNestedModelOrder();
      })
      .catch(error => {
        NotificationService.showErrorMessage(error);
      });
  }

  loadNestedModelOrder() {
    const snapShotObserver = this.orderService
      .getAll()
      .subscribe(result => {
        console.log(result);
        snapShotObserver.unsubscribe();
      });
  }

  reloadTable() {
    this.fetchData();
  }

  private fetchData() {
    this.appService.setLoadingStatus(true);
    this.dataSource.sort = this.sort;
    this.restaurantService.getRestaurants()
      .subscribe(result => {
        this.dataSource.data = result;
        this.appService.setLoadingStatus(false);
      }, () => this.appService.setLoadingStatus(false));
  }

  private showDialogConfirmDelete(restaurant) {
    let dialogRef;
    if (dialogRef) {
      return;
    }
    dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { ...restaurant }
    });
    dialogRef.afterClosed().subscribe((result: RestaurantModel) => {
      if (result && result.uid) {
        this.restaurantService
          .delete(result.uid)
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
  private showDialog(restaurant: RestaurantModel = new RestaurantModel()) {
    const dialogRef = this.dialog.open(RestaurantItemComponent, {
      width: '250px',
      data: { ...restaurant },
      hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe((result: RestaurantModel) => {
      if (!result) {
        return;
      }

      let service;
      if (result.uid) {
        // Edit
        service = this.restaurantService.update({ ...result });
      } else {
        // Create
        service = this.restaurantService.add({ ...result });
      }

      service
        .then(() => {
          NotificationService.showSuccessMessage('Save successful');
        })
        .catch(() => {
          NotificationService.showErrorMessage(
            'Something went wrong, please try again'
          );
        });
    });
  }
}
