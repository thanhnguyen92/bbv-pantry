import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OrderItem } from 'src/app/shared/models/order-item.model';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-user-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class UserCartComponent {
  @Input() cart: OrderItem[] = [];
  @Output() changeCart: EventEmitter<any> = new EventEmitter<any>();
  @Output() submitCart: EventEmitter<any> = new EventEmitter<any>();

  total = 0;

  constructor(private dialog: MatDialog,
    public orderService: OrderService) { }

  addAmount(item: OrderItem) {
    this.cart.forEach(currentItem => {
      if (currentItem.menuId === item.menuId) {
        currentItem.amount++;
      }
    });

    this.cart = [...this.cart];
    this.changeCart.emit(this.cart);
  }

  subtractAmount(item: OrderItem) {
    this.cart.forEach(currentItem => {
      if (currentItem.menuId === item.menuId) {
        currentItem.amount--;
      }
    });

    this.cart = [... this.cart.filter(t => t.amount > 0)];
    this.changeCart.emit(this.cart);
  }

  deleteItem(item: OrderItem) {
    this.cart = [... this.cart.filter(t => t.menuId !== item.menuId)];
    this.changeCart.emit(this.cart);
  }

  clearOrder() {
    this.cart = [];
    this.cart = [... this.cart];
    this.changeCart.emit(this.cart);
  }

  proceedOrder() {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { title: 'Confirmation', content: 'Are you sure to process this order?', noButton: 'No', yesButton: 'Yes' }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.submitCart.emit(this.cart);
      }
    });
  }
}
