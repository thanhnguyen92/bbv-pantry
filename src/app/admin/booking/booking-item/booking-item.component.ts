import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

/** Models */
import { BookingModel } from 'src/app/shared/models/booking.model';
import { RestaurantModel } from './../../../shared/models/restaurant.model';

/** Services */
import { AppService } from 'src/app/shared/services/app.service';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';

@Component({
  selector: 'app-booking-item',
  templateUrl: './booking-item.component.html',
  styleUrls: ['./booking-item.component.scss']
})
export class BookingItemComponent implements OnInit {
  restaurants: RestaurantModel[] = [];

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: BookingModel,
    private appService: AppService,
    private restaurantService: RestaurantService) { }

  ngOnInit() {
    this.appService.setLoadingStatus(true);

    // Fetch restaurant data
    this.restaurantService.gets()
      .subscribe(results => {
        this.restaurants = [...results];
        this.appService.setLoadingStatus(false);
      }, () => this.appService.setLoadingStatus(false));
  }

  onSubmit() {
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onRestaurantSelected(event) {
    this.data.restaurantId = this.restaurants.find(t => t.uid === event.value).uid;
  }
}
