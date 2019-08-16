import { AppService } from './../shared/services/app.service';
import { MenuService } from './../shared/services/menu.service';
import { Component, OnInit } from '@angular/core';
import { MenuModel } from '../shared/models/menu.model';
import { OrderItem } from '../shared/models/order-item.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  currentDate = new Date();
  menu: MenuModel[] = [];
  cart: OrderItem[] = [];

  constructor() { }

  addToCart(item: MenuModel) {
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

  changeCart(cart) {
      this.cart = [...cart];
  }
}
