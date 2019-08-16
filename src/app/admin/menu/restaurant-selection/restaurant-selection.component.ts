import { AppService } from './../../../shared/services/app.service';
import { RestaurantModel } from 'src/app/shared/models/restaurant.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-restaurant-selection',
  templateUrl: './restaurant-selection.component.html',
  styleUrls: ['./restaurant-selection.component.scss']
})
export class RestaurantSelectionComponent implements OnInit {
  restaurants: RestaurantModel[] = [];

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: RestaurantModel,
    private router: Router,
    private appService: AppService,
    private restaurantService: RestaurantService) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSelected(event) {
    this.data = this.restaurants.find(t => t.uid === event.value);
  }

  ngOnInit() {
    this.appService.setLoadingStatus(true);

    // Fetch restaurant data
    this.restaurantService.getRestaurants()
      .subscribe(results => {
        this.restaurants = [...results];
        this.appService.setLoadingStatus(false);
      }, () => this.appService.setLoadingStatus(false));
  }
}
