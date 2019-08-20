
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

/** Services */
import { RestaurantService } from '../shared/services/restaurant.service';
import { NotificationService } from '../shared/services/notification.service';
import { OrderService } from '../shared/services/order.service';
import { AuthService } from '../shared/services/auth.service';
import { AppService } from './../shared/services/app.service';
import { MenuService } from './../shared/services/menu.service';
import { Utilities } from '../shared/services/utilities';

/** Models */
import { MenuModel } from '../shared/models/menu.model';
import { OrderItem } from '../shared/models/order-item.model';
import { Order } from '../shared/models/order.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  currentDate = new Date();
  menu: MenuModel[] = [];
  cart: OrderItem[] = [];
  restaurantId;

  private getMenuSubscription: Subscription;
  private getRestaurantSubscription: Subscription;

  constructor(private appService: AppService,
    private authService: AuthService,
    private menuService: MenuService,
    private restaurantService: RestaurantService,
    private orderService: OrderService) {
    this.currentDate.setDate(19);
    this.currentDate.setHours(17, 0, 0, 0);
  }

  ngOnInit(): void {
    this.appService.setLoadingStatus(true);
    Utilities.unsubscribe(this.getRestaurantSubscription);
    this.getRestaurantSubscription = this.restaurantService.getByBookingDate(Utilities.convertToUTC(this.currentDate))
      .subscribe(results => {
        console.log(results);

        if (results && results.length > 0) {
          this.restaurantService.getByRestaurantIds(results.map(t => t.restaurantId)).subscribe(res => {

          });

          this.restaurantId = results[0].restaurantId;
        } else {
          NotificationService.showInfoMessage(`Don't have any available menus at the moment`);
        }

        this.appService.setLoadingStatus(false);
      }, () => this.appService.setLoadingStatus(false));
  }

  ngOnDestroy(): void {
    Utilities.unsubscribe(this.getMenuSubscription);
    Utilities.unsubscribe(this.getRestaurantSubscription);
  }

  menuChanged(menuItems: MenuModel[]) {
    this.cart.forEach(cartItem => {
      const menuItem = menuItems.find(t => t.uid === cartItem.menuId);
      if (menuItem) {
        cartItem.price = menuItem.price;
      }
    });

    this.cart = [...this.cart];
  }

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

  submitCart(cart: OrderItem[]) {
    if (!cart) {
      NotificationService.showInfoMessage(`You cannot process an empty order`);
    }

    this.appService.setLoadingStatus(true);
    Utilities.unsubscribe(this.getMenuSubscription);
    this.getMenuSubscription = this.menuService.getByRestaurantId(this.restaurantId).subscribe(menuItems => {
      // Check latest price
      cart.forEach(cartItem => {
        const dbItem = menuItems.find(t => t.uid === cartItem.menuId);
        if (dbItem && cartItem.price !== dbItem.price) {
          NotificationService.showInfoMessage(`There are a few updates on your menu, please check again`);
          this.appService.setLoadingStatus(false);
          return;
        }
      });

      // Process order
      const order = {
        orderItems: cart,
        orderDate: Utilities.convertToUTC(new Date()),
        totalPrice: this.orderService.calculatePrice(cart),
        userId: this.authService.currentUser.uid,
        isPaid: false,
      } as Order;

      this.orderService.add(order)
        .then(() => {
          NotificationService.showSuccessMessage('Order successful');
          this.cart = [];
          this.appService.setLoadingStatus(false);
        }).catch(() => {
          NotificationService.showErrorMessage('Order failed');
          this.appService.setLoadingStatus(false);
        });
    }, () => this.appService.setLoadingStatus(false));
  }
}
