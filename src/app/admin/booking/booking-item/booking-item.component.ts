import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

/** Models */
import { BookingModel } from 'src/app/shared/models/booking.model';
import { RestaurantModel } from './../../../shared/models/restaurant.model';

/** Services */
import { AppService } from 'src/app/shared/services/app.service';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Utilities } from 'src/app/shared/services/utilities';

@Component({
  selector: 'app-booking-item',
  templateUrl: './booking-item.component.html',
  styleUrls: ['./booking-item.component.scss']
})
export class BookingItemComponent implements OnInit {
  form: FormGroup;
  restaurants: RestaurantModel[] = [];
  restaurantId: string;
  bookingFromTime: string;
  bookingToTime: string;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: BookingModel,
    private appService: AppService,
    private restaurantService: RestaurantService
  ) {
    this.form = new FormGroup({
      uid: new FormControl(''),
      bookingFrom: new FormControl(new Date(), [Validators.required]),
      bookingTo: new FormControl(new Date(), [Validators.required]),
      isClosed: new FormControl(false),
      isPreBooking: new FormControl(false),
      restaurantId: new FormControl('', [Validators.required])
    });
    this.bookingFromTime = `${new Date().getHours()}:${new Date().getMinutes()}`;
    this.bookingToTime = `${new Date().getHours()}:${new Date().getMinutes()}`;
  }

  ngOnInit() {
    if (this.data) {
      this.restaurantId = this.data.restaurantId;
      this.form.patchValue(this.data);
    }

    this.appService.setLoadingStatus(true);

    // Fetch restaurant data
    this.restaurantService.gets().subscribe(
      results => {
        this.restaurants = [...results];
        this.appService.setLoadingStatus(false);
      },
      () => this.appService.setLoadingStatus(false)
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.data = this.form.value as BookingModel;
      console.log(this.bookingFromTime.split(':'), this.bookingToTime.split(':'));
      this.data.bookingFrom.setHours(this.bookingFromTime.split(':')[0], this.bookingFromTime.split(':')[1], 0, 0);
      this.data.bookingTo.setHours(this.bookingToTime.split(':')[0], this.bookingToTime.split(':')[1], 0, 0);
      this.dialogRef.close(this.data);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onFromTimeSet(event) {
    this.bookingFromTime = event;
  }

  onToTimeSet(event) {
    this.bookingToTime = event;
  }

  onRestaurantSelected(event) {
    const restaurant = this.restaurants.find(t => t.uid === event.value);
    if (restaurant) {
      this.restaurantId = restaurant.uid;
      this.form.patchValue({ restaurantId: restaurant.uid });
    }
  }

  checkControlInvalid(formControlName) {
    return this.form.controls[formControlName].invalid;
  }

  getErrorMsg(formControlName) {
    if (this.form.controls[formControlName].hasError('required')) {
      return 'You must enter a value';
    }
  }

  private validateForm() {
    if (!this.data) {
      return false;
    }
    return true;
  }
}
