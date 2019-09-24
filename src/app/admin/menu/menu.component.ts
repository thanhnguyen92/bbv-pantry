import { AppService } from './../../shared/services/app.service';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { MenuModel } from 'src/app/shared/models/menu.model';
import { MenuItemComponent } from './menu-item/menu-item.component';
import {
  ActivatedRoute,
  ParamMap,
  Router
} from '@angular/router';
import { MenuService } from 'src/app/shared/services/menu.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { RestaurantSelectionComponent } from './restaurant-selection/restaurant-selection.component';
import { finalize } from 'rxjs/operators';
import { Utilities } from 'src/app/shared/services/utilities';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class MenuComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private restaurantId: string;
  displayedColumns: string[] = [
    'name',
    'price',
    'notes',
    'actions'
  ];
  menus: MenuModel[] = [];
  dataSource = new MatTableDataSource(this.menus);
  loading = false;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private appService: AppService,
    private activatedRoute: ActivatedRoute,
    private menuService: MenuService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      if (params.keys.length === 0) {
        // Show restaurant selection
        this.showRestaurantSelection();
      } else {
        this.restaurantId = params.get('id');
        this.fetchData();
      }
    });
  }

  onCreate() {
    this.showPopupMenuItem();
  }

  onEdit(menuItem: MenuModel) {
    this.showPopupMenuItem(menuItem);
  }

  onDelete(menuItem: MenuModel) {
    this.showDialogConfirmDelete(menuItem);
  }

  applyFilter(filterVal) {
    this.dataSource.filter = filterVal.trim().toLowerCase();
  }

  goToRestaurant() {
    this.router.navigate(['admin', 'restaurant']);
  }

  private fetchData() {
    this.appService.setLoadingStatus(true);
    this.dataSource.sort = this.sort;
    this.menuService.getByRestaurantId(this.restaurantId)
      .subscribe((results: MenuModel[]) => {
        this.dataSource.data = results;
        this.appService.setLoadingStatus(false);
      }, () => this.appService.setLoadingStatus(false));
  }

  private showPopupMenuItem(menuItem: MenuModel = new MenuModel()) {
    const diaLogRef = this.dialog.open(MenuItemComponent, {
      width: '250px',
      data: { ...menuItem },
      hasBackdrop: false
    });

    diaLogRef.afterClosed().subscribe((data: MenuModel) => {
      if (data) {
        let service;
        if (data.uid) {
          service = this.menuService.update({ ...data });
        } else {
          service = this.menuService.add({
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

  private showRestaurantSelection() {
    const diaLogRef = this.dialog.open(RestaurantSelectionComponent, {
      width: '250px',
      data: {},
      hasBackdrop: false
    });

    const restaurantSelectionSub = diaLogRef.afterClosed()
      .pipe(finalize(() => Utilities.unsubscribe(restaurantSelectionSub)))
      .subscribe((data: MenuModel) => {
        if (data) {
          this.router.navigate(['admin', 'restaurant', data.uid, 'menu']);
        }
      });
  }

  private showDialogConfirmDelete(menuItem) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { title: 'Confirmation', content: 'Are you sure to delete?', noButton: 'No', yesButton: 'Yes' }
    });
    const deleteConfirmationSub = dialogRef.afterClosed()
      .pipe(finalize(() => Utilities.unsubscribe(deleteConfirmationSub)))
      .subscribe(res => {
        if (res) {
          this.menuService
            .delete(menuItem.uid)
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
}
