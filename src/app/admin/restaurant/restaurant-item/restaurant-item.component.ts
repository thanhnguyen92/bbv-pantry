import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RestaurantModel } from 'app/shared/models/restaurant.model';

@Component({
  selector: 'app-restaurant-item',
  templateUrl: './restaurant-item.component.html',
  styleUrls: ['./restaurant-item.component.scss']
})
export class RestaurantItemComponent {
  constructor(
    public dialogRef: MatDialogRef<RestaurantItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RestaurantModel) { }

  onCancel(): void {
    this.dialogRef.close();
  }
}
