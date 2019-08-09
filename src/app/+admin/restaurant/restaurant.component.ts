import { Component, OnInit } from '@angular/core';
import { RestaurantModel } from 'src/app/shared/models/restaurant.model';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {
  restaurants: RestaurantModel[] = [];
  displayedColumns: string[] = ['name', 'phone', 'location'];

  constructor() {}

  ngOnInit() {
    this.restaurants.push({
      id: 0,
      name: 'Test 1',
      location: 'Ho Chi Minh',
      phone: '0778860048'
    } as RestaurantModel);
    this.restaurants.push({
      id: 1,
      name: 'Test 2',
      location: 'Ho Chi Minh',
      phone: '0778860048'
    } as RestaurantModel);
  }
}
