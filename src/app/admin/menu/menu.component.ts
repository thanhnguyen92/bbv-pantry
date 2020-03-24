import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { locale as enLocale } from './menu-en.locale';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

/** Components */
import { RestaurantSelectionComponent } from './restaurant-selection/restaurant-selection.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { ConfirmDialogComponent } from 'app/shared/components/confirm-dialog/confirm-dialog.component';

/** Models */
import { MenuModel } from 'app/shared/models/menu.model';
import { RestaurantModel } from 'app/shared/models/restaurant.model';

/** Services */
import { AppService } from 'app/shared/services/app.service';
import { MenuService } from 'app/shared/services/menu.service';
import { Utilities } from 'app/shared/services/utilities';
import { NotificationService } from 'app/shared/services/notification.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { RestaurantService } from 'app/shared/services/restaurant.service';

@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuAdminComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = ['name', 'price', 'notes', 'status', 'actions'];
  restaurants: RestaurantModel[] = [];
  menus: MenuModel[] = [];
  dataSource = new MatTableDataSource(this.menus);
  loading = false;

  private restaurantId: string;
  private _activatedRouteSub: Subscription;
  private _getRestaurantSub: Subscription;

  constructor(
    private _dialog: MatDialog,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _appService: AppService,
    private _menuService: MenuService,
    private _restaurantService: RestaurantService) {
    this._fuseTranslationLoaderService.loadTranslations(enLocale);
  }

  ngOnInit() {
    this.paginator.pageSize = 10;
    this.dataSource.paginator = this.paginator;
    this._activatedRouteSub = this._activatedRoute.paramMap.subscribe((params: ParamMap) => {
      // Fetch restaurant data
      this._appService.setLoadingStatus(true);
      this._getRestaurantSub = this._restaurantService.gets()
        .subscribe(results => {
          this.restaurants = [...results];
          if (params.keys.length === 0) {
            // Default select first restaurant
            this.restaurantId = this.restaurants[0].id;
          } else {
            this.restaurantId = params.get('id');
          }

          this.fetchData();
        }, () => this._appService.setLoadingStatus(false));
    });


  }

  ngOnDestroy(): void {
    this._dialog.closeAll();
    Utilities.unsubscribe(this._activatedRouteSub);
    Utilities.unsubscribe(this._getRestaurantSub);
  }

  onCreate() {
    this.showItemDialog();
  }

  onEdit(restaurant) {
    this.showItemDialog(restaurant);
  }

  onDelete(menuItem: MenuModel) {
    this._dialog.closeAll();
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title: 'Confirmation',
        content: 'Are you sure to delete?',
        noButton: 'No',
        yesButton: 'Yes'
      }
    });
    const deleteConfirmationSub = dialogRef
      .afterClosed()
      .pipe(finalize(() => Utilities.unsubscribe(deleteConfirmationSub)))
      .subscribe(res => {
        if (res) {
          this._menuService
            .delete(menuItem.id)
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

  onChangeState(element: MenuModel) {
    this._appService.setLoadingStatus(true);
    const getMenuSubscription = this._menuService
      .getById(element.id)
      .pipe(finalize(() => Utilities.unsubscribe(getMenuSubscription)))
      .subscribe(menu => {
        if (menu) {
          menu.isActive = !element.isActive;
          this._menuService
            .update(menu)
            .then(() => {
              NotificationService.showSuccessMessage('Update successful');
              this._appService.setLoadingStatus(false);
            })
            .catch(() => {
              NotificationService.showErrorMessage(
                'Update failed, please try again'
              );
              this._appService.setLoadingStatus(false);
            });
        } else {
          this._appService.setLoadingStatus(false);
        }
      });
  }

  onRestaurantSelected(event) {
    this.restaurantId = event.value;
    this.fetchData();
  }

  goToRestaurant() {
    // this._router.navigate(['admin', 'restaurant']);
    this.showRestaurantSelection();
  }

  applyFilter(event) {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }

  private fetchData() {
    this._appService.setLoadingStatus(true);
    this.dataSource.sort = this.sort;
    this._menuService.getByRestaurantId(this.restaurantId)
      .subscribe((results: MenuModel[]) => {
        this.dataSource.data = results;
        this._appService.setLoadingStatus(false);
      }, () => this._appService.setLoadingStatus(false));
  }

  private showRestaurantSelection() {
    this._dialog.closeAll();
    const diaLogRef = this._dialog.open(RestaurantSelectionComponent, {
      width: '250px',
      data: {},
      hasBackdrop: false
    });

    this._appService.setLoadingStatus(true);
    const restaurantSelectionSub = diaLogRef
      .afterClosed()
      .pipe(finalize(() => {
        this._appService.setLoadingStatus(false);
        Utilities.unsubscribe(restaurantSelectionSub);
      }))
      .subscribe((data: RestaurantModel) => {
        if (data) {
          this._router.navigate(['admin', 'menu', 'restaurant', data.id]);
        }
      });
  }

  private showItemDialog(menuItem: MenuModel = new MenuModel()) {
    this._dialog.closeAll();
    const diaLogRef = this._dialog.open(MenuItemComponent, {
      width: '250px',
      data: { ...menuItem },
      hasBackdrop: false
    });

    diaLogRef.afterClosed().subscribe((data: MenuModel) => {
      if (data) {
        if (!data.price) {
          data.price = 0;
        }
        let service;
        if (data.id) {
          service = this._menuService.update({ ...data });
        } else {
          service = this._menuService.add({
            ...data,
            ...{ restaurantId: this.restaurantId }
          });
        }
        service
          .then(() => {
            NotificationService.showSuccessMessage('Save successful');
          })
          .catch(() => {
            NotificationService.showErrorMessage('Save failed');
          });
      }
    });
  }
}
