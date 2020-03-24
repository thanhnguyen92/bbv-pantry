import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

/** Models */
import { UserModel } from 'app/shared/models/user.model';
import { AppService } from 'app/shared/services/app.service';
import { Router, ActivatedRoute } from '@angular/router';

/** Services */
import { UserService } from 'app/shared/services/user.service';
import { Utilities } from 'app/shared/services/utilities';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserAdminComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource = new MatTableDataSource<UserModel>();
  displayedColumns = ['firstName', 'lastName', 'email', 'emailSecondary', 'mobileNumber', 'birthday', 'actions'];

  // Private
  private getUserSubscription: Subscription;

  constructor(
    private _dialog: MatDialog,
    private _appService: AppService,
    private _route: Router,
    private _activatedRoute: ActivatedRoute,
    private _userService: UserService) { }

  ngOnInit() {
    this.paginator.pageSize = 10;
    this.dataSource.paginator = this.paginator;
    this.fetchData();
  }

  ngOnDestroy() {
    Utilities.unsubscribe(this.getUserSubscription);
  }

  private fetchData() {
    this._appService.setLoadingStatus(true);
    Utilities.unsubscribe(this.getUserSubscription);
    this.getUserSubscription = this._userService.gets()
      .subscribe((results: UserModel[]) => {
        if (results) {
          results.forEach(user => {
            const names = user.displayName.split(' ');
            if (!user.firstName) { user.firstName = names[0]; }
            if (!user.lastName && names.length > 1) { user.lastName = names[1]; }
          });
        }
        this.dataSource.data = [...results];
        this.dataSource.sort = this.sort;
        this._appService.setLoadingStatus(false);
      }, () => this._appService.setLoadingStatus(false));
  }
}
