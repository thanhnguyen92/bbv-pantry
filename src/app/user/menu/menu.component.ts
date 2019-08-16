import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuModel } from 'src/app/shared/models/menu.model';
import { AppService } from 'src/app/shared/services/app.service';
import { MenuService } from 'src/app/shared/services/menu.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  @Input() date: Date;
  @Output() addToCart: EventEmitter<any> = new EventEmitter<any>();
  menu: MenuModel[] = [];

  constructor(private appService: AppService,
    private menuService: MenuService) { }

  ngOnInit() {
    this.appService.setLoadingStatus(true);
    this.date.setDate(19);
    this.date.setHours(17, 0, 0, 0);
    this.menuService.getRestaurantByBookingDate(new Date(this.date.toUTCString())).subscribe(results => {
      this.menuService.getMenuByRestaurantId(results[0].restaurantId).subscribe(menuItems => {
        this.menu = [...menuItems];
        this.appService.setLoadingStatus(false);
      }, () => this.appService.setLoadingStatus(false));
    }, () => this.appService.setLoadingStatus(false));
  }

  addCartItem(item: MenuModel) {
    this.addToCart.emit(item);
  }
}
