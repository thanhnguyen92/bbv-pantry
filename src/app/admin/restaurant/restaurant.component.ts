import { RestaurantService } from './../../shared/services/restaurant.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { AppService } from 'app/shared/services/app.service';
import { Utilities } from 'app/shared/services/utilities';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from 'app/shared/services/notification.service';
import { RestaurantModel } from 'app/shared/models/restaurant.model';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-restaurant-admin',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantAdminComponent implements OnInit {
  @ViewChild('myDataTable', { static: false }) myDataTable: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ColumnMode = ColumnMode;
  SortType = SortType;
  // dataSource: RestaurantModel[] = [];
  dataSource = new MatTableDataSource<RestaurantModel>();
  displayedColumns = ['name', 'location', 'phone', 'actions'];

  // Private
  private getRestaurantSubscription: Subscription;

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _restaurantService: RestaurantService,
    private _appService: AppService,
    private _dialog: MatDialog) {
    // this._fuseTranslationLoaderService.loadTranslations(english);
  }

  ngOnInit() {
    this.fetchData();
    this.paginator.pageSize = 10;
    this.dataSource.paginator = this.paginator;
  }

  onCreate() {
  }

  onEdit(restaurant) {
    console.log(restaurant);
  }

  onDelete(restaurant) {
    this._dialog.closeAll();
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { title: 'Confirmation', content: 'Are you sure to delete?', noButton: 'BUTTON.NO', yesButton: 'BUTTON.YES' }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._restaurantService.delete(restaurant.id)
          .then(() => {
            NotificationService.showSuccessMessage('Delete successful');
          }).catch(() => {
            NotificationService.showErrorMessage('Something went wrong, please try again');
          });
      }
    });
  }

  onGotoMenu(restaurant) { }

  private fetchData() {
    this._appService.setLoadingStatus(true);
    Utilities.unsubscribe(this.getRestaurantSubscription);
    this.getRestaurantSubscription = this._restaurantService.gets()
      .subscribe(result => {
        this.dataSource.data = [...result];

        this._appService.setLoadingStatus(false);
      }, () => this._appService.setLoadingStatus(false));
  }
}
