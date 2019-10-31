import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ElementRef
} from '@angular/core';
import { HappyHoursModel } from 'src/app/shared/models/happy-hours.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';
import { HappyHoursService } from 'src/app/shared/services/happy-hours.service';
import { AppService } from 'src/app/shared/services/app.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Utilities } from 'src/app/shared/services/utilities';
import { map } from 'rxjs/operators';
import { BaseEntity } from 'src/app/shared/models/base.model';
import { OrderNotesService } from 'src/app/shared/services/order-notes.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-order-notes',
  templateUrl: './order-notes.component.html',
  styleUrls: ['./order-notes.component.scss']
})
export class OrderNotesComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  orderNotes: OrderNotes[] = [];
  displayedColumns: string[] = [
    'name',
    'food',
    'notes',
    'price',
    'paied',
    'date'
  ];
  dataSource = new MatTableDataSource(this.orderNotes);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('priceEditable', { static: false }) priceEditable: ElementRef;
  isEditablePrice = false;
  filterChangeSubcription: Subscription;
  getDataSubscription: Subscription;
  constructor(
    private orderNotesService: OrderNotesService,
    private appService: AppService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.formGroup = fb.group({
      name: ['', Validators.required],
      food: ['', Validators.required],
      notes: []
    });
    if (this.isAdmin) {
      this.displayedColumns.push('actions');
    }
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.appService.setLoadingStatus(true);
    this.getDataSubscription = this.orderNotesService
      .gets()
      .pipe(
        map(items => {
          return items.sort((item1, item2) =>
            item1.orderDate > item2.orderDate ? 1 : 0
          );
        })
      )
      .subscribe(res => {
        this.orderNotes = res;

        this.dataSource.data = res;
        this.appService.setLoadingStatus(false);
      });

    // this.filterChangeSubcription = this.formGroup.controls.filterText.valueChanges.subscribe(
    //   val => {
    //     const filtered = this.orderNotes.filter(register => {
    //       if (
    //         register.name
    //           .normalize('NFD')
    //           .replace(/[\u{0080}-\u{FFFF}]/gu, '')
    //           .toLocaleLowerCase()
    //           .indexOf(
    //             val
    //               .normalize('NFD')
    //               .replace(/[\u{0080}-\u{FFFF}]/gu, '')
    //               .toLocaleLowerCase()
    //           ) !== -1
    //         // register.name.localeCompare(val, 'en', {
    //         //   sensitivity: 'base',
    //         //   usage: 'search'
    //         // }) >= 0
    //       ) {
    //         return register;
    //       }
    //     });
    //     this.dataSource.data = filtered;
    //     if (val.length === 0) {
    //       this.dataSource.data = this.registers;
    //     }
    //   }
    // );
  }
  formatFood(event, element) {
    const foodVal = this.formGroup.controls.food.value;
    this.formGroup.controls.food.setValue(`${foodVal} + `);
    element.focus();
  }
  order() {
    if (!this.formGroup.valid) {
      return false;
    }

    const orderNotes = this.formGroup.value;
    orderNotes.date = new Date();
    orderNotes.price = 25000;
    this.addOrder(orderNotes);
  }
  private addOrder(orderNotes: OrderNotes) {
    this.appService.setLoadingStatus(true);
    this.orderNotesService
      .add(orderNotes)
      .then(res => {
        NotificationService.showSuccessMessage('Order successfully!');
        console.log(res);
      })
      .finally(() => {
        this.appService.setLoadingStatus(false);
      });
  }
  onCancelRegister(orderNotes: OrderNotes) {
    this.appService.setLoadingStatus(true);
    this.orderNotesService
      .delete(orderNotes.id)
      .then(res => {
        console.log(res);
        NotificationService.showSuccessMessage('Delete successfully!');
      })
      .finally(() => {
        this.appService.setLoadingStatus(false);
      });
  }
  submitOrder(event) {
    if (event.keyCode === 13) {
      this.order();
    }
  }
  get isAdmin() {
    return this.authService.isAdmin;
  }
  control(name) {
    return this.formGroup.controls[name];
  }
  activeEditPrice() {
    if (!this.authService.isAdmin) {
      return;
    }
    this.isEditablePrice = true;
    setTimeout(() => {
      this.priceEditable.nativeElement.focus();
    }, 0);
  }
  updatePrice(orderNotes: OrderNotes) {
    this.appService.setLoadingStatus(true);
    this.isEditablePrice = false;
    this.orderNotesService
      .update(orderNotes)
      .then(res => {
        console.log(res);
        NotificationService.showSuccessMessage('Update successfully!');
      })
      .finally(() => {
        this.appService.setLoadingStatus(false);
      });
  }
  updatePaid(orderNotes: OrderNotes) {
    if (!this.isAdmin) {
      return;
    }
    this.appService.setLoadingStatus(true);
    orderNotes.paied = true;
    this.orderNotesService
      .update(orderNotes)
      .then(res => {
        console.log(res);
        NotificationService.showSuccessMessage('Update successfully!');
      })
      .finally(() => {
        this.appService.setLoadingStatus(false);
      });
  }

  onCopyOrderItems() {
    if (this.orderNotes && this.orderNotes.length > 0) {
      // this.orderNotes.forEach(order => {
      //   if (order && order.orderItems && order.orderItems.length > 0) {
      //     order.orderItems.forEach(item => {
      //       const dbItem = { ...item };
      //       const orderedItem = orderedItems.find(
      //         t => t.menuId === dbItem.menuId
      //       );
      //       if (orderedItem) {
      //         orderedItem.amount += dbItem.amount;
      //       } else {
      //         orderedItems.push(dbItem);
      //       }
      //     });
      //   }
      // });

      let clipboardText = '';
      this.orderNotes.forEach((item, idx) => {
        const notes = item.notes ? `(${item.notes})` : '';
        clipboardText += `${item.name} (${item.food}) ${notes}\r\n`;
        // if (idx < orderedItems.length - 1) {
        //   clipboardText += `\r\n`;
        // }
      });

      const listener = (e: ClipboardEvent) => {
        e.clipboardData.setData('text/plain', clipboardText);
        e.preventDefault();
      };

      document.addEventListener('copy', listener);
      document.execCommand('copy');
      document.removeEventListener('copy', listener);
      NotificationService.showSuccessMessage('Copied to clipboard');
    }
  }

  ngOnDestroy(): void {
    Utilities.unsubscribe(this.filterChangeSubcription);
    Utilities.unsubscribe(this.getDataSubscription);
  }
}

export class OrderNotes implements BaseEntity {
  id?: string;
  uid?: string;
  name: string;
  food: string;
  price: number;
  notes: string;
  paied: boolean;
  orderDate: Date;
}
