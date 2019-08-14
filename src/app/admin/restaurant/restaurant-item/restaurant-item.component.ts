import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RestaurantModel } from 'src/app/shared/models/restaurant.model';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';

@Component({
  selector: 'app-restaurant-item',
  templateUrl: './restaurant-item.component.html',
  styleUrls: ['./restaurant-item.component.scss'],
})
export class RestaurantItemComponent {
  constructor(
    public dialogRef: MatDialogRef<RestaurantItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RestaurantModel,
    private restaurantService: RestaurantService,
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }
}
