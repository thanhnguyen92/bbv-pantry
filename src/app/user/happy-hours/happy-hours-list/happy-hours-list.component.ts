import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { HappyHoursModel } from 'src/app/shared/models/happy-hours.model';
import { HappyHoursService } from 'src/app/shared/services/happy-hours.service';
import { AppService } from 'src/app/shared/services/app.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-happy-hours-list',
  templateUrl: './happy-hours-list.component.html',
  styleUrls: ['./happy-hours-list.component.scss']
})
export class HappyHoursListComponent implements OnInit {
  formGroup: FormGroup;
  registers: HappyHoursModel[] = [];
  displayedColumns: string[] = ['name'];
  dataSource = new MatTableDataSource(this.registers);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  filterChangeSubcription: Subscription;
  constructor(
    private happyHoursService: HappyHoursService,
    private appService: AppService,
    private fb: FormBuilder
  ) {
    this.formGroup = fb.group({
      filterText: []
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.appService.setLoadingStatus(true);
    this.happyHoursService.gets().subscribe(res => {
      this.registers = res;
      this.dataSource.data = res;
      this.appService.setLoadingStatus(false);
    });

    this.filterChangeSubcription = this.formGroup.controls.filterText.valueChanges.subscribe(
      val => {
        const filtered = this.registers.filter(register => {
          if (
            // register.name
            //   .normalize('NFD')
            //   .replace(/[\u{0080}-\u{FFFF}]/gu, '')
            //   .toLocaleLowerCase()
            //   .indexOf(
            //     val
            //       .normalize('NFD')
            //       .replace(/[\u{0080}-\u{FFFF}]/gu, '')
            //       .toLocaleLowerCase()
            //   ) !== -1
            register.name.localeCompare(val, ['vn', 'en'], {
              sensitivity: 'accent'
            }) === 0
          ) {
            return register;
          }
        });
        this.dataSource.data = filtered;
      }
    );
  }
}
