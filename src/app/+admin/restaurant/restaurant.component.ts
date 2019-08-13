import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource } from '@angular/material';

/** Components */
import { RestaurantItemComponent } from './restaurant-item/restaurant-item.component';
import { RestaurantModel } from 'src/app/shared/models/restaurant.model';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { map, finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
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
    private restaurantService: RestaurantService
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
  private reloadTable() {
    this.reloadTableSubcription = this.restaurantService
      .Gets()
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
      .Gets()
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
          .Delete(result.uid)
          .then(() => {
            window.alert('Delete Success');
          })
          .catch(error => {
            window.alert('Delete Fail');
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
      if (result.uid) {
        // Edit
        this.restaurantService
          .Update({ ...result })
          .then(resultAdd => {
            // TODO: Should implement NotificationService to handle message with toast
            window.alert('Success');
          })
          .catch(error => {
            // TODO: Should implement NotificationService to handle message with toast
            window.alert(error);
          });
      } else {
        // Create
        this.restaurantService
          .Add({ ...result })
          .then(resultAdd => {
            // TODO: Should implement NotificationService to handle message with toast
            window.alert('Success');
          })
          .catch(error => {
            // TODO: Should implement NotificationService to handle message with toast
            window.alert(error);
          });
      }
    });
  }
}
