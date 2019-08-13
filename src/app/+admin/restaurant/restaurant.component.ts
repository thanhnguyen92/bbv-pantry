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
@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit, OnDestroy {
  restaurants: RestaurantModel[] = [];
  dataSource = new MatTableDataSource(this.restaurants);
  loading = false;
  private reloadTableSubcription: Subscription;
  displayedColumns: string[] = ['name', 'phone', 'location', 'actions'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private dialog: MatDialog,
    private restaurantService: RestaurantService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.initDataTable();
  }

  ngOnDestroy(): void {}
  onCreate() {
    this.showDialog();
  }

  onEdit(restaurant) {
    this.showDialog(restaurant);
  }

  onDelete(restaurant) {
    this.showDialogConfirmDelete(restaurant);
  }
  applyFilter(filterVal) {
    this.dataSource.filter = filterVal.trim().toLowerCase();
  }
  private reloadTable() {
    this.reloadTableSubcription = this.restaurantService
      .gets()
      .valueChanges()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.reloadTableSubcription.unsubscribe();
        }),
        map(data => {
          this.loading = true;
          return { ...data };
        })
      )
      .subscribe(data => {
        console.log(data);
        this.dataSource.data = { ...data };
      });
  }

  private initDataTable() {
    this.dataSource.sort = this.sort;
    this.restaurantService
      .gets()
      .snapshotChanges()
      .pipe(
        finalize(() => (this.loading = false)),
        map(actions => {
          this.loading = true;
          return actions.map(a => {
            const data = a.payload.doc.data() as RestaurantModel;
            const id = a.payload.doc.id;
            data.uid = id;
            return { ...data };
          });
        })
      )
      .subscribe(result => {
        this.dataSource.data = result;
      });
  }

  private showDialogConfirmDelete(restaurant) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
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
      hasBackdrop: false
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
