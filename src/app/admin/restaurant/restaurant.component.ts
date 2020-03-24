import { RestaurantService } from './../../shared/services/restaurant.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { AppService } from 'app/shared/services/app.service';
import { Utilities } from 'app/shared/services/utilities';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from 'app/shared/services/notification.service';
import { RestaurantModel } from 'app/shared/models/restaurant.model';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { RestaurantItemComponent } from './restaurant-item/restaurant-item.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-restaurant-admin',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantAdminComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource = new MatTableDataSource<RestaurantModel>();
  displayedColumns = ['name', 'location', 'phone', 'actions'];

  // Private
  private getRestaurantSubscription: Subscription;

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _restaurantService: RestaurantService,
    private _appService: AppService,
    private _dialog: MatDialog,
    private _route: Router,
    private _activatedRoute: ActivatedRoute) {
    // this._fuseTranslationLoaderService.loadTranslations(english);
  }

  ngOnInit() {
    this.paginator.pageSize = 10;
    this.dataSource.paginator = this.paginator;
    this.fetchData();
  }

  onCreate() {
    this.showItemDialog();
  }

  onEdit(restaurant) {
    this.showItemDialog(restaurant);
  }

  onDelete(restaurant) {
    this._dialog.closeAll();
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { title: 'Confirmation', content: `Are you sure to delete '${restaurant.name}'?`, noButton: 'BUTTON.NO', yesButton: 'BUTTON.YES' }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._restaurantService.delete(restaurant.id)
          .then(() => {
            NotificationService.showSuccessMessage('Delete successful');
          }).catch(() => {
            NotificationService.showErrorMessage();
          });
      }
    });
  }

  onGotoMenu(restaurant) {
    this._route.navigate([restaurant.id, 'menu'], {
      relativeTo: this._activatedRoute
    });
  }

  applyFilter(event) {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }

  private fetchData() {
    this._appService.setLoadingStatus(true);
    Utilities.unsubscribe(this.getRestaurantSubscription);
    this.getRestaurantSubscription = this._restaurantService.gets()
      .subscribe(result => {
        this.dataSource.data = [...result];
        this.dataSource.sort = this.sort;
        this._appService.setLoadingStatus(false);
      }, () => this._appService.setLoadingStatus(false));
  }

  private showItemDialog(restaurant: RestaurantModel = new RestaurantModel()) {
    this._dialog.closeAll();
    const dialogRef = this._dialog.open(RestaurantItemComponent, {
      width: '350px',
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
        service = this._restaurantService.update({ ...result });
      } else {
        // Create
        service = this._restaurantService.add({ ...result });
      }

      service.then(() => {
        NotificationService.showSuccessMessage('Save successful');
      }).catch(() => {
        NotificationService.showErrorMessage();
      });
    });
  }
}
