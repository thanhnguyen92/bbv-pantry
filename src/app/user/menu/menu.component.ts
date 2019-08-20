import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { MenuModel } from 'src/app/shared/models/menu.model';
import { AppService } from 'src/app/shared/services/app.service';
import { MenuService } from 'src/app/shared/services/menu.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Subscription } from 'rxjs';
import { Utilities } from 'src/app/shared/services/utilities';

@Component({
  selector: 'app-user-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class UserMenuComponent implements OnInit, OnDestroy, OnChanges {
  @Input() restaurantId;
  @Output() addToCart: EventEmitter<any> = new EventEmitter<any>();
  @Output() menuChanged: EventEmitter<any> = new EventEmitter<any>();

  menu: MenuModel[] = [];

  private getMenuSubscription: Subscription;

  constructor(private appService: AppService,
    private menuService: MenuService) { }

  ngOnInit() {
    this.fetchData(this.restaurantId);
  }

  ngOnDestroy(): void {
    Utilities.unsubscribe(this.getMenuSubscription);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.fetchData(changes['restaurantId'].currentValue);
  }

  addCartItem(item: MenuModel) {
    this.addToCart.emit(item);
  }

  private fetchData(restaurantId) {
    if (restaurantId) {
      this.appService.setLoadingStatus(true);
      
      Utilities.unsubscribe(this.getMenuSubscription);
      this.getMenuSubscription = this.menuService.getByRestaurantId(restaurantId).subscribe(menuItems => {
        const itemChanged = menuItems.find(t => t['type'] === 'modified');
        if (itemChanged) {
          NotificationService.showInfoMessage(`There are a few updates on your menu, please check again`);
          this.menuChanged.emit(menuItems);
        }
        this.menu = [...menuItems];
        this.appService.setLoadingStatus(false);
      }, () => this.appService.setLoadingStatus(false));
    }
  }
}
