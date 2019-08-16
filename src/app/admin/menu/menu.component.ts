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
import { finalize, map } from 'rxjs/operators';
import { MenuService } from 'src/app/shared/services/menu.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { RestaurantSelectionComponent } from './restaurant-selection/restaurant-selection.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class MenuComponent implements OnInit {
  private restaurantId: string;
  displayedColumns: string[] = [
    'name',
    'price',
    'notes',
    'restaurantId',
    'actions'
  ];
  menus: MenuModel[] = [];
  dataSource = new MatTableDataSource(this.menus);
  loading = false;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private diaLog: MatDialog,
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
    this.menuService.getMenuByRestaurantId(this.restaurantId)
      .subscribe((results: MenuModel[]) => {
        this.dataSource.data = results;
        this.appService.setLoadingStatus(false);
      }, () => this.appService.setLoadingStatus(false));
  }

  private showPopupMenuItem(menuItem: MenuModel = new MenuModel()) {
    const diaLogRef = this.diaLog.open(MenuItemComponent, {
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
            NotificationService.showSuccessMessage('Save successful.');
          })
          .catch(() => {
            NotificationService.showErrorMessage('Save item failed.');
          });
      }
    });
  }

  private showRestaurantSelection() {
    const diaLogRef = this.diaLog.open(RestaurantSelectionComponent, {
      width: '250px',
      data: {},
      hasBackdrop: false
    });

    diaLogRef.afterClosed().subscribe((data: MenuModel) => {
      if (data) {
        this.restaurantId = data.uid;
        this.fetchData();
      }
    });
  }

  private showDialogConfirmDelete(menuItem) {
    const dialogRef = this.diaLog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { ...menuItem }
    });
    dialogRef.afterClosed().subscribe((result: MenuModel) => {
      if (result && result.uid) {
        this.menuService
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
}
