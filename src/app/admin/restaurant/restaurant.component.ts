import { AppService } from './../../shared/services/app.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';

/** Components */
import { RestaurantItemComponent } from './restaurant-item/restaurant-item.component';
import { RestaurantModel } from 'src/app/shared/models/restaurant.model';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Utilities } from 'src/app/shared/services/utilities';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  restaurants: RestaurantModel[] = [];
  dataSource = new MatTableDataSource(this.restaurants);
  loading = false;
  displayedColumns: string[] = ['name', 'phone', 'location', 'actions'];

  private getRestaurantSubscription: Subscription;

  constructor(
    private dialog: MatDialog,
    private restaurantService: RestaurantService,
    private appService: AppService,
    private route: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.fetchData();
  }

  ngOnDestroy(): void {
    Utilities.unsubscribe(this.getRestaurantSubscription);
  }

  onCreate() {
    this.showDialog();
  }

  onEdit(restaurant) {
    this.showDialog(restaurant);
  }

  onDelete(restaurant) {
    this.showDialogConfirmDelete(restaurant);
  }

  onGotoMenu(restaurant: RestaurantModel) {
    this.route.navigate([restaurant.id, 'menu'], {
      relativeTo: this.activeRoute
    });
  }

  applyFilter(filterVal) {
    this.dataSource.filter = filterVal.trim().toLowerCase();
  }

  reloadTable() {
    this.fetchData();
  }

  private fetchData() {
    this.appService.setLoadingStatus(true);
    this.dataSource.sort = this.sort;
    Utilities.unsubscribe(this.getRestaurantSubscription);
    this.getRestaurantSubscription = this.restaurantService.gets()
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
      data: { title: 'Confirmation', content: 'Are you sure to delete?', noButton: 'No', yesButton: 'Yes' }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.restaurantService
          .delete(restaurant.id)
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
      if (result.id) {
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
