import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { HappyHoursModel } from 'src/app/shared/models/happy-hours.model';
import { HappyHoursService } from 'src/app/shared/services/happy-hours.service';
import { AppService } from 'src/app/shared/services/app.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Utilities } from 'src/app/shared/services/utilities';
@Component({
  selector: 'app-happy-hours-list',
  templateUrl: './happy-hours-list.component.html',
  styleUrls: ['./happy-hours-list.component.scss']
})
export class HappyHoursListComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  registers: HappyHoursModel[] = [];
  displayedColumns: string[] = ['name', 'date'];
  dataSource = new MatTableDataSource(this.registers);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  filterChangeSubcription: Subscription;
  getDataSubscription: Subscription;
  constructor(
    private happyHoursService: HappyHoursService,
    private appService: AppService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.formGroup = fb.group({
      filterText: []
    });
    if (this.isAdmin) {
      this.displayedColumns.push('actions');
    }
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.appService.setLoadingStatus(true);
    this.getDataSubscription = this.happyHoursService
      .gets()
      .pipe(
        map(items => {
          return items.sort((item1, item2) =>
            item1.date > item2.date ? 1 : 0
          );
        })
      )
      .subscribe(res => {
        this.registers = res;

        this.dataSource.data = res;
        this.appService.setLoadingStatus(false);
      });

    this.filterChangeSubcription = this.formGroup.controls.filterText.valueChanges.subscribe(
      val => {
        const filtered = this.registers.filter(register => {
          if (
            register.name
              .normalize('NFD')
              .replace(/[\u{0080}-\u{FFFF}]/gu, '')
              .toLocaleLowerCase()
              .indexOf(
                val
                  .normalize('NFD')
                  .replace(/[\u{0080}-\u{FFFF}]/gu, '')
                  .toLocaleLowerCase()
              ) !== -1
            // register.name.localeCompare(val, 'en', {
            //   sensitivity: 'base',
            //   usage: 'search'
            // }) >= 0
          ) {
            return register;
          }
        });
        this.dataSource.data = filtered;
        if (val.length === 0) {
          this.dataSource.data = this.registers;
        }
      }
    );
  }
  onCancelRegister(register: HappyHoursModel) {
    this.appService.setLoadingStatus(true);
    this.happyHoursService
      .delete(register.id)
      .then(res => {
        console.log(res);
      })
      .finally(() => {
        this.appService.setLoadingStatus(false);
      });
  }
  get isAdmin() {
    return this.authService.isAdmin;
  }
  ngOnDestroy(): void {
    Utilities.unsubscribe(this.filterChangeSubcription);
    Utilities.unsubscribe(this.getDataSubscription);
  }
}
