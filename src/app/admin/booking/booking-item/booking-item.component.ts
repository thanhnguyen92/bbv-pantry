import { Component, Inject, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

/** Models */
import { BookingModel } from 'app/shared/models/booking.model';
import { RestaurantModel } from 'app/shared/models/restaurant.model';

/** Services */
import { AppService } from 'app/shared/services/app.service';
import { RestaurantService } from 'app/shared/services/restaurant.service';
import { Utilities } from 'app/shared/services/utilities';
import { NotificationService } from 'app/shared/services/notification.service';

@Component({
  selector: 'app-booking-item-admin',
  templateUrl: './booking-item.component.html',
  styleUrls: ['./booking-item.component.scss']
})
export class BookingItemAdminComponent implements OnInit {
  @ViewChild('fromPicker', { static: false }) fromPicker: ElementRef;

  form: FormGroup;
  restaurants: RestaurantModel[] = [];
  restaurantId: string;
  bookingFromTime: string;
  bookingToTime: string;

  constructor(
    public dialogRef: MatDialogRef<BookingItemAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BookingModel,
    private appService: AppService,
    private restaurantService: RestaurantService) {
    this.form = new FormGroup({
      id: new FormControl(''),
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
    if (!Utilities.isObjectEmpty(this.data)) {
      this.restaurantId = this.data.restaurantId;
      this.form.patchValue(this.data);
      this.bookingFromTime = `${this.data.bookingFrom.getHours()}:${this.data.bookingFrom.getMinutes()}`;
      this.bookingToTime = `${this.data.bookingTo.getHours()}:${this.data.bookingTo.getMinutes()}`;
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
      this.data.bookingFrom.setHours(
        this.bookingFromTime.split(':')[0],
        this.bookingFromTime.split(':')[1],
        0,
        0
      );
      this.data.bookingTo.setHours(
        this.bookingToTime.split(':')[0],
        this.bookingToTime.split(':')[1],
        0,
        0
      );
      this.data.bookingFrom = Utilities.convertToUTC(this.data.bookingFrom);
      this.data.bookingTo = Utilities.convertToUTC(this.data.bookingTo);
      if (
        Utilities.compareDates(this.data.bookingFrom, this.data.bookingTo) < 0
      ) {
        this.dialogRef.close(this.data);
      } else {
        NotificationService.showWarningMessage(
          'From date must be smaller than To date'
        );
      }
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
    const restaurant = this.restaurants.find(t => t.id === event.value);
    if (restaurant) {
      this.restaurantId = restaurant.id;
      this.form.patchValue({ restaurantId: restaurant.id });
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
  onfocusFromDate() {
    this.fromPicker.nativeElement.click();
  }
}
