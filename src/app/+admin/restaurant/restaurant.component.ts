import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

/** Components */
import { RestaurantItemComponent } from './restaurant-item/restaurant-item.component';
import { RestaurantModel } from 'src/app/shared/models/restaurant.model';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss'],
})
export class RestaurantComponent implements OnInit {
  restaurants: RestaurantModel[] = [];
  displayedColumns: string[] = ['name', 'phone', 'location', 'actions'];

  constructor(
    private dialog: MatDialog,
    private restaurantService: RestaurantService,
  ) {}

  ngOnInit() {
    this.restaurantService
      .Gets()
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as RestaurantModel;
            const id = a.payload.doc.id;
            data.uid = id;
            return { ...data };
          }),
        ),
      )
      .subscribe(result => {
        this.restaurants = result;
      });
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
      data: {...restaurant},
    });

    dialogRef.afterClosed().subscribe((result: RestaurantModel) => {
      if (!result) {
        return;
      }
      if (result.uid) {
        // Edit
        this.restaurantService
          .Update({ ...result })
          .then(resultAdd => {
            // TODO: Should implement NotificationService to handle message with toast
            window.alert('Success');
          })
          .catch(error => {
            // TODO: Should implement NotificationService to handle message with toast
            window.alert(error);
          });
      } else {
        // Create
        this.restaurantService
          .Add({ ...result })
          .then(resultAdd => {
            // TODO: Should implement NotificationService to handle message with toast
            window.alert('Success');
          })
          .catch(error => {
            // TODO: Should implement NotificationService to handle message with toast
            window.alert(error);
          });
      }
    });
  }
}
