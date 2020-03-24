import { Component, OnInit, Inject } from '@angular/core';
import { RestaurantModel } from 'app/shared/models/restaurant.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppService } from 'app/shared/services/app.service';
import { RestaurantService } from 'app/shared/services/restaurant.service';

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
    private appService: AppService,
    private restaurantService: RestaurantService) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSelected(event) {
    this.data = this.restaurants.find(t => t.id === event.value);
  }

  ngOnInit() {
    this.appService.setLoadingStatus(true);

    // Fetch restaurant data
    this.restaurantService.gets()
      .subscribe(results => {
        this.restaurants = [...results];
        this.appService.setLoadingStatus(false);
      }, () => this.appService.setLoadingStatus(false));
  }
}
