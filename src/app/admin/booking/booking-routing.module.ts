import { RouterModule } from '@angular/router';

/** Components */
import { BookingComponent } from './booking.component';

export const BookingRoutingModule = RouterModule.forChild([
    { path: '', component: BookingComponent }
]);
