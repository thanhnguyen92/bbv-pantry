import { AppService } from './../shared/services/app.service';
import { MenuService } from './../shared/services/menu.service';
import { Component, OnInit } from '@angular/core';
import { MenuModel } from '../shared/models/menu.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  currentDate = new Date();
  menu: MenuModel[] = [];

  constructor(
    private appService: AppService,
    private menuService: MenuService) { }

  ngOnInit() {
    this.appService.setLoadingStatus(true);
    this.currentDate.setDate(19);
    this.currentDate.setHours(0, 0, 0, 0);
    this.menuService.getRestaurantByBookingDate(this.currentDate).subscribe(results => {
      console.log(results);
      this.menuService.getMenuByRestaurantId(results[0].restaurantId).subscribe(menuItems => {
        console.log(menuItems);
      });
      this.appService.setLoadingStatus(false);
    });
  }
}
