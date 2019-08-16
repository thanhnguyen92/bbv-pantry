import { AppService } from './../shared/services/app.service';
import { MenuService } from './../shared/services/menu.service';
import { Component, OnInit } from '@angular/core';
import { MenuModel } from '../shared/models/menu.model';
import { OrderItem } from '../shared/models/order-item.model';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  currentDate = new Date();
  menu: MenuModel[] = [];
  cart: OrderItem[] = [];

  constructor(
    private dialog: MatDialog,
    private appService: AppService,
    private menuService: MenuService) { }

  ngOnInit() {
    this.appService.setLoadingStatus(true);
    this.currentDate.setDate(19);
    this.currentDate.setHours(17, 0, 0, 0);
    this.menuService.getRestaurantByBookingDate(new Date(this.currentDate.toUTCString())).subscribe(results => {
      this.menuService.getMenuByRestaurantId(results[0].restaurantId).subscribe(menuItems => {
        console.log(menuItems);
        this.menu = [...menuItems];
        this.appService.setLoadingStatus(false);
      }, () => this.appService.setLoadingStatus(false));
    }, () => this.appService.setLoadingStatus(false));
  }

  addToCart(item: MenuModel) {
    console.log(item);

    let isExisted = false;
    this.cart.forEach(currentItem => {
      if (currentItem.menuId === item.uid) {
        currentItem.amount++;
        isExisted = true;
      }
    });
    if (!isExisted) {
      const cart = {
        menuId: item.uid,
        name: item.name,
        price: item.price,
        amount: 1
      } as OrderItem;

      this.cart.push(cart);
    }
  }

  addAmount(item: OrderItem) {
    this.cart.forEach(currentItem => {
      if (currentItem.menuId === item.menuId) {
        currentItem.amount++;
      }
    });

    this.cart = [...this.cart];
  }

  subtractAmount(item: OrderItem) {
    this.cart.forEach(currentItem => {
      if (currentItem.menuId === item.menuId) {
        currentItem.amount--;
      }
    });

    this.cart = [... this.cart.filter(t => t.amount > 0)];
  }

  deleteItem(item: OrderItem) {
    this.cart = [... this.cart.filter(t => t.menuId !== item.menuId)];
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
