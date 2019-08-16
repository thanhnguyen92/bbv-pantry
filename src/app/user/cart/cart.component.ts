import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OrderItem } from 'src/app/shared/models/order-item.model';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class UserCartComponent implements OnInit {
  @Input() cart: OrderItem[] = [];
  @Output() changeCart: EventEmitter<any> = new EventEmitter<any>();

  constructor(private dialog: MatDialog) { }

  ngOnInit() { }

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

  proceedOrder() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { title: 'Confirmation', content: 'Are you sure to process this order?', noButton: 'No', yesButton: 'Yes' }
    });
    dialogRef.afterClosed().subscribe(() => {

    });
  }
}
