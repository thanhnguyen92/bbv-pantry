import { RouterModule } from '@angular/router';

/** Components */
import { BookingAdminComponent } from './booking.component';

export const BookingRoutingModule = RouterModule.forChild([
    { path: '', component: BookingAdminComponent }
]);
