import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

/** Components */
import { RestaurantItemComponent } from './restaurant-item/restaurant-item.component';
import { RestaurantModel } from 'src/app/shared/models/restaurant.model';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {
  restaurants: RestaurantModel[] = [];
  displayedColumns: string[] = ['name', 'phone', 'location', 'actions'];

  constructor(private dialog: MatDialog) {}

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

  onCreate() {
    this.showDialog();
  }

  onEdit(restaurant) {
    this.showDialog(restaurant);
  }

  private showDialog(restaurant: RestaurantModel = new RestaurantModel()) {
    const dialogRef = this.dialog.open(RestaurantItemComponent, {
      width: '250px',
      data: restaurant
    });

    dialogRef.afterClosed().subscribe((result: RestaurantModel) => {
      console.log(result);
      if (!result) {
        return;
      }
      if (result.id) {
        // Edit
        restaurant = result;
      } else {
        // Create
        result.id = this.restaurants[this.restaurants.length - 1].id++;
        this.restaurants.push(result);
        this.restaurants = [...this.restaurants];
      }
    });
  }
}
