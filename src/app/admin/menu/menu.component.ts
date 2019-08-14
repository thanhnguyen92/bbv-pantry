import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort } from '@angular/material';
import { Menu } from 'src/app/shared/models/menu.model';
import { MenuItemComponent } from './menu-item/menu-item.component';
import {
  RouterLinkActive,
  Route,
  Router,
  ActivatedRoute,
  ParamMap
} from '@angular/router';
import { switchMap, finalize, map } from 'rxjs/operators';
import { MenuService } from 'src/app/shared/services/menu.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { prepareEventListenerParameters } from '@angular/compiler/src/render3/view/template';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

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
  menus: Menu[] = [];
  dataSource = new MatTableDataSource(this.menus);
  loading = false;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(
    private diaLog: MatDialog,
    private route: ActivatedRoute,
    private menuService: MenuService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.restaurantId = params.get('id');
      console.log(this.restaurantId);
    });

    this.initDatatable();
  }

  onCreate() {
    this.showPopupMenuItem();
  }

  onEdit(menuItem: Menu) {
    this.showPopupMenuItem(menuItem);
  }

  onDelete(menuItem: Menu) {
    this.showDialogConfirmDelete(menuItem);
  }
  applyFilter(filterVal) {
    this.dataSource.filter = filterVal.trim().toLowerCase();
  }
  private initDatatable() {
    this.dataSource.sort = this.sort;
    this.menuService
      .gets()
      .snapshotChanges()
      .pipe(
        finalize(() => (this.loading = false)),
        map(actions => {
          this.loading = true;
          return actions.map(a => {
            const data = a.payload.doc.data() as Menu;
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
  private reloadTable() {
    const reloadTableSubcription = this.menuService
      .gets()
      .valueChanges()
      .pipe(
        finalize(() => {
          this.loading = false;
          reloadTableSubcription.unsubscribe();
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

  private showPopupMenuItem(menuItem: Menu = new Menu()) {
    const diaLogRef = this.diaLog.open(MenuItemComponent, {
      width: '250px',
      data: { ...menuItem },
      hasBackdrop: false
    });

    diaLogRef.afterClosed().subscribe((data: Menu) => {
      console.log(data);
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
        .then(result => {
          NotificationService.showSuccessMessage('Save successful.');
        })
        .catch(error => {
          NotificationService.showErrorMessage('Save item failed.');
        });
    });
  }

  private showDialogConfirmDelete(menuItem) {
    const dialogRef = this.diaLog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { ...menuItem }
    });
    dialogRef.afterClosed().subscribe((result: Menu) => {
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
